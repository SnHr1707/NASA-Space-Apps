// src/components/Map.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, useMapEvents, LayersControl, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';

// --- NASA GIBS Tile URL Templates ---
const DATE = '2025-10-02';
const CHLOROPHYLL_URL = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_L3_Chlorophyll_A/default/${DATE}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`;
const SST_URL = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/${DATE}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg`;

// --- Base Map Tile Layer ---
const BASE_MAP_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const BASE_MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// --- Custom styling for the Shark Zone points on the map ---
const sharkZonePointStyle = (feature, latlng) => {
  const marker = L.circleMarker(latlng, {
    radius: 6,
    fillColor: "#ff4e88",
    color: "#ffffff",
    weight: 1.5,
    opacity: 1,
    fillOpacity: 0.8
  });
  marker.bindTooltip(`<b>${feature.properties.name}</b><br>${feature.properties.species}`);
  return marker;
};

// --- Custom Icon for the user's selected marker ---
const selectedMarkerIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDZmNmYxIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiAvPjwvc3ZnPg==',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

function MapClickHandler({ onMapClick, isSelecting }) {
  const map = useMapEvents({
    click(e) {
      if (isSelecting) {
        onMapClick(e.latlng);
      }
    },
  });
  map.getContainer().style.cursor = isSelecting ? 'crosshair' : 'grab';
  return null;
}


function Map({ isSelecting, marker, onMapClick }) {
  const [sharkHotspots, setSharkHotspots] = useState(null);

  // useEffect hook to fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/hotspots');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSharkHotspots(data); // Store the fetched GeoJSON data in state
        console.log("Successfully fetched shark hotspots from backend.");
      } catch (error) {
        console.error("Failed to fetch shark hotspots:", error);
        // Set an empty FeatureCollection on error to prevent the map from crashing
        setSharkHotspots({ type: 'FeatureCollection', features: [] });
      }
    };

    fetchHotspots();
  }, []); // The empty dependency array ensures this runs only once on mount

  const mapCenter = [20, 0];
  const zoomLevel = 3;
  const maxBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

  return (
    <div className="w-full h-full">
        <MapContainer
            center={mapCenter}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', backgroundColor: '#1a202c' }}
            maxBounds={maxBounds}
            minZoom={3}
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Dark Matter Base Map">
                    <TileLayer url={BASE_MAP_URL} attribution={BASE_MAP_ATTRIBUTION} />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay checked name="Sea Surface Temperature (SST)">
                    <TileLayer url={SST_URL} opacity={0.7} />
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Chlorophyll-a Concentration">
                    <TileLayer url={CHLOROPHYLL_URL} opacity={0.7} />
                </LayersControl.Overlay>

                {/* Conditionally render the hotspots layer only when the data has been fetched */}
                {sharkHotspots && (
                  <LayersControl.Overlay checked name="Calculated Shark Hotspots">
                      <FeatureGroup>
                          <GeoJSON data={sharkHotspots} pointToLayer={sharkZonePointStyle} />
                      </FeatureGroup>
                  </LayersControl.Overlay>
                )}
            </LayersControl>

            {marker && (
                <Marker position={[marker.latitude, marker.longitude]} icon={selectedMarkerIcon} />
            )}

            <MapClickHandler onMapClick={onMapClick} isSelecting={isSelecting} />
        </MapContainer>
    </div>
  );
}

export default Map;