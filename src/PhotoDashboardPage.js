import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, deleteDoc, doc, getDocs, getDoc, orderBy, query, updateDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import './css/PhotoDashboardPage.css';

const storage = getStorage();

// R2 deletion via proxy (if set up) - for now, we'll track which photos need R2 cleanup
const deleteFromR2 = async (storagePath, thumbnailPath) => {
    // Note: Direct R2 deletion from browser requires a backend proxy
    // For now, log the paths that need to be deleted via Telegram bot
    console.log('R2 files to delete via Telegram bot:', { storagePath, thumbnailPath });
    return { storagePath, thumbnailPath };
};

const PhotoDashboardPage = () => {
    // Auth state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [loginError, setLoginError] = useState('');
    const [allowedEmails, setAllowedEmails] = useState([]);

    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingIds, setDeletingIds] = useState([]);

    // Batch selection
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectMode, setSelectMode] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // R2 cleanup tracking
    const [r2CleanupPaths, setR2CleanupPaths] = useState([]);

    // Editing
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [editForm, setEditForm] = useState({ location: '', device: '', latitude: '', longitude: '' });
    const [saving, setSaving] = useState(false);

    // Confirmation dialog
    const [confirmDialog, setConfirmDialog] = useState(null);

    // Location search
    const [locationQuery, setLocationQuery] = useState('');
    const [locationResults, setLocationResults] = useState([]);
    const [searchingLocation, setSearchingLocation] = useState(false);

    // Date filters
    const [uploadDateFilter, setUploadDateFilter] = useState('');
    const [photoDateFilter, setPhotoDateFilter] = useState('');

    // Listen to auth state
    useEffect(() => {
        // Fetch allowed emails from Firestore
        const fetchAllowedEmails = async () => {
            try {
                const settingsDoc = await getDoc(doc(db, 'settings', 'dashboard_auth'));
                if (settingsDoc.exists()) {
                    const data = settingsDoc.data();
                    // Support both single email and array of emails
                    if (data.allowedEmails) {
                        setAllowedEmails(data.allowedEmails);
                    } else if (data.allowedEmail) {
                        setAllowedEmails([data.allowedEmail]);
                    }
                }
            } catch (err) {
                console.error('Error fetching allowed emails:', err);
            }
        };

        fetchAllowedEmails();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Re-fetch allowed emails to get latest
                let emails = allowedEmails;
                try {
                    const settingsDoc = await getDoc(doc(db, 'settings', 'dashboard_auth'));
                    if (settingsDoc.exists()) {
                        const data = settingsDoc.data();
                        emails = data.allowedEmails || (data.allowedEmail ? [data.allowedEmail] : []);
                    }
                } catch (err) {
                    console.error('Error checking auth:', err);
                }

                // Check if user email is allowed
                if (emails.length > 0 && !emails.includes(user.email)) {
                    await signOut(auth);
                    setIsLoggedIn(false);
                    setLoginError('⛔ Unauthorized: This email is not allowed');
                } else {
                    setIsLoggedIn(true);
                }
            } else {
                setIsLoggedIn(false);
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, [allowedEmails]);

    // Google Sign-In
    const handleGoogleLogin = async () => {
        setLoginError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // Auth state change listener will handle the rest
        } catch (err) {
            console.error('Login error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setLoginError('Login cancelled');
            } else {
                setLoginError('Login failed');
            }
        }
    };

    // Logout function
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const loadPhotos = useCallback(async () => {
        try {
            setLoading(true);
            const photosRef = collection(db, 'photos');
            const q = query(photosRef, orderBy('uploadedAt', 'desc'));
            const snapshot = await getDocs(q);
            setPhotos(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        } catch (err) {
            console.error('Failed to load photos:', err);
            setError('Failed to load photos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            loadPhotos();
        }
    }, [loadPhotos, isLoggedIn]);

    // 添加測試照片
    // Filter photos by date
    const filteredPhotos = photos.filter(photo => {
        // Filter by upload date
        if (uploadDateFilter) {
            const uploadDate = photo.uploadedAt;
            let uploadDateStr = '';
            if (uploadDate && typeof uploadDate.toDate === 'function') {
                uploadDateStr = uploadDate.toDate().toISOString().split('T')[0];
            } else if (uploadDate && typeof uploadDate.toMillis === 'function') {
                uploadDateStr = new Date(uploadDate.toMillis()).toISOString().split('T')[0];
            } else if (uploadDate) {
                uploadDateStr = new Date(uploadDate).toISOString().split('T')[0];
            }
            if (uploadDateStr !== uploadDateFilter) {
                return false;
            }
        }

        // Filter by photo date
        if (photoDateFilter) {
            const photoDate = photo.date?.split(' ')[0] || '';
            if (photoDate !== photoDateFilter) {
                return false;
            }
        }

        return true;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPhotos = filteredPhotos.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = async (photo) => {
        console.log('🔴 handleDelete called for photo:', photo.id, photo);
        const confirmMsg = `Delete ${photo.filename || photo.id}?\n\nThis will delete:\n- Firebase metadata\n- Storage files (if applicable)`;
        
        // Use custom confirmation dialog instead of window.confirm
        return new Promise((resolve) => {
            setConfirmDialog({
                message: confirmMsg,
                onConfirm: async () => {
                    setConfirmDialog(null);
                    await performDelete(photo);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmDialog(null);
                    console.log('🔴 User cancelled deletion');
                    resolve(false);
                }
            });
        });
    };

    const performDelete = async (photo) => {
        try {
            setDeletingIds(prev => [...prev, photo.id]);
            setError(''); // Clear previous errors

            console.log('Deleting photo:', photo.id, photo);

            // Delete metadata from Firebase first (this is the most important)
            try {
                await deleteDoc(doc(db, 'photos', photo.id));
                console.log('✅ Deleted from Firestore:', photo.id);
            } catch (firestoreErr) {
                console.error('❌ Firestore delete error:', firestoreErr);
                throw new Error(`Failed to delete from Firestore: ${firestoreErr.message}`);
            }

            // Delete from storage based on provider
            // Check if it's Firebase Storage
            const isFirebaseStorage = photo.storageProvider === 'firebase' || 
                                     (photo.storagePath && !photo.url?.includes('r2.dev') && !photo.url?.includes('cloudflarestorage'));
            
            if (isFirebaseStorage) {
                // Firebase Storage - delete files
                if (photo.storagePath) {
                    try {
                        await deleteObject(ref(storage, photo.storagePath));
                        console.log('✅ Deleted from Firebase Storage:', photo.storagePath);
                    } catch (err) {
                        console.warn('⚠️ Failed to delete main file from Firebase Storage:', err.message);
                        // Don't throw - metadata is already deleted
                    }
                }
                if (photo.thumbnailPath && photo.thumbnailPath !== photo.storagePath) {
                    try {
                        await deleteObject(ref(storage, photo.thumbnailPath));
                        console.log('✅ Deleted thumbnail from Firebase Storage:', photo.thumbnailPath);
                    } catch (err) {
                        console.warn('⚠️ Failed to delete thumbnail from Firebase Storage:', err.message);
                        // Don't throw - metadata is already deleted
                    }
                }
            } else {
                // R2 Storage - extract paths from URL if not already stored
                let storagePath = photo.storagePath;
                let thumbnailPath = photo.thumbnailPath;
                
                if (!storagePath && photo.url) {
                    try {
                        const urlObj = new URL(photo.url);
                        storagePath = urlObj.pathname.substring(1); // Remove leading /
                    } catch (e) {
                        // If URL parsing fails, try to extract path
                        const match = photo.url.match(/\/photos\/([^\/]+)$/);
                        if (match) {
                            storagePath = `photos/${match[1]}`;
                        }
                    }
                }
                
                if (!thumbnailPath && photo.thumbnail) {
                    try {
                        const urlObj = new URL(photo.thumbnail);
                        thumbnailPath = urlObj.pathname.substring(1);
                    } catch (e) {
                        const match = photo.thumbnail.match(/\/photos\/([^\/]+)$/);
                        if (match) {
                            thumbnailPath = `photos/${match[1]}`;
                        }
                    }
                }
                
                // Track for manual cleanup (R2 deletion requires backend)
                if (storagePath || thumbnailPath) {
                    const paths = await deleteFromR2(storagePath, thumbnailPath);
                    setR2CleanupPaths(prev => [...prev, paths]);
                    console.log('📝 R2 files tracked for cleanup:', paths);
                }
            }

            // Reload photos to reflect changes
            await loadPhotos();
            console.log('✅ Photo deleted successfully');

        } catch (err) {
            console.error('❌ Failed to delete photo:', err);
            const errorMsg = err.message || 'Unknown error occurred';
            setError(`❌ Failed to delete photo: ${errorMsg}`);
            alert(`Failed to delete photo: ${errorMsg}\n\nCheck console for details.`);
        } finally {
            // Always clear deleting state
            setDeletingIds(prev => prev.filter(id => id !== photo.id));
        }
    };

    const handleBatchDelete = async () => {
        if (selectedIds.length === 0) return;

        const selectedPhotos = photos.filter(p => selectedIds.includes(p.id));
        const r2Photos = selectedPhotos.filter(p => p.storageProvider !== 'firebase' && p.storagePath);

        let confirmMsg = `Delete ${selectedIds.length} photo(s)?\n\nThis will delete:\n- Firebase metadata for all selected photos`;
        if (r2Photos.length > 0) {
            confirmMsg += `\n\n⚠️ ${r2Photos.length} photo(s) are stored in R2.\nR2 files will need to be deleted via Telegram bot.`;
        }

        // Use custom confirmation dialog instead of window.confirm
        return new Promise((resolve) => {
            setConfirmDialog({
                message: confirmMsg,
                onConfirm: async () => {
                    setConfirmDialog(null);
                    await performBatchDelete(selectedPhotos, selectedIds);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmDialog(null);
                    resolve(false);
                }
            });
        });
    };

    const performBatchDelete = async (selectedPhotos, selectedIds) => {

        try {
            setDeletingIds(selectedIds);
            setError(''); // Clear previous errors

            for (const photo of selectedPhotos) {
                try {
                    // Delete metadata from Firebase first (this is the most important)
                    try {
                        await deleteDoc(doc(db, 'photos', photo.id));
                        console.log('✅ Deleted from Firestore:', photo.id);
                    } catch (firestoreErr) {
                        console.error(`❌ Firestore delete error for ${photo.id}:`, firestoreErr);
                        // Continue with other photos even if one fails
                        continue;
                    }

                    // Delete from storage based on provider
                    // Check if it's Firebase Storage
                    const isFirebaseStorage = photo.storageProvider === 'firebase' || 
                                             (photo.storagePath && !photo.url?.includes('r2.dev') && !photo.url?.includes('cloudflarestorage'));
                    
                    if (isFirebaseStorage) {
                        if (photo.storagePath) {
                            try {
                                await deleteObject(ref(storage, photo.storagePath));
                                console.log('✅ Deleted from Firebase Storage:', photo.storagePath);
                            } catch (err) {
                                console.warn('⚠️ Failed to delete main file from Firebase Storage:', err.message);
                                // Don't throw - metadata is already deleted
                            }
                        }
                        if (photo.thumbnailPath && photo.thumbnailPath !== photo.storagePath) {
                            try {
                                await deleteObject(ref(storage, photo.thumbnailPath));
                                console.log('✅ Deleted thumbnail from Firebase Storage:', photo.thumbnailPath);
                            } catch (err) {
                                console.warn('⚠️ Failed to delete thumbnail from Firebase Storage:', err.message);
                                // Don't throw - metadata is already deleted
                            }
                        }
                    } else {
                        // R2 Storage - extract paths from URL if not already stored
                        let storagePath = photo.storagePath;
                        let thumbnailPath = photo.thumbnailPath;
                        
                        if (!storagePath && photo.url) {
                            try {
                                const urlObj = new URL(photo.url);
                                storagePath = urlObj.pathname.substring(1);
                            } catch (e) {
                                const match = photo.url.match(/\/photos\/([^\/]+)$/);
                                if (match) {
                                    storagePath = `photos/${match[1]}`;
                                }
                            }
                        }
                        
                        if (!thumbnailPath && photo.thumbnail) {
                            try {
                                const urlObj = new URL(photo.thumbnail);
                                thumbnailPath = urlObj.pathname.substring(1);
                            } catch (e) {
                                const match = photo.thumbnail.match(/\/photos\/([^\/]+)$/);
                                if (match) {
                                    thumbnailPath = `photos/${match[1]}`;
                                }
                            }
                        }
                        
                        // Track for manual cleanup (R2 deletion requires backend)
                        if (storagePath || thumbnailPath) {
                            const paths = await deleteFromR2(storagePath, thumbnailPath);
                            setR2CleanupPaths(prev => [...prev, paths]);
                            console.log('📝 R2 files tracked for cleanup:', paths);
                        }
                    }
                } catch (photoErr) {
                    console.error(`Failed to delete photo ${photo.id}:`, photoErr);
                    // Continue with other photos even if one fails
                }
            }

            setSelectedIds([]);
            setSelectMode(false);
            await loadPhotos();

        } catch (err) {
            console.error('Failed to delete photos:', err);
            const errorMsg = err.message || 'Unknown error occurred';
            setError(`❌ Failed to delete photos: ${errorMsg}`);
            alert(`Failed to delete photos: ${errorMsg}`);
        } finally {
            setDeletingIds([]);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        const currentPageIds = paginatedPhotos.map(p => p.id);
        setSelectedIds(prev => {
            const allSelected = currentPageIds.every(id => prev.includes(id));
            if (allSelected) {
                return prev.filter(id => !currentPageIds.includes(id));
            } else {
                return [...new Set([...prev, ...currentPageIds])];
            }
        });
    };

    const clearSelection = () => {
        setSelectedIds([]);
        setSelectMode(false);
    };

    // Open edit modal
    const openEdit = (photo) => {
        setEditingPhoto(photo);
        setEditForm({
            location: photo.location || '',
            device: photo.device || '',
            latitude: photo.gps?.latitude?.toString() || '',
            longitude: photo.gps?.longitude?.toString() || ''
        });
    };

    // Close edit modal
    const closeEdit = () => {
        setEditingPhoto(null);
        setEditForm({ location: '', device: '', latitude: '', longitude: '' });
    };

    // Save edit
    const saveEdit = async () => {
        if (!editingPhoto) return;
        try {
            setSaving(true);

            // Prepare update data
            const updateData = {
                location: editForm.location.trim(),
                device: editForm.device.trim()
            };

            // Add GPS if both lat/lng are provided
            const lat = parseFloat(editForm.latitude);
            const lng = parseFloat(editForm.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                updateData.gps = {
                    latitude: lat,
                    longitude: lng
                };
            } else if (editForm.latitude === '' && editForm.longitude === '') {
                // If both are empty, remove GPS
                updateData.gps = null;
            }

            await updateDoc(doc(db, 'photos', editingPhoto.id), updateData);
            await loadPhotos();
            closeEdit();
        } catch (err) {
            console.error('Failed to save:', err);
            setError('❌ Failed to save');
        } finally {
            setSaving(false);
        }
    };

    // Search location using Nominatim
    const searchLocation = async (query) => {
        if (!query || query.length < 2) {
            setLocationResults([]);
            return;
        }
        try {
            setSearchingLocation(true);
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&accept-language=en`;
            const res = await fetch(url, {
                headers: { 'Accept-Language': 'en' }
            });
            const data = await res.json();

            // Format results to "City, Country" format
            const results = data.map(item => {
                const addr = item.address || {};
                const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || '';
                const country = addr.country || '';
                const formatted = [city, country].filter(Boolean).join(', ');
                return {
                    display: item.display_name,
                    formatted: formatted || item.display_name.split(',').slice(0, 2).join(',').trim(),
                    lat: item.lat,
                    lon: item.lon
                };
            });
            setLocationResults(results);
        } catch (err) {
            console.error('Location search failed:', err);
            setLocationResults([]);
        } finally {
            setSearchingLocation(false);
        }
    };

    // Debounced location search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (locationQuery) {
                searchLocation(locationQuery);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [locationQuery]);

    // Select location from results (also fills in GPS coordinates)
    const selectLocation = (result) => {
        setEditForm(f => ({
            ...f,
            location: result.formatted,
            latitude: result.lat || '',
            longitude: result.lon || ''
        }));
        setLocationQuery('');
        setLocationResults([]);
    };

    // Loading auth state
    if (authLoading) {
        return (
            <div className="photo-dashboard-page">
                <div className="loading-message">Loading...</div>
            </div>
        );
    }

    // Login screen
    if (!isLoggedIn) {
        return (
            <div className="photo-dashboard-page">
                <div className="login-container">
                    <div className="login-box">
                        <h2>📷 Dashboard</h2>
                        <button className="google-login-btn" onClick={handleGoogleLogin}>
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>
                        {loginError && <div className="login-error">{loginError}</div>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="photo-dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p className="subtitle">{filteredPhotos.length} photos {photos.length !== filteredPhotos.length ? `(filtered from ${photos.length})` : ''}</p>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="notice">
                ◎ Telegram → File → <code>loc: Place</code>
            </div>

            {/* Date Filters */}
            <div className="date-filters">
                <div className="date-filter-item">
                    <label>上傳日期 (Upload Date):</label>
                    <input
                        type="date"
                        value={uploadDateFilter}
                        onChange={(e) => {
                            setUploadDateFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="date-input"
                    />
                    {uploadDateFilter && (
                        <button
                            className="clear-date-btn"
                            onClick={() => {
                                setUploadDateFilter('');
                                setCurrentPage(1);
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div className="date-filter-item">
                    <label>照片日期 (Photo Date):</label>
                    <input
                        type="date"
                        value={photoDateFilter}
                        onChange={(e) => {
                            setPhotoDateFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="date-input"
                    />
                    {photoDateFilter && (
                        <button
                            className="clear-date-btn"
                            onClick={() => {
                                setPhotoDateFilter('');
                                setCurrentPage(1);
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Batch Actions */}
            <div className="batch-actions">
                <button
                    className={`action-btn ${selectMode ? 'active' : ''}`}
                    onClick={() => {
                        setSelectMode(!selectMode);
                        if (selectMode) setSelectedIds([]);
                    }}
                >
                    {selectMode ? '✕' : '◉'} Select
                </button>

                {selectMode && (
                    <>
                        <button className="action-btn" onClick={selectAll}>
                            {paginatedPhotos.every(p => selectedIds.includes(p.id)) ? '○' : '●'} Page
                        </button>

                        {selectedIds.length > 0 && (
                            <>
                                <span className="selected-count">{selectedIds.length}</span>
                                <button
                                    className="action-btn danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleBatchDelete();
                                    }}
                                    disabled={deletingIds.length > 0}
                                    type="button"
                                >
                                    {deletingIds.length > 0 ? '◌' : '✕'} Delete
                                </button>
                                <button className="action-btn" onClick={clearSelection}>↺</button>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* R2 Cleanup Notice */}
            {r2CleanupPaths.length > 0 && (
                <div className="r2-cleanup-notice">
                    ⚠️ {r2CleanupPaths.length} R2 files → <code>/delete [id]</code>
                    <button onClick={() => setR2CleanupPaths([])}>✕</button>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {/* Custom Confirmation Dialog */}
            {confirmDialog && (
                <div className="confirm-dialog-overlay" onClick={() => setConfirmDialog(null)}>
                    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-dialog-content">
                            <h3>Confirm Delete</h3>
                            <p style={{ whiteSpace: 'pre-line', margin: '16px 0' }}>{confirmDialog.message}</p>
                        </div>
                        <div className="confirm-dialog-actions">
                            <button
                                className="confirm-btn cancel"
                                onClick={confirmDialog.onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-btn confirm"
                                onClick={confirmDialog.onConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading-message">Loading...</div>
            ) : photos.length === 0 ? (
                <div className="no-items">No photos found.</div>
            ) : (
                <>
                    <div className="dashboard-grid">
                        {paginatedPhotos.map((photo) => (
                            <div
                                key={photo.id}
                                className={`dashboard-card ${selectedIds.includes(photo.id) ? 'selected' : ''} ${deletingIds.includes(photo.id) ? 'deleting' : ''}`}
                                onClick={selectMode ? () => toggleSelect(photo.id) : undefined}
                            >
                                {selectMode && (
                                    <div className="select-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(photo.id)}
                                            onChange={() => toggleSelect(photo.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}

                                <img src={photo.thumbnail || photo.url} alt={photo.filename || photo.id} />

                                <div className="dashboard-meta">
                                    <strong>{photo.filename || photo.id}</strong>
                                    <span>{photo.date || 'N/A'}</span>
                                    <span>{photo.device || 'N/A'}</span>
                                    <span>{photo.location || 'N/A'}</span>
                                    <span className={`storage-badge ${photo.storageProvider === 'firebase' ? 'firebase' : 'r2'}`}>
                                        {photo.storageProvider === 'firebase' ? 'Firebase' : 'R2'}
                                    </span>
                                </div>

                                {!selectMode && (
                                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="edit-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEdit(photo);
                                            }}
                                        >
                                            ⋯
                                        </button>
                                        <button
                                            className="danger-btn"
                                            onClick={(e) => {
                                                console.log('🔴 Delete button clicked for photo:', photo.id);
                                                e.stopPropagation();
                                                e.preventDefault();
                                                console.log('🔴 Calling handleDelete...');
                                                handleDelete(photo);
                                            }}
                                            disabled={deletingIds.includes(photo.id)}
                                            type="button"
                                            style={{ cursor: deletingIds.includes(photo.id) ? 'not-allowed' : 'pointer' }}
                                        >
                                            {deletingIds.includes(photo.id) ? '◌' : '✕'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                ◀
                            </button>

                            <div className="page-info">
                                <span>Page {currentPage} of {totalPages}</span>
                            </div>

                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                ▶
                            </button>

                            <select
                                className="items-per-page"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={12}>12 / page</option>
                                <option value={20}>20 / page</option>
                                <option value={40}>40 / page</option>
                                <option value={60}>60 / page</option>
                            </select>
                        </div>
                    )}
                </>
            )}

            <div className="button-container">
                <Link to="/photos" className="back-home-btn">Back to Photos</Link>
            </div>

            {/* Edit Modal */}
            {editingPhoto && (
                <div className="edit-modal" onClick={closeEdit}>
                    <div className="edit-content" onClick={e => e.stopPropagation()}>
                        <div className="edit-header">
                            <h3>Edit</h3>
                            <button className="close-btn" onClick={closeEdit}>✕</button>
                        </div>

                        <div className="edit-preview">
                            <img src={editingPhoto.thumbnail || editingPhoto.url} alt="" />
                            <span>{editingPhoto.filename || editingPhoto.id}</span>
                        </div>

                        <div className="edit-form">
                            <label>
                                <span className="label-text">◎ Location</span>
                                <div className="location-input-wrapper">
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                                        placeholder="City, Country"
                                    />
                                </div>
                            </label>

                            <label>
                                <span className="label-text">◌ Search</span>
                                <div className="location-search-wrapper">
                                    <input
                                        type="text"
                                        value={locationQuery}
                                        onChange={e => setLocationQuery(e.target.value)}
                                        placeholder="Search city..."
                                    />
                                    {searchingLocation && <span className="search-loading">◌</span>}
                                </div>
                                {locationResults.length > 0 && (
                                    <div className="location-results">
                                        {locationResults.map((result, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="location-result"
                                                onClick={() => selectLocation(result)}
                                            >
                                                <span className="result-formatted">{result.formatted}</span>
                                                <span className="result-full">{result.display}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </label>

                            <label>
                                <span className="label-text">◎ Device</span>
                                <input
                                    type="text"
                                    value={editForm.device}
                                    onChange={e => setEditForm(f => ({ ...f, device: e.target.value }))}
                                    placeholder="Brand Model"
                                />
                            </label>

                            <div className="gps-inputs">
                                <span className="label-text">📍 GPS Coordinates</span>
                                <div className="gps-row">
                                    <input
                                        type="number"
                                        step="any"
                                        value={editForm.latitude}
                                        onChange={e => setEditForm(f => ({ ...f, latitude: e.target.value }))}
                                        placeholder="Latitude (e.g. 25.0330)"
                                    />
                                    <input
                                        type="number"
                                        step="any"
                                        value={editForm.longitude}
                                        onChange={e => setEditForm(f => ({ ...f, longitude: e.target.value }))}
                                        placeholder="Longitude (e.g. 121.5654)"
                                    />
                                </div>
                                <small className="gps-hint">Leave empty to remove GPS. Find coordinates on Google Maps.</small>
                            </div>
                        </div>

                        <div className="edit-actions">
                            <button className="cancel-btn" onClick={closeEdit}>Cancel</button>
                            <button
                                className="save-btn"
                                onClick={saveEdit}
                                disabled={saving}
                            >
                                {saving ? '◌' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoDashboardPage;
