import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Folder,
  Search,
  Plus,
  MoreVertical,
  Trash,
  Edit,
  Clock,
  Filter,
  Grid,
  List as ListIcon,
  ChevronDown,
  FileDigit,
  SplitSquareVertical
} from 'lucide-react';
import { useDocuments } from '../contexts/DocumentContext';
import { useAuth } from '../contexts/AuthContext';
import DocumentUpload from '../components/Documents/DocumentUpload';
import SplitViewContainer from '../components/Documents/SplitViewContainer';
import styles from '../styles/Pages/DocumentPage.module.css';
import DocumentViewer from '../components/Documents/DocumentViewer';

const DocumentPage = () => {
  const {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    updateDocument,
    deleteSubject,
    summarizeDocument,
    setDocuments,
    summarizing,
    summaryError
  } = useDocuments();
  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newName, setNewName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // New state for summarization
  const [showSplitView, setShowSplitView] = useState(false);
  const [documentToSummarize, setDocumentToSummarize] = useState(null);

  const [newDocument, setNewDocument] = useState({
    file: null,
    subject: '',
    topic: ''
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [expandedOptions, setExpandedOptions] = useState({});

  // Memoized filteredItems with null checks and subject handling
  const filteredItems = useMemo(() => {
    if (!documents || documents.length === 0) return [];

    if (currentFolder) {
      return documents
        .filter(doc => doc.subject === currentFolder)
        .filter(doc =>
          doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          doc.subject // Extra safety check
        );
    }
    else {
      // Create folders from unique subjects and apply search to folder names
      return [...new Set(documents.map(doc => doc?.subject))]
        .filter(subject => subject)
        .map(subject => ({
          type: 'folder',
          name: subject,
          count: documents.filter(d => d?.subject === subject).length
        }))// Continued from previous code...
        .filter(folder =>
          folder.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
  }, [currentFolder, documents, searchQuery]);

  const sortedItems = useMemo(() => {
    return filteredItems.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === 'name') {
        return a.name?.localeCompare(b.name) || 0;
      }
      return 0;
    });
  }, [filteredItems, sortBy]);

  const toggleItemOptions = (itemName) => {
    setExpandedOptions(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const toggleViewMode = () => setViewMode(prev => prev === 'grid' ? 'list' : 'grid');

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    // Pre-fill subject when entering a folder
    setNewDocument(prev => ({ ...prev, subject: folder }));
  };

  const handleDocumentClick = (documentId) => {
    if (!documentId) {
      console.error("Attempted to open document with undefined ID");
      return;
    }
    navigate(`/documents/view/${documentId}`);
  };

  const handleBackToRoot = () => {
    setCurrentFolder(null);
    // Reset subject when going back to root
    setNewDocument(prev => ({ ...prev, subject: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1024 * 1024) { // 1MB limit
      setNewDocument(prev => ({ ...prev, file }));
    } else {
      alert('File size must be less than 1MB');
    }
  };

  const openDocument = (doc) => {
    if (doc.fileURL) {
      // For PDFs, you might want to open in a viewer
      if (doc.fileType === 'application/pdf') {
        setActiveDocument(doc);
        // Close split view if it's open
        setShowSplitView(false);
        setDocumentToSummarize(null);
      } else {
        // For other file types, open in a new tab
        window.open(doc.fileURL, '_blank');
      }
    } else {
      console.error('No file URL available');
    }
  };

  // New function to handle summarize action
  const handleSummarize = (doc) => {
    setDocumentToSummarize(doc);
    setShowSplitView(true);
    setActiveDocument(null); // Close document viewer if open
  };

  const handleUpload = async () => {
    // Ensure subject is set, either from current folder or input
    if (!newDocument.subject) {
      alert('Please enter a subject');
      return;
    }

    if (!newDocument.file) {
      alert('Please select a file');
      return;
    }

    const result = await uploadDocument(
      newDocument.file,
      newDocument.subject,
      newDocument.topic
    );

    if (result) {
      setShowUploadModal(false);
      setNewDocument({ file: null, subject: currentFolder || '', topic: '' });
    }
  };

  const handleDelete = async () => {
    if (itemToDelete?.type === 'document') {
      await deleteDocument(itemToDelete.id);
    } else {
      await deleteSubject(itemToDelete.name);
      // If deleting current folder, go back to root
      if (currentFolder === itemToDelete.name) {
        handleBackToRoot();
      }
    }
    setShowDeleteModal(false);
  };

  const handleRename = async () => {
    if (editingItem?.type === 'document') {
      await updateDocument(editingItem.id, { fileName: newName });
    } else {
      try {
        await updateDocument(null, {
          oldSubject: editingItem.name,
          newSubject: newName
        });
        // Update current folder if renamed
        if (currentFolder === editingItem.name) {
          setCurrentFolder(newName);
        }
      } catch (error) {
        alert('Failed to rename subject');
        return;
      }
    }
    setEditingItem(null);
    setNewName('');
  };

  const formatDate = (dateString) => {
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const openUploadModal = () => {
    // Pre-fill subject if in a specific folder
    if (currentFolder) {
      setNewDocument(prev => ({ ...prev, subject: currentFolder }));
    }
    setShowUploadModal(true);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.documentContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Documents</h1>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.controlsSection}>
          <div className={styles.pathNavigator}>
            {currentFolder && (
              <>
                <button onClick={handleBackToRoot} className={styles.pathButton}>Documents</button>
                <span className={styles.pathSeparator}> / </span>
                <span className={styles.currentPath}>{currentFolder}</span>
              </>
            )}
            {!currentFolder && <span className={styles.currentPath}>All Documents</span>}
          </div>
          <div className={styles.sortControl}>
            <Filter className={styles.filterIcon} />
            <select value={sortBy} onChange={handleSortChange} className={styles.sortSelect}>
              <option value="recent">Recent</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className={styles.viewToggle}>
            <button
              onClick={toggleViewMode}
              className={styles.viewModeButton}
              aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            >
              {viewMode === 'grid' ? <ListIcon /> : <Grid />}
            </button>
            <button
              className={styles.buttonPrimary}
              onClick={openUploadModal}
            >
              <Plus className={styles.buttonIcon} />
              <span>{currentFolder ? 'Add Document' : 'New'}</span>
            </button>
          </div>
        </div>

        {sortedItems.length > 0 ? (
          <div className={viewMode === 'grid' ? styles.gridView : styles.listView}>
            {sortedItems.map(item => (
              <div
                key={item.id || item.name}
                className={`${styles.itemCard} ${styles.itemCardAnimate}`}
              >
                <div className={styles.itemCardHeader}>
                  {item.type === 'folder' ? (
                    <>
                      <div
                        className={styles.folderClickArea}
                        onClick={() => handleFolderClick(item.name)}
                      >
                        <Folder className={styles.iconYellow} />
                        <div className={styles.folderInfo}>
                          <h3 className={styles.folderName}>{item.name}</h3>
                          <p className={styles.folderCount}>{item.count} document{item.count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          className={styles.optionsButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemOptions(item.name);
                          }}
                          aria-label="Show folder options"
                        >
                          <MoreVertical />
                        </button>
                        {expandedOptions[item.name] && (
                          <div className={styles.optionsMenu}>
                            <button
                              className={styles.optionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem({ ...item, type: 'folder' });
                                setNewName(item.name);
                              }}
                            >
                              <Edit size={16} className={styles.optionIcon} /> Rename
                            </button>
                            <button
                              className={`${styles.optionButton} ${styles.dangerButton}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete({ ...item, type: 'folder' });
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash size={16} className={styles.optionIcon} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.documentClickArea} onClick={() => handleDocumentClick(item.id)}>
                        <FileText className={styles.iconBlue} />
                        <div className={styles.documentInfo}>
                          <h3 className={styles.documentName}>{item.fileName}</h3>
                          <p className={styles.documentMeta}>
                            <Clock className={styles.metaIcon} /> {formatDate(item.createdAt)}
                            {item.fileSize && <span className={styles.fileSizeBadge}>{item.fileSize}</span>}
                          </p>
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          className={`${styles.summaryButton} ${item.hasSummary ? styles.hasSummary : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSummarize(item);
                          }}
                          aria-label="Summarize document"
                          title={item.hasSummary ? "View summary" : "Generate summary"}
                        >
                          <SplitSquareVertical size={18} />
                        </button>
                        <button
                          className={styles.optionsButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemOptions(item.id);
                          }}
                          aria-label="Show document options"
                        >
                          <MoreVertical />
                        </button>
                        {expandedOptions[item.id] && (
                          <div className={styles.optionsMenu}>
                            <button
                              className={styles.optionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSummarize(item);
                              }}
                            >
                              <FileDigit size={16} className={styles.optionIcon} /> Summarize
                            </button>
                            <button
                              className={styles.optionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem({ ...item, type: 'document' });
                                setNewName(item.fileName);
                              }}
                            >
                              <Edit size={16} className={styles.optionIcon} /> Rename
                            </button>
                            <button
                              className={`${styles.optionButton} ${styles.dangerButton}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete({ ...item, type: 'document' });
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash size={16} className={styles.optionIcon} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FileText className={styles.emptyIcon} size={48} />
            <h3 className={styles.emptyTitle}>{currentFolder ? `${currentFolder} Folder is Empty` : 'No Directories Found'}</h3>
            <p className={styles.emptyText}>
              {currentFolder
                ? 'Upload your first document to this folder'
                : 'Create your first subject directory to organize your documents'}
            </p>
            <button
              className={`${styles.buttonPrimary} ${styles.emptyButton}`}
              onClick={openUploadModal}
            >
              <Plus className={styles.buttonIcon} />
              {currentFolder ? 'Add Document to Folder' : 'Create First Directory'}
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className={styles.modalOverlay}>
            <DocumentUpload
              currentFolder={currentFolder}
              onClose={() => setShowUploadModal(false)}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Delete {itemToDelete?.type === 'document' ? 'Document' : 'Folder'}?</h3>
              <p className={styles.modalText}>
                Are you sure you want to delete "{itemToDelete?.fileName || itemToDelete?.name}"?
                {itemToDelete?.type !== 'document' && (
                  <span className={styles.warningText}>
                    This will delete all documents within this folder.
                  </span>
                )}
              </p>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Viewer */}
        {activeDocument && (
          <div className={styles.modalOverlay}>
            <DocumentViewer
              documentId={activeDocument.id}
              onClose={() => setActiveDocument(null)}
            />
          </div>
        )}

        {/* Split View Container for Document and Summary */}
        {showSplitView && documentToSummarize && (
          <div className={styles.modalOverlay}>
            <SplitViewContainer
              document={documentToSummarize}
              onClose={() => {
                setShowSplitView(false);
                setDocumentToSummarize(null);
              }}
            />
          </div>
        )}

        {/* Rename Modal */}
        {editingItem && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Rename {editingItem.type}</h3>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={styles.editInput}
                autoFocus
              />
              <div className={styles.modalActions}>
                <button
                  onClick={() => setEditingItem(null)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  className={styles.saveButton}
                  disabled={!newName.trim() || newName === editingItem.fileName || newName === editingItem.name}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentPage;