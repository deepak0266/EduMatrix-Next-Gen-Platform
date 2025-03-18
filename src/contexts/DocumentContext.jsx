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
import axios from 'axios';

// Cloudinary Configuration
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

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
          hasSummary: data.hasSummary || false, // New field for tracking if document has a summary
          summaryId: data.summaryId || null // Reference to summary if exists
        };
      });

      setDocuments(docs);
    }
    catch (err) {
      console.error('Upload error details:', err.response?.data || err.message);
      setError(err.response?.data?.error?.message || err.message || 'Failed to upload document');
      return null;
    }
    finally {
      setLoading(false);
    }
  }, [currentUser]);


  const getDocument = async (documentId) => {
    if (!currentUser || !currentUser.uid) {
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
      if (documentData.userId !== currentUser.uid) {
        throw new Error('You do not have permission to access this document');
      }

      const documentWithId = {
        id: docSnap.id,
        ...documentData
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

  const summarizeDocument = async (documentId, length = 'medium') => {
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
      
      // Verify user has permission to access this document
      if (documentData.userId !== currentUser.uid) {
        throw new Error('You do not have permission to access this document');
      }

      // Check if document content is available
      if (!documentData.fileURL) {
        throw new Error('Document content not available');
      }

      // Mock API call to summarization service
      // In a real implementation, you would call your actual summarization API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              summary: `This is a ${length} summary of the document "${documentData.fileName}". The document discusses important topics related to ${documentData.subject} and specifically covers ${documentData.topic || 'various aspects of the subject'}. In a real implementation, this would be generated by an AI summarization service.`,
              key_points: [
                'First key point extracted from the document',
                'Second important concept from the text',
                'Third significant idea from the content',
                'Fourth notable element from the document'
              ]
            }
          });
        }, 2000); // Simulate API delay
      });

      // Save summary to Firestore
      const summaryData = {
        documentId,
        userId: currentUser.uid,
        content: response.data.summary,
        keyPoints: response.data.key_points,
        length,
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
      console.error('Summarization error:', err);
      setSummaryError(err.message || 'Failed to summarize document');
      return null;
    } finally {
      setSummarizing(false);
    }
  };

  // Get summary for a document
  const getSummary = async (documentId) => {
    if (!currentUser || !currentUser.uid) {
      setSummaryError('User not authenticated');
      return null;
    }

    setSummarizing(true);
    setSummaryError(null);

    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }

      const documentData = docSnap.data();
      
      if (!documentData.summaryId) {
        // No summary exists yet, create one
        return await summarizeDocument(documentId, summaryLength);
      }

      const summaryRef = doc(db, 'summaries', documentData.summaryId);
      const summarySnap = await getDoc(summaryRef);

      if (!summarySnap.exists()) {
        throw new Error('Summary not found');
      }

      const summaryData = summarySnap.data();
      const summaryWithId = {
        id: summarySnap.id,
        ...summaryData
      };

      setSummary(summaryWithId);
      return summaryWithId;
    } catch (err) {
      console.error('Error getting summary:', err);
      setSummaryError(err.message || 'Failed to load summary');
      return null;
    } finally {
      setSummarizing(false);
    }
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
        content: summaryContent.content,
        keyPoints: summaryContent.keyPoints || [],
        length: summaryContent.length || 'medium',
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

  // Corrected Cloudinary upload section in uploadDocument function
  const uploadDocument = async (file, subject, topic = '', currentFolderParam = null) => {
    if (!currentUser || !currentUser.uid) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const finalSubject = currentFolderParam || currentFolder || subject;

      if (!finalSubject) throw new Error('Subject is required');

      // Document limit check
      const subjectQuery = query(
        collection(db, 'documents'),
        where('userId', '==', currentUser.uid),
        where('subject', '==', finalSubject)
      );
      const subjectSnapshot = await getDocs(subjectQuery);
      if (subjectSnapshot.size >= 4) {
        throw new Error('Maximum 4 documents per subject allowed');
      }

      // Subject limit check
      const directoriesQuery = query(
        collection(db, 'documents'),
        where('userId', '==', currentUser.uid)
      );
      const directoriesSnapshot = await getDocs(directoriesQuery);
      const uniqueSubjects = new Set(
        directoriesSnapshot.docs.map(doc => doc.data().subject).filter(Boolean)
      );
      if (uniqueSubjects.size >= 5 && !uniqueSubjects.has(finalSubject)) {
        throw new Error('Maximum 5 subjects allowed');
      }

      // File validation
      const allowedTypes = ['application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please upload PDF or TXT');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      if (!cloudName || !uploadPreset) {
        console.error('Cloudinary configuration missing');
        throw new Error('Upload configuration error. Please contact administrator.');
      }

      console.log("Using cloud name:", cloudName);
      console.log("Using upload preset:", uploadPreset);

      // Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      console.log("Cloudinary Config:", {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
        fileType: file.type,
        fileSize: file.size
      });

      try {
        // Make the upload request with proper URL for raw upload
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },params: {
              upload_preset: uploadPreset,
              api_key: apiKey,
              resource_type: 'raw'
            }
          }
          
        );
        console.log("Upload Response:", response.data);

        const docData = {
          userId: currentUser.uid,
          fileName: file.name,
          fileType: file.type,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          subject: finalSubject,
          topic: topic || '',
          fileURL: response.data.secure_url,
          createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'documents'), docData);
        const newDoc = { id: docRef.id, ...docData };

        setDocuments(prev => [...prev, newDoc]);
        return newDoc;
      } catch (cloudinaryErr) {
        console.error('Cloudinary upload error details:', cloudinaryErr);
        console.error('Response data:', cloudinaryErr.response?.data);
        throw new Error(cloudinaryErr.response?.data?.error?.message || 'File upload failed. Please try again.');
      }
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
      querySnapshot.forEach(docRef => batch.delete(docRef.ref));
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
    // New summarization functions
    summarizing,
    summary,
    summaryError,
    summarizeDocument,
    getSummary,
    saveSummary,
    deleteSummary,
    summaryLength,
    setSummaryLength
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
};