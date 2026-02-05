import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, deleteDoc, doc, getDocs, getDoc, orderBy, query, addDoc, updateDoc } from 'firebase/firestore';
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

// 測試用假照片數據
const testPhotos = [
    {
        filename: 'tokyo_tower.jpg',
        url: 'https://picsum.photos/seed/tokyo/1920/1280',
        thumbnail: 'https://picsum.photos/seed/tokyo/480/320',
        device: 'Fujifilm X-T5',
        date: '2024-12-15 14:30',
        location: 'Tokyo, Japan',
        gps: { latitude: 35.6586, longitude: 139.7454 },
        settings: { aperture: 'f/2.8', shutter: '1/500s', iso: 'ISO 400', focalLength: '35mm' },
        storageProvider: 'test'
    },
    {
        filename: 'taipei_101.jpg',
        url: 'https://picsum.photos/seed/taipei/1920/1280',
        thumbnail: 'https://picsum.photos/seed/taipei/480/320',
        device: 'Sony A7IV',
        date: '2024-11-20 18:45',
        location: 'Taipei, Taiwan',
        gps: { latitude: 25.0330, longitude: 121.5654 },
        settings: { aperture: 'f/4.0', shutter: '1/250s', iso: 'ISO 800', focalLength: '24mm' },
        storageProvider: 'test'
    },
    {
        filename: 'paris_eiffel.jpg',
        url: 'https://picsum.photos/seed/paris/1920/1280',
        thumbnail: 'https://picsum.photos/seed/paris/480/320',
        device: 'Canon R6',
        date: '2024-10-05 09:15',
        location: 'Paris, France',
        gps: { latitude: 48.8584, longitude: 2.2945 },
        settings: { aperture: 'f/5.6', shutter: '1/1000s', iso: 'ISO 200', focalLength: '70mm' },
        storageProvider: 'test'
    },
    {
        filename: 'newyork_skyline.jpg',
        url: 'https://picsum.photos/seed/nyc/1920/1280',
        thumbnail: 'https://picsum.photos/seed/nyc/480/320',
        device: 'Nikon Z8',
        date: '2024-09-12 20:00',
        location: 'New York, USA',
        gps: { latitude: 40.7128, longitude: -74.0060 },
        settings: { aperture: 'f/8.0', shutter: '1/60s', iso: 'ISO 1600', focalLength: '50mm' },
        storageProvider: 'test'
    },
    {
        filename: 'sydney_opera.jpg',
        url: 'https://picsum.photos/seed/sydney/1920/1280',
        thumbnail: 'https://picsum.photos/seed/sydney/480/320',
        device: 'Fujifilm X-T5',
        date: '2024-08-28 11:30',
        location: 'Sydney, Australia',
        gps: { latitude: -33.8568, longitude: 151.2153 },
        settings: { aperture: 'f/2.0', shutter: '1/2000s', iso: 'ISO 100', focalLength: '23mm' },
        storageProvider: 'test'
    },
    {
        filename: 'london_bigben.jpg',
        url: 'https://picsum.photos/seed/london/1920/1280',
        thumbnail: 'https://picsum.photos/seed/london/480/320',
        device: 'Sony A7IV',
        date: '2024-07-14 16:20',
        location: 'London, UK',
        gps: { latitude: 51.5007, longitude: -0.1246 },
        settings: { aperture: 'f/4.5', shutter: '1/320s', iso: 'ISO 320', focalLength: '85mm' },
        storageProvider: 'test'
    }
];

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

    // Adding test data
    const [addingTest, setAddingTest] = useState(false);

    // Editing
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [editForm, setEditForm] = useState({ location: '', device: '' });
    const [saving, setSaving] = useState(false);

    // Location search
    const [locationQuery, setLocationQuery] = useState('');
    const [locationResults, setLocationResults] = useState([]);
    const [searchingLocation, setSearchingLocation] = useState(false);

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
    const addTestData = async () => {
        if (!window.confirm('🧪 Add 6 test photos with GPS data?')) return;
        try {
            setAddingTest(true);
            const photosRef = collection(db, 'photos');
            for (const photo of testPhotos) {
                await addDoc(photosRef, {
                    ...photo,
                    uploadedAt: new Date().toISOString()
                });
            }
            await loadPhotos();
            alert('✅ Added 6 test photos!');
        } catch (err) {
            console.error(err);
            setError('❌ Failed to add test data');
        } finally {
            setAddingTest(false);
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(photos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPhotos = photos.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = async (photo) => {
        if (!window.confirm(`Delete ${photo.filename || photo.id}?\n\nThis will delete:\n- Firebase metadata\n- Storage files (if applicable)`)) return;

        try {
            setDeletingIds(prev => [...prev, photo.id]);

            // Delete from storage based on provider
            if (photo.storageProvider === 'firebase') {
                // Firebase Storage - delete files
                if (photo.storagePath) {
                    try {
                        await deleteObject(ref(storage, photo.storagePath));
                    } catch (err) {
                        console.warn('Failed to delete main file:', err.message);
                    }
                }
                if (photo.thumbnailPath && photo.thumbnailPath !== photo.storagePath) {
                    try {
                        await deleteObject(ref(storage, photo.thumbnailPath));
                    } catch (err) {
                        console.warn('Failed to delete thumbnail:', err.message);
                    }
                }
            } else if (photo.storagePath) {
                // R2 Storage - track for manual cleanup
                const paths = await deleteFromR2(photo.storagePath, photo.thumbnailPath);
                setR2CleanupPaths(prev => [...prev, paths]);
            }

            // Delete metadata from Firebase
            await deleteDoc(doc(db, 'photos', photo.id));
            await loadPhotos();

        } catch (err) {
            console.error('Failed to delete photo:', err);
            setError(`Failed to delete photo: ${err.message}`);
        } finally {
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

        if (!window.confirm(confirmMsg)) return;

        try {
            setDeletingIds(selectedIds);

            for (const photo of selectedPhotos) {
                // Delete from storage based on provider
                if (photo.storageProvider === 'firebase') {
                    if (photo.storagePath) {
                        try {
                            await deleteObject(ref(storage, photo.storagePath));
                        } catch (err) {
                            console.warn('Failed to delete main file:', err.message);
                        }
                    }
                    if (photo.thumbnailPath && photo.thumbnailPath !== photo.storagePath) {
                        try {
                            await deleteObject(ref(storage, photo.thumbnailPath));
                        } catch (err) {
                            console.warn('Failed to delete thumbnail:', err.message);
                        }
                    }
                } else if (photo.storagePath) {
                    // R2 Storage - track for manual cleanup
                    const paths = await deleteFromR2(photo.storagePath, photo.thumbnailPath);
                    setR2CleanupPaths(prev => [...prev, paths]);
                }

                // Delete metadata
                await deleteDoc(doc(db, 'photos', photo.id));
            }

            setSelectedIds([]);
            setSelectMode(false);
            await loadPhotos();

        } catch (err) {
            console.error('Failed to delete photos:', err);
            setError(`Failed to delete photos: ${err.message}`);
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
            device: photo.device || ''
        });
    };

    // Close edit modal
    const closeEdit = () => {
        setEditingPhoto(null);
        setEditForm({ location: '', device: '' });
    };

    // Save edit
    const saveEdit = async () => {
        if (!editingPhoto) return;
        try {
            setSaving(true);
            await updateDoc(doc(db, 'photos', editingPhoto.id), {
                location: editForm.location.trim(),
                device: editForm.device.trim()
            });
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

    // Select location from results
    const selectLocation = (result) => {
        setEditForm(f => ({ ...f, location: result.formatted }));
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
                <p className="subtitle">{photos.length} photos</p>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="notice">
                ◎ Telegram → File → <code>loc: Place</code>
            </div>

            {/* Batch Actions */}
            <div className="batch-actions">
                <button
                    className="action-btn test-btn"
                    onClick={addTestData}
                    disabled={addingTest}
                >
                    {addingTest ? '◌' : '✦'} Test
                </button>

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
                                    onClick={handleBatchDelete}
                                    disabled={deletingIds.length > 0}
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
                                    <div className="card-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => openEdit(photo)}
                                        >
                                            ⋯
                                        </button>
                                        <button
                                            className="danger-btn"
                                            onClick={() => handleDelete(photo)}
                                            disabled={deletingIds.includes(photo.id)}
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
