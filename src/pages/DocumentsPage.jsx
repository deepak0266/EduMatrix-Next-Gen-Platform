import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { useDocuments } from '../contexts/DocumentContext';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Pages/DocumentPage.module.css';

const DocumentPage = () => {
  const { 
    documents, 
    loading, 
    error, 
    uploadDocument, 
    deleteDocument, 
    updateDocument, 
    deleteSubject,
    setDocuments
  } = useDocuments();
  const { currentUser } = useAuth();

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

    return (currentFolder
      ? documents
          .filter(doc => doc?.subject === currentFolder)
      : [...new Set(documents.map(doc => doc?.subject))]
          .filter(subject => subject)
          .map(subject => ({
            type: 'folder',
            name: subject,
            count: documents.filter(d => d?.subject === subject).length
          }))
    ).filter(item => 
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentFolder, documents, searchQuery]);

  const sortedItems = useMemo(() => {
    return filteredItems.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
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
    // Logic to open/preview document
    // This could be setting state to show a preview modal or triggering a download
    setActiveDocument(doc);
    // You might want to add additional logic here, like opening the document
    console.log('Opening document:', doc);
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
                <button onClick={handleBackToRoot}>Documents</button>
                <span> / </span>
                <span>{currentFolder}</span>
              </>
            )}
            {!currentFolder && <span>All Documents</span>}
          </div>
          <div className={styles.sortControl}>
            <Filter />
            <select value={sortBy} onChange={handleSortChange}>
              <option value="recent">Recent</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className={styles.viewToggle}>
            <button onClick={toggleViewMode}>
              {viewMode === 'grid' ? <ListIcon /> : <Grid />}
            </button>
            <button
              className={styles.buttonPrimary}
              onClick={openUploadModal}
            >
              <Plus />
              New
            </button>
          </div>
        </div>

        {sortedItems.length > 0 ? (
          <div className={viewMode === 'grid' ? styles.gridView : styles.listView}>
            {sortedItems.map(item => (
              <div 
                key={item.name} 
                className={styles.itemCard}
                onClick={() => item.type === 'folder' ? handleFolderClick(item.name) : openDocument(item)}
              >
                <div className={styles.itemCardHeader}>
                  {item.type === 'folder' ? (
                    <>
                      <Folder className={styles.iconYellow} />
                      <div className={styles.folderInfo}>
                        <h3>{item.name}</h3>
                        <p>{item.count} document{item.count !== 1 ? 's' : ''}</p>
                      </div>
                      <div className={styles.itemActions}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemOptions(item.name);
                          }}
                        >
                          <MoreVertical />
                        </button>
                        {expandedOptions[item.name] && (
                          <div className={styles.optionsMenu}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem({...item, type: 'folder'});
                                setNewName(item.name);
                              }}
                            >
                              <Edit size={16} /> Rename
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete(item);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash size={16} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <FileText className={styles.iconBlue} />
                      <div className={styles.documentInfo}>
                        <h3>{item.fileName}</h3>
                        <p>
                          <Clock /> {formatDate(item.createdAt)}
                          {item.fileSize && ` · ${item.fileSize}`}
                        </p>
                      </div>
                      <div className={styles.itemActions}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemOptions(item.id);
                          }}
                        >
                          <MoreVertical />
                        </button>
                        {expandedOptions[item.id] && (
                          <div className={styles.optionsMenu}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem({...item, type: 'document'});
                                setNewName(item.fileName);
                              }}
                            >
                              <Edit size={16} /> Rename
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete(item);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash size={16} /> Delete
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
            <FileText className={styles.iconBlue} size={48} />
            <h3>No documents found</h3>
            <p>{searchQuery ? `No results for "${searchQuery}"` : (currentFolder ? `No documents in ${currentFolder}` : 'This folder is empty')}</p>
            <button
              className={styles.buttonPrimary}
              onClick={openUploadModal}
            >
              <Plus />
              Add Document
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Upload Document</h2>
              <div className={styles.formGroup}>
                <label>Subject*</label>
                <input
                  type="text"
                  value={newDocument.subject}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder={currentFolder ? `Currently in ${currentFolder}` : 'e.g., Mathematics'}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Topic (Optional)</label>
                <input
                  type="text"
                  value={newDocument.topic}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., Algebra"
                />
              </div>
              <div className={styles.fileInput}>
                <label>
                  <FileText className={styles.icon} />
                  {newDocument.file ? newDocument.file.name : 'Choose a file'}
                  <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.docx" hidden />
                </label>
              </div>
              <div className={styles.modalActions}>
                <button onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button onClick={handleUpload}>Upload</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Delete {itemToDelete?.type === 'document' ? 'Document' : 'Folder'}?</h3>
              <p>Are you sure you want to delete "{itemToDelete?.fileName || itemToDelete?.name}"?</p>
              <div className={styles.modalActions}>
                <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button onClick={handleDelete} className={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {editingItem && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Rename {editingItem.type}</h3>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={styles.editInput}
              />
              <div className={styles.modalActions}>
                <button onClick={() => setEditingItem(null)}>Cancel</button>
                <button onClick={handleRename}>Save</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentPage;