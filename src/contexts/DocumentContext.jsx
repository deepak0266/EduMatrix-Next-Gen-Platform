import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { extractTextFromPDF, summarizeText } from '../services/summarizerService';

const DocumentContext = createContext();

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const { currentUser } = useAuth();
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [summaryLength, setSummaryLength] = useState('medium'); // 'short', 'medium', 'long'
  const [summaryFormat, setSummaryFormat] = useState('paragraphs'); // 'paragraphs', 'bullets', 'outline'

  // Fetch documents for the current user
  const fetchDocuments = useCallback(async () => {
    if (!currentUser || !currentUser.uid) {
      console.log('No current user or user ID available');
      setDocuments([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          fileName: data.fileName || 'Untitled',
          fileType: data.fileType || 'unknown',
          createdAt: data.createdAt || new Date().toISOString(),
          userId: data.userId,
          subject: data.subject || 'Uncategorized',
          topic: data.topic || '',
          fileURL: data.fileURL || '',
          fileSize: data.fileSize || '',
          hasSummary: data.hasSummary || false, // Track if document has a summary
          summaryId: data.summaryId || null // Reference to summary if exists
        };
      });

      setDocuments(docs);
    }
    catch (err) {
      console.error('Fetch error details:', err.response?.data || err.message);
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch documents');
      return null;
    }
    finally {
      setLoading(false);
    }
  }, [currentUser]);

  const getDocument = async (documentId) => {
    // Check if documentId is valid string
    if (!documentId || typeof documentId !== 'string' || documentId.trim() === '') {
      console.error('❌ Invalid document ID provided to getDocument');
      setError('Invalid document ID');
      return null;
    }

    // Check if user is logged in
    if (!currentUser || !currentUser.uid) {
      console.error('❌ User not authenticated');
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }

      const documentData = docSnap.data();

      // Permission check
      if (documentData.userId !== currentUser.uid) {
        throw new Error('You do not have permission to access this document');
      }

      const documentWithId = {
        id: docSnap.id,
        ...documentData,
      };

      setCurrentDocument(documentWithId);
      return documentWithId;
    } catch (err) {
      console.error('Error getting document:', err);
      setError(err.message || 'Failed to load document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id, updates) => {
    if (!currentUser || !currentUser.uid) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (updates.oldSubject && updates.newSubject) {
        const batch = writeBatch(db);
        const q = query(
          collection(db, 'documents'),
          where('userId', '==', currentUser.uid),
          where('subject', '==', updates.oldSubject)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No documents found with this subject');
        }

        querySnapshot.forEach(docRef => {
          batch.update(docRef.ref, { subject: updates.newSubject });
        });

        await batch.commit();

        setDocuments(prev =>
          prev.map(doc =>
            doc.subject === updates.oldSubject
              ? { ...doc, subject: updates.newSubject }
              : doc
          )
        );
      }
      else if (id) {
        const docRef = doc(db, 'documents', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error('Document not found');
        }

        const docData = docSnap.data();
        if (docData.userId !== currentUser.uid) {
          throw new Error('Permission denied');
        }

        await updateDoc(docRef, updates);

        setDocuments(prev =>
          prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc)
        );
      } else {
        throw new Error('No document ID or subject provided');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper function: Text ko chunks me todta hai
  const splitIntoChunks = (text, maxLength = 3000) => {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      let end = start + maxLength;

      // Break on sentence end (.)
      if (end < text.length) {
        const lastPeriod = text.lastIndexOf('.', end);
        if (lastPeriod > start) {
          end = lastPeriod + 1;
        }
      }

      const chunk = text.slice(start, end).trim();
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
      start = end;
    }

    return chunks;
  };

  // 🧠 Full summarizeDocument function
  const summarizeDocument = async (documentId, length = 'medium', format = 'paragraphs') => {
    if (!currentUser || !currentUser.uid) {
      setSummaryError('User not authenticated');
      return null;
    }
  
    setSummarizing(true);
    setSummaryError(null);
    setSummary(null);
    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }
  
      const documentData = docSnap.data();
  
      // ✅ Permission check
      if (documentData.userId !== currentUser.uid) {
        throw new Error('You do not have permission to access this document');
      }
  
      // ✅ Check document has fileURL
      if (!documentData.fileURL) {
        throw new Error('Document content not available');
      }
  
      // ✅ Extract text from PDF
      const text = await extractTextFromPDF(documentData.fileURL);
  
      // ✅ Split text into chunks
      const chunks = splitIntoChunks(text);
  
      // ✅ Summarize each chunk separately
      let finalSummary = "";
  
      for (const chunk of chunks) {
        const partialSummary = await summarizeText(chunk, length, format); 
        // 👆 Passed format here also
        finalSummary += partialSummary + "\n\n"; 
      }
  
      // ✅ Prepare summary data
      const summaryData = {
        documentId,
        userId: currentUser.uid,
        content: finalSummary.trim(), 
        length,
        format, // 👈 Saved format too
        createdAt: new Date().toISOString()
      };
  
      let summaryId = documentData.summaryId;
  
      if (summaryId) {
        // Update existing summary
        const summaryRef = doc(db, 'summaries', summaryId);
        await updateDoc(summaryRef, summaryData);
      } else {
        // Create new summary
        const summaryRef = await addDoc(collection(db, 'summaries'), summaryData);
        summaryId = summaryRef.id;
  
        // Update document with summaryId reference
        await updateDoc(docRef, {
          hasSummary: true,
          summaryId: summaryId
        });
  
        // Update local documents state
        setDocuments(prevDocs =>
          prevDocs.map(doc =>
            doc.id === documentId
              ? { ...doc, hasSummary: true, summaryId }
              : doc
          )
        );
      }
  
      // ✅ Update UI
      const summaryWithId = {
        id: summaryId,
        ...summaryData
      };
      setSummary(summaryWithId);
      return summaryWithId;
  
    } catch (err) {
      console.error('Summarization error:', err);
      setSummaryError(err.message || 'Failed to summarize document');
      return null;
    } finally {
      setSummarizing(false);
    }
  };
  

  // Get summary for a document

  const getSummary = async (documentId) => {
    if (!currentUser?.uid) return;
  
    try {
      // Clear previous summary
      setSummary(null);
      
      const docSnap = await getDoc(doc(db, 'documents', documentId));
      if (!docSnap.exists()) throw new Error('Document not found');
  
      const documentData = docSnap.data();
      
      // If no summary exists, create new
      if (!documentData.summaryId) {
        return await summarizeDocument(documentId);
      }
  
      // Fetch existing summary
      const summarySnap = await getDoc(doc(db, 'summaries', documentData.summaryId));
      if (summarySnap.exists()) {
        setSummary({ id: summarySnap.id, ...summarySnap.data() });
      }
    } catch (err) {
      setSummaryError(err.message);
    }
  };
  
  

  // Regenerate a summary with a new length
  const regenerateSummary = async (documentId, length = 'medium', format = 'paragraphs') => {
    return await summarizeDocument(documentId, length, format);
  };

  // Save summary to a document
  const saveSummary = async (documentId, summaryContent) => {
    if (!currentUser || !currentUser.uid) {
      setSummaryError('User not authenticated');
      return null;
    }

    setLoading(true);
    setSummaryError(null);

    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }

      const documentData = docSnap.data();

      // Create summary data
      const summaryData = {
        documentId,
        userId: currentUser.uid,
        content: summaryContent,
        length: summaryLength || 'medium',
        format: summaryFormat || 'paragraphs',
        createdAt: new Date().toISOString()
      };

      let summaryId = documentData.summaryId;

      if (summaryId) {
        // Update existing summary
        const summaryRef = doc(db, 'summaries', summaryId);
        await updateDoc(summaryRef, summaryData);
      } else {
        // Create new summary
        const summaryRef = await addDoc(collection(db, 'summaries'), summaryData);
        summaryId = summaryRef.id;

        // Update document with reference to summary
        await updateDoc(docRef, {
          hasSummary: true,
          summaryId: summaryId
        });

        // Update local state
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === documentId
              ? { ...doc, hasSummary: true, summaryId }
              : doc
          )
        );
      }

      const summaryWithId = {
        id: summaryId,
        ...summaryData
      };

      setSummary(summaryWithId);
      return summaryWithId;
    } catch (err) {
      console.error('Error saving summary:', err);
      setSummaryError(err.message || 'Failed to save summary');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete summary
  const deleteSummary = async (documentId) => {
    if (!currentUser || !currentUser.uid) {
      setSummaryError('User not authenticated');
      return;
    }

    setLoading(true);
    setSummaryError(null);

    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }

      const documentData = docSnap.data();

      if (!documentData.summaryId) {
        throw new Error('No summary exists for this document');
      }

      // Delete summary document
      const summaryRef = doc(db, 'summaries', documentData.summaryId);
      await deleteDoc(summaryRef);

      // Update document to remove summary reference
      await updateDoc(docRef, {
        hasSummary: false,
        summaryId: null
      });

      // Update local state
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId
            ? { ...doc, hasSummary: false, summaryId: null }
            : doc
        )
      );

      setSummary(null);
    } catch (err) {
      console.error('Error deleting summary:', err);
      setSummaryError(err.message || 'Failed to delete summary');
    } finally {
      setLoading(false);
    }
  };

  // Updated Cloudinary upload function to use unsigned uploads
  const uploadDocument = async (file, subject, topic, currentFolder) => {
    if (!currentUser || !currentUser.uid) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please upload PDF or TXT files');
      }

      // Upload to Cloudinary using the simplified service
      const uploadedData = await uploadToCloudinary(file);

      if (!uploadedData || !uploadedData.secure_url) {
        throw new Error('Failed to upload file to Cloudinary');
      }

      // Create document in Firestore
      const newDoc = {
        userId: currentUser.uid,
        fileName: file.name,
        fileType: file.type,
        fileURL: uploadedData.secure_url,
        fileSize: uploadedData.bytes || file.size,
        createdAt: new Date().toISOString(),
        subject: subject || 'Uncategorized',
        topic: topic || '',
        hasSummary: false,
        summaryId: null
      };

      const docRef = await addDoc(collection(db, 'documents'), newDoc);
      const savedDocument = { id: docRef.id, ...newDoc };

      // Update local state
      setDocuments(prev => [...prev, savedDocument]);

      return savedDocument;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (!currentUser || !currentUser.uid) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, 'documents', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) throw new Error('Document not found');

      const docData = docSnap.data();
      if (docData.userId !== currentUser.uid) {
        throw new Error('Permission denied');
      }

      // If document has a summary, delete it too
      if (docData.summaryId) {
        const summaryRef = doc(db, 'summaries', docData.summaryId);
        await deleteDoc(summaryRef);
      }

      await deleteDoc(docRef);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete document');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (subjectName) => {
    if (!currentUser || !currentUser.uid) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'documents'),
        where('subject', '==', subjectName),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No documents found in this subject');
      }

      const batch = writeBatch(db);

      // Collect all summary IDs to delete
      const summaryIds = [];
      querySnapshot.forEach(docRef => {
        const docData = docRef.data();
        if (docData.summaryId) {
          summaryIds.push(docData.summaryId);
        }
        batch.delete(docRef.ref);
      });

      // Delete all summaries
      for (const summaryId of summaryIds) {
        const summaryRef = doc(db, 'summaries', summaryId);
        batch.delete(summaryRef);
      }

      await batch.commit();

      setDocuments(prev => prev.filter(doc => doc.subject !== subjectName));
    } catch (err) {
      console.error('Delete subject error:', err);
      setError(err.message || 'Failed to delete subject');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchDocuments();
    } else {
      setDocuments([]);
    }
  }, [currentUser, fetchDocuments]);

  const contextValue = {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    updateDocument,
    deleteSubject,
    fetchDocuments,
    getDocument,
    currentDocument,
    currentFolder,
    setCurrentFolder,
    summarizing,
    summary,
    summaryError,
    summarizeDocument,
    getSummary,
    saveSummary,
    deleteSummary,
    summaryLength,
    setSummaryLength,
    summaryFormat,
    setSummaryFormat,
    regenerateSummary
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
};