import React, { useState } from 'react';
import styles from '../../styles/Tools/PdfConverter.module.css';
import { FileText, Download, Upload, Trash, File } from 'lucide-react';
import { jsPDF } from 'jspdf'; // Correct import

const PdfConverter = () => {
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    
    // Filter for supported file types
    const supportedFiles = uploadedFiles.filter(file => {
      const validTypes = ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return validTypes.includes(file.type);
    });
    
    if (supportedFiles.length !== uploadedFiles.length) {
      setErrorMessage('Some files were not added. Only TXT and DOC/DOCX files are supported.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
    
    setFiles(prevFiles => [...prevFiles, ...supportedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const convertFiles = async () => {
    if (files.length === 0) {
      setErrorMessage('Please add files to convert.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setIsConverting(true);
    const converted = [];

    for (const file of files) {
      try {
        const doc = new jsPDF();
        
        if (file.type === 'text/plain') {
          // Convert text file
          const text = await readFileAsText(file);
          
          // Simple text formatting
          const lines = text.split('\n');
          let y = 20;
          
          for (const line of lines) {
            // Simple pagination
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
            
            doc.text(line, 10, y);
            y += 7;
          }
        } else {
          // For Word documents, this is a simplified approach
          // In a real app, you would need a more robust library to parse DOCX
          const text = "This is a preview. Word document conversion requires additional libraries.";
          doc.text(text, 10, 20);
          doc.text("Please use a dedicated converter for DOCX files.", 10, 30);
        }
        
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        converted.push({
          name: `${file.name.split('.')[0]}.pdf`,
          url: pdfUrl,
          originalName: file.name
        });
      } catch (error) {
        console.error('Conversion error:', error);
        setErrorMessage(`Error converting ${file.name}`);
      }
    }

    setConvertedFiles(converted);
    setIsConverting(false);
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const downloadPdf = (pdfUrl, fileName) => {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.pdfConverterContainer}>
      <div className={styles.converterHeader}>
        <FileText size={24} className={styles.toolIcon} />
        <h3>PDF Converter</h3>
        <p>Convert text and document files to PDF format</p>
      </div>
      
      <div className={styles.converterContent}>
        <div className={styles.uploadSection}>
          <label className={styles.uploadLabel}>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept=".txt,.doc,.docx"
              className={styles.fileInput}
            />
            <Upload size={24} />
            <span>Click to upload files</span>
            <span className={styles.fileTypes}>TXT, DOC, DOCX</span>
          </label>
          
          {errorMessage && (
            <div className={styles.errorMessage}>
              {errorMessage}
            </div>
          )}
        </div>
        
        {files.length > 0 && (
          <div className={styles.filesSection}>
            <h4>Files to Convert</h4>
            <ul className={styles.filesList}>
              {files.map((file, index) => (
                <li key={index} className={styles.fileItem}>
                  <File size={18} />
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeFile(index)}
                  >
                    <Trash size={16} />
                  </button>
                </li>
              ))}
            </ul>
            
            <button
              className={styles.convertButton}
              onClick={convertFiles}
              disabled={isConverting}
            >
              {isConverting ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>
        )}
        
        {convertedFiles.length > 0 && (
          <div className={styles.resultsSection}>
            <h4>Converted Files</h4>
            <ul className={styles.filesList}>
              {convertedFiles.map((file, index) => (
                <li key={index} className={styles.fileItem}>
                  <FileText size={18} />
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.originalName}>
                    from {file.originalName}
                  </span>
                  <button
                    className={styles.downloadButton}
                    onClick={() => downloadPdf(file.url, file.name)}
                  >
                    <Download size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfConverter;