// src/App.jsx
import React, { useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import './App.css';

// The root component of the application. It manages the main state.
function App() {
  // State to manage whether the user is in "location selecting" mode.
  const [isSelecting, setIsSelecting] = useState(false);
  // State to store the coordinates of the user-placed marker.
  const [marker, setMarker] = useState(null);
  // State to track if the prediction model is currently running.
  const [isPredicting, setIsPredicting] = useState(false);
  // State to hold the final result from the prediction model.
  const [predictionResult, setPredictionResult] = useState(null);

  /**
   * Handles click events on the map.
   * If in selecting mode, it places a marker and exits selecting mode.
   * @param {L.LatLng} latlng - The lat/lng object from the Leaflet map click event.
   */
  const handleMapClick = (latlng) => {
    if (isSelecting) {
      setMarker({
        // Leaflet uses 'lat' and 'lng', so we map them to our state structure.
        longitude: latlng.lng,
        latitude: latlng.lat,
      });
      setIsSelecting(false); // Automatically turn off selecting mode after placing a marker.
      setPredictionResult(null); // Clear any previous results when a new point is selected.
    }
  };

  return (
    <div className="relative w-screen h-screen flex font-sans bg-gray-800">
      {/* The Sidebar component contains all controls and displays results. */}
      <Sidebar
        isSelecting={isSelecting}
        setIsSelecting={setIsSelecting}
        marker={marker}
        isPredicting={isPredicting}
        setIsPredicting={setIsPredicting}
        predictionResult={predictionResult}
        setPredictionResult={setPredictionResult}
      />
      {/* The Map component displays the Leaflet map and data layers. */}
      <Map
        isSelecting={isSelecting}
        marker={marker}
        onMapClick={handleMapClick}
      />
    </div>
  );
}

export default App;