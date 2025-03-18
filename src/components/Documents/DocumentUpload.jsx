import React, { useState, useEffect } from 'react';
import { useDocuments } from '../../contexts/DocumentContext';
import { Upload, X, File, AlertCircle, CheckCircle } from 'lucide-react';
import styles from '../../styles/Documents/DocumentUpload.module.css';

const DocumentUpload = ({ currentFolder, onClose }) => {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { uploadDocument, loading } = useDocuments();

  // Initialize subject from currentFolder prop
  useEffect(() => {
    if (currentFolder) {
      setSubject(currentFolder);
    }
  }, [currentFolder]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  // In the DocumentUpload component, update the processFile function
const processFile = (selectedFile) => {
  if (!selectedFile) return;
  
  // Check file size (5MB limit)
  if (selectedFile.size > 5 * 1024 * 1024) {
    setFile(null);
    setError('File size must be less than 5MB');
    return;
  }
  
  // Make sure these match the types allowed in uploadDocument function
  const allowedTypes = ['application/pdf', 'text/plain'];
  
  if (!allowedTypes.includes(selectedFile.type)) {
    setFile(null);
    setError('File type not supported. Please upload PDF or TXT files');
    return;
  }
  
  setFile(selectedFile);
  setError('');
};


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
  };

  const handleUpload = async () => {
    // Clear previous errors
    setError('');
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (!subject) {
      setError('Please enter a subject');
      return;
    }

    try {
      // Call the uploadDocument function with current parameters
      const result = await uploadDocument(file, subject, topic, currentFolder);
      
      if (result) {
        setUploadSuccess(true);
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    }
  };
  
  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Upload Document</h2>
        </div>
        
        <div className={styles.cardContent}>
          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>
              Subject <span className={styles.required}>*</span>
            </label>
            <input
              id="subject"
              className={`${styles.input} ${currentFolder ? styles.readOnly : ''}`}
              value={subject}
              onChange={(e) => !currentFolder && setSubject(e.target.value)}
              placeholder={currentFolder || 'e.g., Mathematics'}
              required
              readOnly={!!currentFolder}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="topic" className={styles.label}>
              Topic (Optional)
            </label>
            <input
              id="topic"
              className={styles.input}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Algebra"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Document <span className={styles.required}>*</span>
            </label>
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className={styles.dropzoneContent}>
                  <Upload className={styles.uploadIcon} />
                  <div className={styles.dropzoneText}>
                    <p>Drag and drop your file here or</p>
                    <label className={styles.browseLabel}>
                      <span className={styles.browseButton}>
                        Browse Files
                      </span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.txt"
                        className={styles.hiddenInput}
                      />
                    </label>
                    <p className={styles.supportedFormats}>
                      Supported formats: PDF, TXT (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.filePreview}>
                  <div className={styles.fileInfo}>
                    <File className={styles.fileIcon} />
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>({(file.size / 1024).toFixed(2)} KB)</span>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className={styles.removeButton}
                    aria-label="Remove file"
                    type="button"
                  >
                    <X />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <div className={styles.error}>
              <AlertCircle className={styles.errorIcon} />
              <span>{error}</span>
            </div>
          )}
          
          {uploadSuccess && (
            <div className={styles.success}>
              <CheckCircle className={styles.successIcon} />
              <span>Document uploaded successfully!</span>
            </div>
          )}
        </div>
        
        <div className={styles.cardFooter}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || !file || !subject || uploadSuccess}
            className={`${styles.uploadButton} ${(loading || !file || !subject || uploadSuccess) ? styles.disabled : ''}`}
            type="button"
          >
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className={styles.uploadButtonContent}>
                <Upload className={styles.buttonIcon} />
                <span>Upload Document</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;