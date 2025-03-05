// src/contexts/DocumentContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase'; 

const DocumentContext = createContext();

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch documents for the current user
  const fetchDocuments = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'documents'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced update document method to handle both document and subject updates
  const updateDocument = async (id, updates) => {
    setLoading(true);
    try {
      // If updating a subject across multiple documents
      if (updates.oldSubject && updates.newSubject) {
        const batch = writeBatch(db);
        const q = query(
          collection(db, 'documents'), 
          where('userId', '==', currentUser.uid),
          where('subject', '==', updates.oldSubject)
        );
        const querySnapshot = await getDocs(q);
        
        // Update all documents with the old subject
        querySnapshot.forEach(docRef => {
          batch.update(docRef.ref, { subject: updates.newSubject });
        });
        
        await batch.commit();
        
        // Update local state
        setDocuments(prev => 
          prev.map(doc => 
            doc.subject === updates.oldSubject 
              ? {...doc, subject: updates.newSubject} 
              : doc
          )
        );
      } 
      // If updating a single document
      else if (id) {
        await updateDoc(doc(db, 'documents', id), updates);
        setDocuments(prev => 
          prev.map(doc => doc.id === id ? {...doc, ...updates} : doc)
        );
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to update document');
      console.error(err);
      throw err; // Re-throw to allow error handling in UI
    } finally {
      setLoading(false);
    }
  };

  // Upload a new document
  const uploadDocument = async (file, subject, topic = '') => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Check directory limits
      const subjectQuery = query(
        collection(db, 'documents'), 
        where('userId', '==', currentUser.uid),
        where('subject', '==', subject)
      );
      const subjectSnapshot = await getDocs(subjectQuery);
      
      // Allow up to 4 documents per subject
      if (subjectSnapshot.size >= 4) {
        throw new Error('Maximum 4 documents per subject allowed');
      }

      // Check total unique subjects
      const directoriesQuery = query(
        collection(db, 'documents'),
        where('userId', '==', currentUser.uid)
      );
      const directoriesSnapshot = await getDocs(directoriesQuery);
      const uniqueSubjects = new Set(
        directoriesSnapshot.docs.map(doc => doc.data().subject)
      );
      
      // Allow up to 5 unique subjects
      if (uniqueSubjects.size >= 5 && !uniqueSubjects.has(subject)) {
        throw new Error('Maximum 5 subjects allowed');
      }

      // Convert file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const base64File = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'documents'), {
        userId: currentUser.uid,
        fileName: file.name,
        fileType: file.type,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        subject,
        topic,
        content: base64File,
        createdAt: new Date().toISOString()
      });

      // Update state
      const newDoc = { 
        id: docRef.id, 
        fileName: file.name, 
        fileType: file.type, 
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        subject, 
        topic, 
        createdAt: new Date().toISOString() 
      };
      setDocuments(prev => [...prev, newDoc]);
      setError(null);
      return newDoc;
    } catch (err) {
      setError(err.message);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'documents', id));
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete document');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an entire subject (all documents in that subject)
  const deleteSubject = async (subjectName) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'documents'), 
        where('subject', '==', subjectName),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      // Create a batch to delete all documents in the subject
      const batch = writeBatch(db);
      querySnapshot.forEach(docRef => {
        batch.delete(docRef.ref);
      });
      
      await batch.commit();
      
      // Update local state
      setDocuments(prev => prev.filter(doc => doc.subject !== subjectName));
      setError(null);
    } catch (err) {
      setError('Failed to delete subject');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchDocuments();
  }, [currentUser]);

  return (
    <DocumentContext.Provider value={{ 
      documents, 
      loading, 
      error, 
      uploadDocument, 
      deleteDocument,
      updateDocument, 
      deleteSubject, 
      fetchDocuments,
      setDocuments 
    }}>
      {children}
    </DocumentContext.Provider>
  );
};