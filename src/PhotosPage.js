import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { FaCamera, FaMapMarkerAlt, FaCalendar, FaCameraRetro, FaCog, FaEdit, FaTimes, FaSortAmountDown, FaGlobeAsia, FaTh, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DatePickerCalendar from './components/DatePickerCalendar';
import './css/PhotosPage.css';

// Custom marker icon for the map
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper function to ensure URL is absolute
const ensureAbsoluteUrl = (url) => {
  if (!url) return null;
  // If already absolute URL (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If relative URL, try to construct absolute URL
  // For R2, this might need the full domain
  console.warn('Relative URL detected:', url);
  return url;
};

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, map
  
  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [monthFilter, setMonthFilter] = useState(''); // Format: YYYY-MM
  const [yearFilter, setYearFilter] = useState(''); // Format: YYYY
  const [availableFilters, setAvailableFilters] = useState({
    locations: [],
    dates: [],
    devices: []
  });

  // Dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null); // 'location' | 'date' | 'device' | 'sort' | 'grid' | null
  
  // Sort state
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Map state
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationPhotos, setLocationPhotos] = useState([]);

  // Grid columns state
  const [gridColumns, setGridColumns] = useState(4);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [slideDirection, setSlideDirection] = useState(null); // 'left' or 'right'

  // Load photos from Firebase
  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const photosRef = collection(db, 'photos');
      const q = query(photosRef, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const photoList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Debug: Log photo URLs to help diagnose image loading issues
      console.log('Loaded photos:', photoList.length);
      if (photoList.length > 0) {
        console.log('Sample photo data:', {
          id: photoList[0].id,
          url: photoList[0].url,
          thumbnail: photoList[0].thumbnail,
          filename: photoList[0].filename,
          storageProvider: photoList[0].storageProvider
        });
      }
      
      setPhotos(photoList);
      
      // Build filter options
      const locations = [...new Set(photoList.map(p => p.location).filter(Boolean))];
      const dates = [...new Set(photoList.map(p => p.date?.split(' ')[0]).filter(Boolean))];
      const devices = [...new Set(photoList.map(p => p.device).filter(Boolean))];
      
      setAvailableFilters({ locations, dates, devices });
    } catch (err) {
      console.error('Error loading photos:', err);
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Filter photos
  const filteredPhotos = photos.filter(photo => {
    // Month filter (YYYY-MM format)
    if (monthFilter) {
      const photoDate = photo.date?.split(' ')[0] || '';
      if (!photoDate.startsWith(monthFilter)) {
        return false;
      }
    }

    // Year filter (YYYY format)
    if (yearFilter) {
      const photoDate = photo.date?.split(' ')[0] || '';
      if (!photoDate.startsWith(yearFilter)) {
        return false;
      }
    }

    // Other filters
    if (filterType === 'all' || !filterValue) return true;
    
    switch (filterType) {
      case 'location':
        return photo.location === filterValue;
      case 'date':
        return photo.date?.startsWith(filterValue);
      case 'device':
        return photo.device === filterValue;
      default:
        return true;
    }
  });

  // Sort photos
  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'date':
        aVal = a.date || '';
        bVal = b.date || '';
        break;
      case 'device':
        aVal = a.device || '';
        bVal = b.device || '';
        break;
      case 'location':
        aVal = a.location || '';
        bVal = b.location || '';
        break;
      default:
        // Handle Firestore Timestamp objects
        if (a.uploadedAt && typeof a.uploadedAt.toDate === 'function') {
          aVal = a.uploadedAt.toDate().toISOString();
        } else if (a.uploadedAt && typeof a.uploadedAt.toMillis === 'function') {
          aVal = a.uploadedAt.toMillis().toString();
        } else {
          aVal = a.uploadedAt ? String(a.uploadedAt) : '';
        }
        
        if (b.uploadedAt && typeof b.uploadedAt.toDate === 'function') {
          bVal = b.uploadedAt.toDate().toISOString();
        } else if (b.uploadedAt && typeof b.uploadedAt.toMillis === 'function') {
          bVal = b.uploadedAt.toMillis().toString();
        } else {
          bVal = b.uploadedAt ? String(b.uploadedAt) : '';
        }
        break;
    }

    // Ensure both values are strings for localeCompare
    const aStr = String(aVal || '');
    const bStr = String(bVal || '');
    
    if (sortOrder === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Clear filter
  const clearFilter = () => {
    setFilterType('all');
    setFilterValue('');
    setMonthFilter('');
    setYearFilter('');
  };

  // Sort options
  const sortOptions = [
    { value: 'uploadedAt', label: 'Upload Time' },
    { value: 'date', label: 'Date Taken' },
    { value: 'device', label: 'Device' },
    { value: 'location', label: 'Location' }
  ];

  // Photos with GPS (from filtered photos so filters apply to map too!)
  const photosWithGPS = sortedPhotos.filter(p => p.gps);

  // Group photos by location for map markers
  const locationGroups = photosWithGPS.reduce((acc, photo) => {
    // Ensure latitude and longitude are numbers
    const lat = typeof photo.gps.latitude === 'number' ? photo.gps.latitude : parseFloat(photo.gps.latitude);
    const lng = typeof photo.gps.longitude === 'number' ? photo.gps.longitude : parseFloat(photo.gps.longitude);
    
    // Skip if invalid coordinates
    if (isNaN(lat) || isNaN(lng)) {
      return acc;
    }
    
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    if (!acc[key]) {
      acc[key] = {
        lat: lat,
        lng: lng,
        location: photo.location,
        photos: []
      };
    }
    acc[key].photos.push(photo);
    return acc;
  }, {});

  // Handle clicking a map marker
  const handleMarkerClick = (group) => {
    setSelectedLocation(group.location || `${group.lat.toFixed(4)}, ${group.lng.toFixed(4)}`);
    setLocationPhotos(group.photos);
  };

  // Close location overlay
  const closeLocationOverlay = () => {
    setSelectedLocation(null);
    setLocationPhotos([]);
  };

  // Pagination logic
  const totalPages = Math.ceil(sortedPhotos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPhotos = sortedPhotos.slice(startIndex, startIndex + itemsPerPage);

  // Navigate with slide animation
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentPage(p => p - 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentPage(p => p + 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterValue, filterType, sortBy, sortOrder]);

  // Grid column options
  const gridOptions = [
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 6, label: '6' },
    { value: 8, label: '8' }
  ];

  // Close dropdown when clicking outside
  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 640px)').matches && viewMode === 'map') {
      setViewMode('grid');
    }
  }, [viewMode]);

  return (
    <div className="photos-page">
      <Link to="/photos/dashboard" className="subtle-dashboard-link subtle-edit-link" title="Edit Dashboard">
        <FaEdit />
      </Link>
      <div className="page-header">
        <h1 className="pixel-page-title">Photos</h1>
        <p className="subtitle">Photography Collection</p>
      </div>

      {/* View Toggle & Filter Section */}
      <div className="filter-section" ref={filterRef}>
        <div className="filter-buttons">
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`filter-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FaCamera /> Grid
            </button>
            <button
              className={`filter-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
              disabled={photosWithGPS.length === 0}
              title={photosWithGPS.length === 0 ? 'No photos with GPS data' : ''}
            >
              <FaGlobeAsia /> Map
            </button>
          </div>

          <div className="filter-divider"></div>

          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => { setFilterType('all'); setFilterValue(''); }}
          >
            All
          </button>
          
          <div className="filter-dropdown">
            <button
              className={`filter-btn ${filterType === 'location' && filterValue ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
            >
              <FaMapMarkerAlt />
            </button>
            {openDropdown === 'location' && availableFilters.locations.length > 0 && (
              <div className="dropdown-menu">
                {availableFilters.locations.map(loc => (
                  <button
                    key={loc}
                    className={filterValue === loc ? 'active' : ''}
                    onClick={() => { setFilterType('location'); setFilterValue(loc); setOpenDropdown(null); }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <button
              className={`filter-btn ${(filterType === 'date' && filterValue) || monthFilter || yearFilter ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
            >
              <FaCalendar />
            </button>
            {openDropdown === 'date' && (
              <div className="dropdown-menu date-picker-menu">
                <div className="date-filter-options">
                  {(monthFilter || yearFilter) && (
                    <div className="active-filter-badge">
                      {monthFilter ? (
                        <>
                          <span className="filter-badge-label">Month:</span>
                          <span className="filter-badge-value">{monthFilter}</span>
                          <button
                            className="filter-badge-clear"
                            onClick={() => {
                              setMonthFilter('');
                              setOpenDropdown(null);
                            }}
                            title="Clear month filter"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="filter-badge-label">Year:</span>
                          <span className="filter-badge-value">{yearFilter}</span>
                          <button
                            className="filter-badge-clear"
                            onClick={() => {
                              setYearFilter('');
                              setOpenDropdown(null);
                            }}
                            title="Clear year filter"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="filter-mode-tabs">
                    <button
                      className={`filter-mode-tab ${!monthFilter && !yearFilter && filterType !== 'date' ? 'active' : ''}`}
                      onClick={() => {
                        setMonthFilter('');
                        setYearFilter('');
                        setFilterType('all');
                        setFilterValue('');
                      }}
                    >
                      All
                    </button>
                    <button
                      className={`filter-mode-tab ${monthFilter ? 'active' : ''}`}
                      onClick={() => {
                        if (!monthFilter) {
                          const now = new Date();
                          setMonthFilter(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
                        }
                        setYearFilter('');
                        setFilterType('all');
                        setFilterValue('');
                      }}
                    >
                      Month
                    </button>
                    <button
                      className={`filter-mode-tab ${yearFilter ? 'active' : ''}`}
                      onClick={() => {
                        if (!yearFilter) {
                          setYearFilter(String(new Date().getFullYear()));
                        }
                        setMonthFilter('');
                        setFilterType('all');
                        setFilterValue('');
                      }}
                    >
                      Year
                    </button>
                    <button
                      className={`filter-mode-tab ${filterType === 'date' && filterValue ? 'active' : ''}`}
                      onClick={() => {
                        setMonthFilter('');
                        setYearFilter('');
                      }}
                    >
                      Date
                    </button>
                  </div>
                  
                  <DatePickerCalendar
                    availableDates={availableFilters.dates}
                    selectedDate={filterType === 'date' ? filterValue : ''}
                    currentMonthFilter={monthFilter}
                    currentYearFilter={yearFilter}
                    onDateSelect={(date) => {
                      setFilterType('date');
                      setFilterValue(date);
                      setMonthFilter('');
                      setYearFilter('');
                      setOpenDropdown(null);
                    }}
                    onClear={() => {
                      setFilterType('all');
                      setFilterValue('');
                      setMonthFilter('');
                      setYearFilter('');
                      setOpenDropdown(null);
                    }}
                    onMonthSelect={(year, month) => {
                      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
                      setMonthFilter(monthStr);
                      setYearFilter('');
                      setFilterType('all');
                      setFilterValue('');
                      setOpenDropdown(null);
                    }}
                    onYearSelect={(year) => {
                      setYearFilter(String(year));
                      setMonthFilter('');
                      setFilterType('all');
                      setFilterValue('');
                      setOpenDropdown(null);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <button
              className={`filter-btn ${filterType === 'device' && filterValue ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'device' ? null : 'device')}
            >
              <FaCameraRetro />
            </button>
            {openDropdown === 'device' && availableFilters.devices.length > 0 && (
              <div className="dropdown-menu">
                {availableFilters.devices.map(device => (
                  <button
                    key={device}
                    className={filterValue === device ? 'active' : ''}
                    onClick={() => { setFilterType('device'); setFilterValue(device); setOpenDropdown(null); }}
                  >
                    {device}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Button */}
          <div className="filter-dropdown">
            <button
              className="filter-btn"
              onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            >
              <FaSortAmountDown />
            </button>
            {openDropdown === 'sort' && (
              <div className="dropdown-menu sort-menu">
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={sortBy === opt.value ? 'active' : ''}
                    onClick={() => {
                      if (sortBy === opt.value) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy(opt.value);
                        setSortOrder('desc');
                      }
                      setOpenDropdown(null);
                    }}
                  >
                    {opt.label} {sortBy === opt.value && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Columns Selector */}
          <div className="filter-dropdown">
            <button
              className="filter-btn"
              onClick={() => setOpenDropdown(openDropdown === 'grid' ? null : 'grid')}
            >
              <FaTh /> {gridColumns}
            </button>
            {openDropdown === 'grid' && (
              <div className="dropdown-menu grid-menu">
                {gridOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={gridColumns === opt.value ? 'active' : ''}
                    onClick={() => { setGridColumns(opt.value); setOpenDropdown(null); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filterValue && (
            <button className="clear-filter" onClick={clearFilter}>
              <FaTimes />
            </button>
          )}
        </div>
        
          {(filterValue || monthFilter || yearFilter) && (
          <div className="active-filter">
              Filtering: <strong>
                {monthFilter ? `Month: ${monthFilter}` : 
                 yearFilter ? `Year: ${yearFilter}` : 
                 filterValue}
              </strong>
              <button className="clear-filter-btn" onClick={clearFilter}>✕</button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Photos content */}
      <div className="photos-container">
        {/* Left Arrow for previous page */}
        {viewMode === 'grid' && totalPages > 1 && currentPage > 1 && (
          <button className="page-arrow page-arrow-left" onClick={goToPrevPage}>
            <FaChevronLeft />
          </button>
        )}

        {/* Right Arrow for next page */}
        {viewMode === 'grid' && totalPages > 1 && currentPage < totalPages && (
          <button className="page-arrow page-arrow-right" onClick={goToNextPage}>
            <FaChevronRight />
          </button>
        )}

        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <>
            <div
              className={`photos-grid cols-${gridColumns} ${slideDirection ? `slide-${slideDirection}` : ''}`}
            >
              {paginatedPhotos.length > 0 ? (
                paginatedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="photo-card"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="photo-thumbnail">
                      <img 
                        src={ensureAbsoluteUrl(photo.thumbnail || photo.url)} 
                        alt={photo.filename}
                        onError={(e) => {
                          const failedUrl = e.target.src;
                          console.error('Failed to load image:', {
                            failedUrl,
                            photoId: photo.id,
                            thumbnail: photo.thumbnail,
                            url: photo.url,
                            storageProvider: photo.storageProvider
                          });
                          // Try fallback to full URL if thumbnail fails
                          const thumbnailUrl = ensureAbsoluteUrl(photo.thumbnail);
                          const fullUrl = ensureAbsoluteUrl(photo.url);
                          if (failedUrl === thumbnailUrl && fullUrl && fullUrl !== thumbnailUrl) {
                            console.log('Trying fallback URL:', fullUrl);
                            e.target.src = fullUrl;
                          } else {
                            // Show placeholder if all attempts fail
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJCMjUyMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNDOUMwQjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                            e.target.style.opacity = '0.5';
                          }
                        }}
                        onLoad={() => {
                          // Reset opacity on successful load
                          if (this && this.style) {
                            this.style.opacity = '1';
                          }
                        }}
                      />
                  </div>
                  <div className="photo-meta">
                    {/* Device */}
                      <div className="meta-row device">
                        <FaCameraRetro className="meta-icon" />
                        <span>{photo.device || 'N/A'}</span>
                      </div>
                    
                    {/* Date */}
                      <div className="meta-row date">
                        <FaCalendar className="meta-icon" />
                        <span>{photo.date ? photo.date.split(' ')[0] : 'N/A'}</span>
                      </div>
                    
                      {/* Camera Settings */}
                      <div className="meta-row settings">
                        <FaCog className="meta-icon" />
                        <span>
                          {(photo.settings?.aperture || photo.settings?.shutter || photo.settings?.iso)
                            ? [
                              // Format aperture if it's a long decimal
                              photo.settings?.aperture 
                                ? (() => {
                                    const aperture = photo.settings.aperture;
                                    if (typeof aperture === 'string' && aperture.startsWith('f/')) {
                                      const num = parseFloat(aperture.replace('f/', ''));
                                      if (!isNaN(num) && num.toString().length > 4) {
                                        return `f/${num.toFixed(1)}`;
                                      }
                                    }
                                    return aperture;
                                  })()
                                : null,
                              photo.settings?.shutter,
                              photo.settings?.iso
                            ].filter(Boolean).join(' · ')
                            : 'N/A'}
                        </span>
                      </div>
                    
                    {/* Focal Length */}
                      <div className="meta-row focal">
                        <span className="focal-badge">
                          {photo.settings?.focalLength 
                            ? (() => {
                                const focal = photo.settings.focalLength;
                                // If it's a string with "mm", extract number and round
                                if (typeof focal === 'string' && focal.includes('mm')) {
                                  const num = parseFloat(focal.replace('mm', ''));
                                  return isNaN(num) ? focal : `${Math.round(num)}mm`;
                                }
                                // If it's a number, round it
                                if (typeof focal === 'number') {
                                  return `${Math.round(focal)}mm`;
                                }
                                return focal;
                              })()
                            : 'N/A'}
                        </span>
                      </div>
                    
                    {/* Location */}
                      <div className="meta-row location">
                        <FaMapMarkerAlt className="meta-icon" />
                        <span>{photo.location || 'N/A'}</span>
                      </div>
                    </div>
                </div>
              ))
            ) : (
              <div className="no-items">
                <p>{photos.length === 0 ? 'No photos yet' : 'No photos match the filter'}</p>
              </div>
            )}
          </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                </button>

                <div className="page-info">
                  <span>{currentPage} / {totalPages}</span>
                </div>

                <button
                  className="page-btn"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight />
                </button>

                <select
                  className="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                  <option value={40}>40</option>
                  <option value={60}>60</option>
                </select>
              </div>
            )}
          </>
        ) : (
          /* Map View */
          <div className="map-view">
            {photosWithGPS.length > 0 ? (
              <MapContainer
                center={[25.0330, 121.5654]}
                zoom={3}
                className="photo-map"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {Object.values(locationGroups).map((group, index) => (
                  <Marker
                    key={index}
                    position={[group.lat, group.lng]}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => handleMarkerClick(group)
                    }}
                  >
                    <Popup>
                      <div className="map-popup">
                        <strong>{group.location || 'Unknown Location'}</strong>
                        <p>{group.photos.length} photo{group.photos.length > 1 ? 's' : ''}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="map-placeholder">
                <FaGlobeAsia />
                <p>No photos with GPS data</p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Location Photos Overlay - Portal to body */}
      {selectedLocation && ReactDOM.createPortal(
              <div className="location-overlay" onClick={closeLocationOverlay}>
                <div className="location-content" onClick={e => e.stopPropagation()}>
                  <div className="location-header">
                    <h2><FaMapMarkerAlt /> {selectedLocation}</h2>
                    <button className="close-btn" onClick={closeLocationOverlay}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className="location-photos-grid">
                    {locationPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="location-photo-card"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                  <img 
                    src={ensureAbsoluteUrl(photo.thumbnail || photo.url)} 
                    alt={photo.filename}
                    onError={(e) => {
                      console.error('Failed to load location image:', photo.thumbnail || photo.url, photo);
                      const thumbnailUrl = ensureAbsoluteUrl(photo.thumbnail);
                      const fullUrl = ensureAbsoluteUrl(photo.url);
                      if (e.target.src === thumbnailUrl && fullUrl && fullUrl !== thumbnailUrl) {
                        e.target.src = fullUrl;
                      } else {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJCMjUyMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNDOUMwQjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                        e.target.style.opacity = '0.5';
                      }
                    }}
                  />
                        <div className="location-photo-info">
                          {photo.date && <span><FaCalendar /> {photo.date.split(' ')[0]}</span>}
                          {photo.device && <span><FaCameraRetro /> {photo.device}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
        </div>,
        document.body
        )}

      {/* Photo Detail Modal - Portal to body */}
      {selectedPhoto && ReactDOM.createPortal(
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content modal-horizontal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>
              <FaTimes />
            </button>
            <div className="modal-image-wrapper">
              <img 
                src={ensureAbsoluteUrl(selectedPhoto.url)} 
                alt={selectedPhoto.filename}
                onError={(e) => {
                  console.error('Failed to load modal image:', selectedPhoto.url, selectedPhoto);
                  // Try thumbnail as fallback
                  const thumbnailUrl = ensureAbsoluteUrl(selectedPhoto.thumbnail);
                  if (thumbnailUrl && thumbnailUrl !== ensureAbsoluteUrl(selectedPhoto.url)) {
                    e.target.src = thumbnailUrl;
                  } else {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzJCMjUyMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNDOUMwQjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                    e.target.style.opacity = '0.5';
                  }
                }}
              />
            </div>
            <div className="modal-info">
              <h3>{selectedPhoto.filename || 'Untitled'}</h3>

              <div className="info-row">
                <FaCalendar />
                <span>{selectedPhoto.date || 'N/A'}</span>
              </div>
              <div className="info-row">
                <FaMapMarkerAlt />
                <span>{selectedPhoto.location || 'N/A'}</span>
              </div>
              <div className="info-row">
                <FaCameraRetro />
                <span>{selectedPhoto.device || 'N/A'}</span>
              </div>

              <div className="info-row settings">
                <FaCog />
                <span>
                  {Object.keys(selectedPhoto.settings || {}).length > 0
                    ? (() => {
                        const settings = selectedPhoto.settings;
                        const formatted = [];
                        if (settings.aperture) {
                          // Format aperture if it's a long decimal
                          const aperture = settings.aperture;
                          if (typeof aperture === 'string' && aperture.startsWith('f/')) {
                            const num = parseFloat(aperture.replace('f/', ''));
                            if (!isNaN(num) && num.toString().length > 4) {
                              formatted.push(`f/${num.toFixed(1)}`);
                            } else {
                              formatted.push(aperture);
                            }
                          } else {
                            formatted.push(aperture);
                          }
                        }
                        if (settings.shutter) formatted.push(settings.shutter);
                        if (settings.iso) formatted.push(settings.iso);
                        return formatted.filter(Boolean).join(' · ') || 'N/A';
                      })()
                    : 'N/A'}
                </span>
              </div>

              {selectedPhoto.gps && (
                <div className="info-row gps">
                  <FaGlobeAsia />
                  <span>
                    {(() => {
                      const lat = typeof selectedPhoto.gps.latitude === 'number' 
                        ? selectedPhoto.gps.latitude 
                        : parseFloat(selectedPhoto.gps.latitude);
                      const lng = typeof selectedPhoto.gps.longitude === 'number' 
                        ? selectedPhoto.gps.longitude 
                        : parseFloat(selectedPhoto.gps.longitude);
                      if (isNaN(lat) || isNaN(lng)) return 'N/A';
                      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    })()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default PhotosPage;
