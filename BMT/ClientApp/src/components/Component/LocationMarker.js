import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CCol,
  CFormInput,
  CInputGroup,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CRow,
} from '@coreui/react';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useShowToast } from 'src/hooks/useShowToast';

// Leaflet Marker Icon (fix missing icon issue)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Auto-resize map when modal opens
function MapAutoResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);
  return null;
}

// Marker that updates position on click
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

LocationMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  setPosition: PropTypes.func.isRequired,
};

// Geocode location name to coordinates using OpenStreetMap Nominatim API
async function geocodeLocation(name) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    name,
  )}&limit=5`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return data.map((item) => ({
        coords: [parseFloat(item.lat), parseFloat(item.lon)],
        displayName: item.display_name,
      }));
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return [];
}

// Reverse geocode coordinates to location name
async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }
  return null;
}

// Recenter map when center changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

RecenterMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
};

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LocationSelector({ campaignRegData, setCampaignRegData }) {
  const [showMapModal, setShowMapModal] = useState(false);
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(10);
  const [locationSearch, setLocationSearch] = useState('');
  const [mapSearch, setMapSearch] = useState('');
  const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]); // Default center
  const [currentLocationName, setCurrentLocationName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const showToast = useShowToast();
  const dropdownRef = useRef(null);

  // Debounce the map search input
  const debouncedMapSearch = useDebounce(mapSearch, 500);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update location name when position changes (from map click)
  useEffect(() => {
    if (position) {
      reverseGeocode(position[0], position[1]).then((name) => {
        if (name) {
          setCurrentLocationName(name);
        }
      });
    }
  }, [position]);

  // Perform search when debounced value changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedMapSearch.trim().length < 3) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      const results = await geocodeLocation(debouncedMapSearch.trim());
      setSearchResults(results);
      setShowDropdown(results.length > 0);
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedMapSearch]);

  const handleSaveLocation = () => {
    if (!position) return;
    const locationObj = {
      AreaName:
        currentLocationName || `Lat: ${position[0].toFixed(3)}, Lng: ${position[1].toFixed(3)}`,
      lat: position[0],
      lng: position[1],
      radius,
    };
    setCampaignRegData({
      ...campaignRegData,
      locations: [...(campaignRegData.locations || []), locationObj],
    });
    setShowMapModal(false);
    setPosition(null);
    setRadius(10);
    setLocationSearch('');
    setMapSearch('');
    setCurrentLocationName('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Opens map modal, centers on locationSearch if available
  const openMapAtLocation = async (searchText) => {
    if (!searchText.trim()) {
      setPosition(null);
      setMapCenter([30.3753, 69.3451]);
      setCurrentLocationName('');
      setShowMapModal(true);
      return;
    }
    const results = await geocodeLocation(searchText.trim());
    if (results.length > 0) {
      setPosition(results[0].coords);
      setMapCenter(results[0].coords);
      setCurrentLocationName(searchText.trim());
    } else {
      showToast('Location not found. Try a different search.', 'warning');
      setPosition(null);
      setMapCenter([30.3753, 69.3451]);
      setCurrentLocationName('');
    }
    setShowMapModal(true);
  };

  // Handle selecting a location from dropdown
  const handleSelectLocation = (result) => {
    setPosition(result.coords);
    setMapCenter(result.coords);
    setCurrentLocationName(result.displayName);
    setMapSearch('');
    setShowDropdown(false);
    setSearchResults([]);
    showToast('Location selected!', 'success');
  };

  // Get user's current location
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    console.log('handleGetMyLocation');

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setPosition(coords);
        setMapCenter(coords);

        // Get the name of current location
        const name = await reverseGeocode(coords[0], coords[1]);
        if (name) {
          setCurrentLocationName(name);
          setMapSearch('');
        }

        setIsGettingLocation(false);
        showToast('Current location set!', 'success');
      },
      (error) => {
        setIsGettingLocation(false);
        showToast('Unable to retrieve your location', 'error');
        console.error('Geolocation error:', error);
      },
    );
  };

  return (
    <CRow>
      <CCol md="8">
        <h5>Locations</h5>
        <input
          type="text"
          placeholder="Type to search locations and press enter"
          className="form-control"
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!locationSearch.trim()) {
                showToast('Please enter a location', 'warning');
                return;
              }
              openMapAtLocation(locationSearch);
            }
          }}
        />
        <div className="mt-2 d-flex flex-wrap gap-2">
          {(campaignRegData.locations || []).map((loc, index) => (
            <span
              key={index}
              className="bg-secondary me-2 w-auto p-2 rounded-2"
              style={{ fontSize: '0.8rem' }}
              // onClick={() => {
              //   setCampaignRegData({
              //     ...campaignRegData,
              //     locations: campaignRegData.locations.filter((_, i) => i !== index),
              //   });
              // }}
            >
              {loc.AreaName} {loc.radius ? `(${loc.radius} km)` : ''}{' '}
              <span
                className="ms-2 text-danger"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCampaignRegData({
                    ...campaignRegData,
                    locations: campaignRegData.locations.filter((_, i) => i !== index),
                  });
                }}
              >
                ✕
              </span>
            </span>
          ))}
        </div>
      </CCol>

      <CCol md="4" className="locationSetMgTop">
        <CButton
          color="primary"
          size="sm"
          onClick={() => {
            if (!locationSearch.trim()) {
              // setPosition(null);
              // setMapCenter([30.3753, 69.3451]);
              // setCurrentLocationName('');
              setShowMapModal(true);
              handleGetMyLocation();
              return;
            }
            openMapAtLocation(locationSearch);
          }}
        >
          📍 Set Location
        </CButton>
      </CCol>

      <CModal visible={showMapModal} onClose={() => setShowMapModal(false)} size="lg">
        <CModalHeader>Pick Location</CModalHeader>
        <CModalBody>
          {/* Search bar inside modal with dropdown */}
          <div
            ref={dropdownRef}
            style={{ position: 'relative' }}
            className="d-flex flex-row justify-content-between align-items-center mb-2"
          >
            <CInputGroup style={{ width: '75%' }}>
              <CFormInput
                type="text"
                placeholder="Search location on map..."
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowDropdown(true);
                  }
                }}
              />
              {isSearching && (
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                  }}
                >
                  <CSpinner size="sm" />
                </div>
              )}
            </CInputGroup>
            <div>
              <CButton
                color="info"
                size="sm"
                onClick={handleGetMyLocation}
                disabled={isGettingLocation}
                className="py-2"
              >
                {isGettingLocation ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Getting Location...
                  </>
                ) : (
                  '📍 Use My Current Location'
                )}
              </CButton>
            </div>
            {/* Dropdown for search results */}
            {showDropdown && searchResults.length > 0 && (
              <CListGroup
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 9999,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                {searchResults.map((result, index) => (
                  <CListGroupItem
                    key={index}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectLocation(result)}
                    className="d-flex align-items-start"
                  >
                    <span style={{ fontSize: '0.9rem' }}>📍 {result.displayName}</span>
                  </CListGroupItem>
                ))}
              </CListGroup>
            )}
          </div>

          {/* My Location Button */}

          <div
            style={{
              height: '400px',
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {showMapModal && (
              <MapContainer center={mapCenter} zoom={9} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapAutoResize />
                <RecenterMap center={mapCenter} />
                <LocationMarker position={position} setPosition={setPosition} />
                {position && (
                  <Circle
                    center={position}
                    radius={radius * 1000}
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                  />
                )}
              </MapContainer>
            )}
          </div>

          <div className="mt-3">
            <label>Radius: {radius} km</label>
            <input
              type="range"
              min="1"
              max="500"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="form-range"
            />
          </div>

          {/* Display selected location */}
          {position && (
            <div className="mt-3 p-3 bg-light rounded">
              <strong>Selected Location:</strong>
              <div className="mt-2">
                <div>
                  <strong>Name:</strong> {currentLocationName || 'Loading...'}
                </div>
                <div>
                  <strong>Coordinates:</strong> {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </div>
                <div>
                  <strong>Radius:</strong> {radius} km
                </div>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowMapModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveLocation} disabled={!position}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
}

LocationSelector.propTypes = {
  campaignRegData: PropTypes.shape({
    locations: PropTypes.arrayOf(
      PropTypes.shape({
        AreaName: PropTypes.string.isRequired,
        lat: PropTypes.number,
        lng: PropTypes.number,
        radius: PropTypes.number,
      }),
    ),
  }),
  setCampaignRegData: PropTypes.func.isRequired,
};
