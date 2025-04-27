import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useDocuments } from '../contexts/DocumentContext';
import DocumentUpload from '../components/Documents/DocumentUpload';
import styles from '../styles/Pages/DocumentPage.module.css';

// Utility functions
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

const DocumentPage = () => {
  const { documents, loading, error, deleteDocument, updateDocument, deleteSubject } = useDocuments();
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [expandedItem, setExpandedItem] = useState(null);
  const [newName, setNewName] = useState('');

  // Filter and sort documents
  const filteredItems = useMemo(() => {
    if (!documents || documents.length === 0) return [];

    if (currentFolder) {
      return documents
        .filter(doc => doc.subject === currentFolder)
        .filter(doc =>
          doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
      const uniqueSubjects = [...new Set(documents.map(doc => doc?.subject).filter(Boolean))];
      return uniqueSubjects
        .map(subject => ({
          type: 'folder',
          name: subject,
          count: documents.filter(d => d?.subject === subject).length
        }))
        .filter(folder =>
          folder.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
  }, [currentFolder, documents, searchQuery]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else {
        return (a.name || '').localeCompare(b.name || '');
      }
    });
  }, [filteredItems, sortBy]);

  // Handlers
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const toggleViewMode = () => setViewMode(prev => prev === 'grid' ? 'list' : 'grid');

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
  };

  const handleDocumentClick = (documentId) => {
    navigate(`/documents/view/${documentId}`);
  };

  const handleBackToRoot = () => {
    setCurrentFolder(null);
  };

  const handleDelete = async () => {
    if (!modalState.data) return;

    try {
      if (modalState.data.type === 'document') {
        await deleteDocument(modalState.data.id);
      } else {
        await deleteSubject(modalState.data.name);
        if (currentFolder === modalState.data.name) {
          handleBackToRoot();
        }
      }
      closeModal();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleRename = async () => {
    if (!modalState.data) return;

    try {
      if (modalState.data.type === 'document') {
        await updateDocument(modalState.data.id, { fileName: newName });
      } else {
        await updateDocument(null, {
          oldSubject: modalState.data.name,
          newSubject: newName
        });
        if (currentFolder === modalState.data.name) {
          setCurrentFolder(newName);
        }
      }
      closeModal();
    } catch (err) {
      console.error('Rename failed:', err);
    }
  };

  const openModal = (type, data) => {
    setModalState({ type, data });
    if (type === 'rename') {
      setNewName(data.fileName || data.name || '');
    }
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
    setNewName('');
  };

  const openUploadModal = () => {
    setModalState({ 
      type: 'upload', 
      data: { subject: currentFolder } 
    });
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
                <button onClick={handleBackToRoot} className={styles.pathButton}>
                  Documents
                </button>
                <span className={styles.pathSeparator}> / </span>
                <span className={styles.currentPath}>{currentFolder}</span>
              </>
            )}
            {!currentFolder && <span className={styles.currentPath}>All Documents</span>}
          </div>
          <div className={styles.sortControl}>
            <Filter className={styles.filterIcon} />
            <select 
              value={sortBy} 
              onChange={handleSortChange} 
              className={styles.sortSelect}
            >
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
                          <p className={styles.folderCount}>
                            {item.count} document{item.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          className={styles.optionsButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedItem(expandedItem === item.name ? null : item.name);
                          }}
                          aria-label="Show folder options"
                        >
                          <MoreVertical />
                        </button>
                        {expandedItem === item.name && (
                          <div className={styles.optionsMenu}>
                            <button
                              className={styles.optionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal('rename', { ...item, type: 'folder' });
                              }}
                            >
                              <Edit size={16} className={styles.optionIcon} /> Rename
                            </button>
                            <button
                              className={`${styles.optionButton} ${styles.dangerButton}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal('delete', { ...item, type: 'folder' });
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
                      <div 
                        className={styles.documentClickArea} 
                        onClick={() => handleDocumentClick(item.id)}
                      >
                        <FileText className={styles.iconBlue} />
                        <div className={styles.documentInfo}>
                          <h3 className={styles.documentName}>{item.fileName}</h3>
                          <p className={styles.documentMeta}>
                            <Clock className={styles.metaIcon} /> 
                            {formatDate(item.createdAt)}
                            {item.fileSize && (
                              <span className={styles.fileSizeBadge}>
                                {formatFileSize(item.fileSize)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          className={styles.optionsButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedItem(expandedItem === item.id ? null : item.id);
                          }}
                          aria-label="Show document options"
                        >
                          <MoreVertical />
                        </button>
                        {expandedItem === item.id && (
                          <div className={styles.optionsMenu}>
                            <button
                              className={styles.optionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal('rename', { ...item, type: 'document' });
                              }}
                            >
                              <Edit size={16} className={styles.optionIcon} /> Rename
                            </button>
                            <button
                              className={`${styles.optionButton} ${styles.dangerButton}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal('delete', { ...item, type: 'document' });
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
            <h3 className={styles.emptyTitle}>
              {currentFolder ? `${currentFolder} Folder is Empty` : 'No Directories Found'}
            </h3>
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
        {modalState.type === 'upload' && (
          <div className={styles.modalOverlay}>
            <DocumentUpload
              currentFolder={modalState.data?.subject}
              onClose={closeModal}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {modalState.type === 'delete' && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>
                Delete {modalState.data?.type === 'document' ? 'Document' : 'Folder'}?
              </h3>
              <p className={styles.modalText}>
                Are you sure you want to delete "{modalState.data?.fileName || modalState.data?.name}"?
                {modalState.data?.type !== 'document' && (
                  <span className={styles.warningText}>
                    This will delete all documents within this folder.
                  </span>
                )}
              </p>
              <div className={styles.modalActions}>
                <button
                  onClick={closeModal}
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

        {/* Rename Modal */}
        {modalState.type === 'rename' && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>
                Rename {modalState.data?.type}
              </h3>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={styles.editInput}
                autoFocus
              />
              <div className={styles.modalActions}>
                <button
                  onClick={closeModal}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  className={styles.saveButton}
                  disabled={!newName.trim() || newName === modalState.data?.fileName || newName === modalState.data?.name}
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