// src/components/Documents/DocumentUpload.jsx
import React, { useState } from 'react';
import { useDocuments } from '../../contexts/DocumentContext';
import { FiUpload, FiFile } from 'react-icons/fi';
import styles from '../../styles/Documents/DocumentUpload.module.css';

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const { uploadDocument, loading } = useDocuments();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 1024 * 1024) { // 1MB limit
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('File size must be less than 1MB');
    }
  };

  const handleUpload = async () => {
    if (!file || !subject) {
      setError('Please select a file and enter a subject');
      return;
    }

    const result = await uploadDocument(file, subject, topic);
    if (result) {
      setFile(null);
      setSubject('');
      setTopic('');
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadCard}>
        <h2>Upload Document</h2>
        <div className={styles.formGroup}>
          <label>Subject*</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Topic (Optional)</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Algebra"
          />
        </div>
        <div className={styles.fileInput}>
          <label>
            <FiFile className={styles.icon} />
            {file ? file.name : 'Choose a file'}
            <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.docx" hidden />
          </label>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={handleUpload} disabled={loading || !file || !subject}>
          <FiUpload className={styles.icon} />
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;