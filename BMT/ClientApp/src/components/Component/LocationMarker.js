import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CCol,
} from "@coreui/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useShowToast } from 'src/hooks/useShowToast';

// Leaflet Marker Icon (fix missing icon issue)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
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
    name
  )}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
        displayName: data[0].display_name,
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
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

export default function LocationSelector({
  campaignRegData,
  setCampaignRegData,
}) {
  const [showMapModal, setShowMapModal] = useState(false);
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(10);
  const [locationSearch, setLocationSearch] = useState("");
  const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]); // Default center
  const [currentLocationName, setCurrentLocationName] = useState("");
  const showToast = useShowToast();

  const handleSaveLocation = () => {
    if (!position) return;
    const locationObj = {
      // Save the searched location name or fallback to lat,lng string
      AreaName: currentLocationName || `Lat: ${position[0].toFixed(3)}, Lng: ${position[1].toFixed(3)}`,
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
    setLocationSearch("");
    setCurrentLocationName("");
  };

  // Opens map modal, centers on locationSearch if available
  const openMapAtLocation = async (searchText) => {
    if (!searchText.trim()) {
      // Open modal with default center and no marker
      setPosition(null);
      setMapCenter([30.3753, 69.3451]);
      setCurrentLocationName("");
      setShowMapModal(true);
      return;
    }
    const result = await geocodeLocation(searchText.trim());
    if (result) {
      setPosition(result.coords);
      setMapCenter(result.coords);
      setCurrentLocationName(searchText.trim()); // save input text as name
    } else {
      showToast('Location not found. Try a different search.', 'warning');
      setPosition(null);
      setMapCenter([30.3753, 69.3451]);
      setCurrentLocationName("");
    }
    setShowMapModal(true);
  };

  return (
    <>
      <CCol md="4">
        <h5>Locations</h5>
        <input
          type="text"
          placeholder="Type to search locations and press enter"
          className="form-control"
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!locationSearch.trim()) {
               // alert("Please enter a location");
                showToast('Please enter a location', 'warning');

                return;
              }
              openMapAtLocation(locationSearch);
            }
          }}
        />
        <div className="mt-2">
          {(campaignRegData.locations || []).map((loc, index) => (
            <span
              key={index}
              className="badge bg-primary me-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCampaignRegData({
                  ...campaignRegData,
                  locations: campaignRegData.locations.filter((_, i) => i !== index),
                });
              }}
            >
              {loc.AreaName} {loc.radius ? `(${loc.radius} km)` : ""} ✕
            </span>
          ))}
        </div>
      </CCol>

      <CCol md="2" className="locationSetMgTop">
        <CButton
          color="primary"
          size="sm"
          onClick={() => {
            if (!locationSearch.trim()) {
              // If input empty, just open map modal with default center
              setPosition(null);
              setMapCenter([30.3753, 69.3451]);
              setCurrentLocationName("");
              setShowMapModal(true);
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
          <div
            style={{
              height: "400px",
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {showMapModal && (
              <MapContainer center={mapCenter} zoom={9} style={{ height: "100%", width: "100%" }}>
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
                    pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
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
    </>
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
      })
    ),
  }),
  setCampaignRegData: PropTypes.func.isRequired,
};
