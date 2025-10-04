// src/components/Map.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, useMapEvents, LayersControl, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import { sharkZones } from '../data/sharkZones';

// --- NASA GIBS Tile URL Templates ---
// These URLs point to NASA's tile service for specific data layers and dates.
const DATE = '2025-10-02'; // Note: This date should be dynamic in a real-time application.
const CHLOROPHYLL_URL = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_L3_Chlorophyll_A/default/${DATE}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`;
const SST_URL = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/${DATE}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg`;

// --- Base Map Tile Layer ---
const BASE_MAP_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const BASE_MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// --- Create a GeoJSON object from our shark zone data for display ---
const sharkZonesGeoJSON = {
  type: 'FeatureCollection',
  features: sharkZones.map(zone => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: zone.coords },
    properties: { name: zone.name, species: zone.species } // Add properties for tooltips
  }))
};

// --- Custom styling for the Shark Zone points on the map ---
const sharkZonePointStyle = (feature, latlng) => {
  const marker = L.circleMarker(latlng, {
    radius: 6,
    fillColor: "#ff4e88", // A distinct pink/red color
    color: "#ffffff",
    weight: 1.5,
    opacity: 1,
    fillOpacity: 0.8
  });
  // Add a tooltip to each zone marker
  marker.bindTooltip(`<b>${feature.properties.name}</b><br>${feature.properties.species}`);
  return marker;
};

// --- Custom Icon for the user's selected marker ---
const selectedMarkerIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDZmNmYxIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiAvPjwvc3ZnPg==',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});


/**
 * A helper component that listens for map events like clicks and updates the cursor style.
 * This is the standard way to handle imperative map events in React-Leaflet.
 */
function MapClickHandler({ onMapClick, isSelecting }) {
  const map = useMapEvents({
    click(e) {
      if (isSelecting) {
        onMapClick(e.latlng);
      }
    },
  });
  // Update cursor style dynamically based on whether the user is in selection mode.
  map.getContainer().style.cursor = isSelecting ? 'crosshair' : 'grab';
  return null;
}


function Map({ isSelecting, marker, onMapClick }) {
  const mapCenter = [20, 0]; // A more central initial view
  const zoomLevel = 3;
  // Define the boundaries of the map. This prevents the user from panning infinitely.
  const maxBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

  return (
    <div className="w-full h-full">
        <MapContainer 
            center={mapCenter} 
            zoom={zoomLevel} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%', backgroundColor: '#1a202c' }}
            maxBounds={maxBounds} // Apply map boundaries
            minZoom={3} // Prevent zooming out too far
        >
            <LayersControl position="topright">
                {/* Base Layer */}
                <LayersControl.BaseLayer checked name="Dark Matter Base Map">
                    <TileLayer url={BASE_MAP_URL} attribution={BASE_MAP_ATTRIBUTION} />
                </LayersControl.BaseLayer>

                {/* Overlay Layers */}
                <LayersControl.Overlay checked name="Sea Surface Temperature (SST)">
                    <TileLayer url={SST_URL} opacity={0.7} />
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Chlorophyll-a Concentration">
                    <TileLayer url={CHLOROPHYLL_URL} opacity={0.7} />
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Known Shark Zones">
                    <FeatureGroup>
                        <GeoJSON data={sharkZonesGeoJSON} pointToLayer={sharkZonePointStyle} />
                    </FeatureGroup>
                </LayersControl.Overlay>
            </LayersControl>

            {/* User-selected marker is placed on top of all layers */}
            {marker && (
                <Marker position={[marker.latitude, marker.longitude]} icon={selectedMarkerIcon} />
            )}

            {/* Component to handle map clicks */}
            <MapClickHandler onMapClick={onMapClick} isSelecting={isSelecting} />
        </MapContainer>
    </div>
  );
}

export default Map;