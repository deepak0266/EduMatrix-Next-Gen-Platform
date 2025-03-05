// src/components/Documents/DocumentList.jsx
import React from 'react';
import { useDocuments } from '../../contexts/DocumentContext';
import { FiFolder, FiFileText, FiTrash } from 'react-icons/fi';
import styles from '../../styles/Documents/DocumentList.module.css';

const DocumentList = () => {
  const { documents, loading, error, deleteDocument } = useDocuments();

  // Group documents by subject
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.subject]) acc[doc.subject] = [];
    acc[doc.subject].push(doc);
    return acc;
  }, {});

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.documentList}>
      {Object.keys(groupedDocuments).map((subject) => (
        <div key={subject} className={styles.subjectGroup}>
          <h3>
            <FiFolder className={styles.icon} />
            {subject} ({groupedDocuments[subject].length}/4)
          </h3>
          <div className={styles.documents}>
            {groupedDocuments[subject].map((doc) => (
              <div key={doc.id} className={styles.documentItem}>
                <FiFileText className={styles.icon} />
                <div className={styles.documentInfo}>
                  <p>{doc.fileName}</p>
                  <small>{doc.topic || 'No topic'}</small>
                </div>
                <button onClick={() => deleteDocument(doc.id)} className={styles.deleteButton}>
                  <FiTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;