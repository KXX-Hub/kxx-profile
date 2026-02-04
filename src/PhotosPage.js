import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaCamera, FaMapMarkerAlt, FaCalendar, FaCameraRetro, FaCog, FaTimes, FaSortAmountDown, FaGlobeAsia } from 'react-icons/fa';
import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, map
  
  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [availableFilters, setAvailableFilters] = useState({
    locations: [],
    dates: [],
    devices: []
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Map state
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationPhotos, setLocationPhotos] = useState([]);

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
        aVal = a.uploadedAt || '';
        bVal = b.uploadedAt || '';
    }
    
    if (sortOrder === 'asc') {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });

  // Clear filter
  const clearFilter = () => {
    setFilterType('all');
    setFilterValue('');
  };

  // Sort options
  const sortOptions = [
    { value: 'uploadedAt', label: 'Upload Time' },
    { value: 'date', label: 'Date Taken' },
    { value: 'device', label: 'Device' },
    { value: 'location', label: 'Location' }
  ];

  // Photos with GPS
  const photosWithGPS = photos.filter(p => p.gps);

  // Group photos by location for map markers
  const locationGroups = photosWithGPS.reduce((acc, photo) => {
    const key = `${photo.gps.latitude.toFixed(4)},${photo.gps.longitude.toFixed(4)}`;
    if (!acc[key]) {
      acc[key] = {
        lat: photo.gps.latitude,
        lng: photo.gps.longitude,
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

  return (
    <div className="photos-page">
      <div className="page-header">
        <h1><FaCamera /> Photos</h1>
        <p className="subtitle">Photography Collection</p>
      </div>

      {/* View Toggle & Filter Section */}
      <div className="filter-section">
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
              className={`filter-btn ${filterType === 'location' ? 'active' : ''}`}
              onClick={() => setFilterType('location')}
            >
              <FaMapMarkerAlt /> Location
            </button>
            {filterType === 'location' && availableFilters.locations.length > 0 && (
              <div className="dropdown-menu">
                {availableFilters.locations.map(loc => (
                  <button
                    key={loc}
                    className={filterValue === loc ? 'active' : ''}
                    onClick={() => setFilterValue(loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <button
              className={`filter-btn ${filterType === 'date' ? 'active' : ''}`}
              onClick={() => setFilterType('date')}
            >
              <FaCalendar /> Date
            </button>
            {filterType === 'date' && availableFilters.dates.length > 0 && (
              <div className="dropdown-menu">
                {availableFilters.dates.map(date => (
                  <button
                    key={date}
                    className={filterValue === date ? 'active' : ''}
                    onClick={() => setFilterValue(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <button
              className={`filter-btn ${filterType === 'device' ? 'active' : ''}`}
              onClick={() => setFilterType('device')}
            >
              <FaCameraRetro /> Device
            </button>
            {filterType === 'device' && availableFilters.devices.length > 0 && (
              <div className="dropdown-menu">
                {availableFilters.devices.map(device => (
                  <button
                    key={device}
                    className={filterValue === device ? 'active' : ''}
                    onClick={() => setFilterValue(device)}
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
              className={`filter-btn sort-btn`}
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <FaSortAmountDown /> Sort
            </button>
            {showSortMenu && (
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
                    }}
                  >
                    {opt.label} {sortBy === opt.value && (sortOrder === 'asc' ? '↑' : '↓')}
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
        
        {filterValue && (
          <div className="active-filter">
            Filtering: <strong>{filterValue}</strong>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Photos content */}
      <div className="photos-container">
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="photos-grid">
            {sortedPhotos.length > 0 ? (
              sortedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="photo-card"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="photo-thumbnail">
                    <img src={photo.thumbnail || photo.url} alt={photo.filename} />
                  </div>
                  <div className="photo-meta">
                    {/* Device */}
                    {photo.device && (
                      <div className="meta-row device">
                        <FaCameraRetro className="meta-icon" />
                        <span>{photo.device}</span>
                      </div>
                    )}
                    
                    {/* Date */}
                    {photo.date && (
                      <div className="meta-row date">
                        <FaCalendar className="meta-icon" />
                        <span>{photo.date.split(' ')[0]}</span>
                      </div>
                    )}
                    
                    {/* Camera Settings */}
                    {(photo.settings?.aperture || photo.settings?.shutter || photo.settings?.iso) && (
                      <div className="meta-row settings">
                        <FaCog className="meta-icon" />
                        <span>
                          {[
                            photo.settings?.aperture,
                            photo.settings?.shutter,
                            photo.settings?.iso
                          ].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    )}
                    
                    {/* Focal Length */}
                    {photo.settings?.focalLength && (
                      <div className="meta-row focal">
                        <span className="focal-badge">{photo.settings.focalLength}</span>
                      </div>
                    )}
                    
                    {/* Location */}
                    {photo.location && (
                      <div className="meta-row location">
                        <FaMapMarkerAlt className="meta-icon" />
                        <span>{photo.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">
                <p>{photos.length === 0 ? 'No photos yet' : 'No photos match the filter'}</p>
              </div>
            )}
          </div>
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

            {/* Location Photos Overlay */}
            {selectedLocation && (
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
                        <img src={photo.thumbnail || photo.url} alt={photo.filename} />
                        <div className="location-photo-info">
                          {photo.date && <span><FaCalendar /> {photo.date.split(' ')[0]}</span>}
                          {photo.device && <span><FaCameraRetro /> {photo.device}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>
              <FaTimes />
            </button>
            <img src={selectedPhoto.url} alt={selectedPhoto.filename} />
            <div className="modal-info">
              <h3>{selectedPhoto.filename}</h3>
              
              {selectedPhoto.date && (
                <p><FaCalendar /> {selectedPhoto.date}</p>
              )}
              
              {selectedPhoto.location && (
                <p><FaMapMarkerAlt /> {selectedPhoto.location}</p>
              )}
              
              {selectedPhoto.device && (
                <p><FaCameraRetro /> {selectedPhoto.device}</p>
              )}
              
              {Object.keys(selectedPhoto.settings || {}).length > 0 && (
                <div className="settings-info">
                  <FaCog /> 
                  {Object.values(selectedPhoto.settings).join(' | ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="button-container">
        <Link to="/" className="back-home-btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default PhotosPage;
