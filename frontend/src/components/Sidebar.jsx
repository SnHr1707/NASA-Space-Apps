// src/components/Sidebar.jsx
import React from 'react';
import { runPrediction } from '../utils/prediction';

function Sidebar({
  isSelecting,
  setIsSelecting,
  marker,
  isPredicting,
  setIsPredicting,
  predictionResult,
  setPredictionResult,
}) {

  // Toggles the map selection mode on/off.
  const handleSelectClick = () => {
    setIsSelecting(!isSelecting);
  };

  // Initiates the prediction process when the user clicks the "Predict" button.
  const handlePredictClick = async () => {
    if (!marker) return;
    setIsPredicting(true);
    setPredictionResult(null); // Clear previous results before starting
    const result = await runPrediction(marker);
    setPredictionResult(result);
    setIsPredicting(false);
  };

  return (
    <aside className="absolute md:relative z-10 w-full md:w-96 h-auto md:h-full bg-gray-900 bg-opacity-90 text-white p-6 flex flex-col shadow-lg overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">Shark Predictor</h1>
        <p className="text-gray-400 text-sm">Identify potential shark foraging habitats using NASA satellite data.</p>
      </header>

      {/* Main interactive section with buttons and results */}
      <div className="flex-grow">
        <div className="space-y-4">
          <button
            onClick={handleSelectClick}
            className={`w-full text-lg font-semibold p-3 rounded-lg transition-all duration-200 flex items-center justify-center
              ${isSelecting
                ? 'bg-red-500 hover:bg-red-600' // Style for "Cancel" state
                : 'bg-cyan-500 hover:bg-cyan-600' // Style for "Select" state
              }`}
          >
            {isSelecting ? 'Cancel Selection' : '1. Select Location'}
          </button>

          <button
            onClick={handlePredictClick}
            disabled={!marker || isPredicting} // Button is disabled if no location is selected or if predicting
            className="w-full text-lg font-semibold p-3 rounded-lg transition-all duration-200 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            2. Predict Habitat
          </button>
        </div>

        {/* Display the coordinates of the user-selected point */}
        {marker && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-cyan-300">Selected Point:</h3>
            <p className="text-sm">Longitude: {marker.longitude.toFixed(4)}</p>
            <p className="text-sm">Latitude: {marker.latitude.toFixed(4)}</p>
          </div>
        )}

        {/* Show a loading spinner and message while the prediction is running */}
        {isPredicting && (
          <div className="mt-6 flex flex-col items-center justify-center text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-lg font-semibold">Analyzing Satellite Data...</p>
            <p className="text-sm text-gray-400">Applying prediction model.</p>
          </div>
        )}
        
        {/* Display the final prediction result once it's available */}
        {predictionResult && !isPredicting && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg animate-fade-in">
              <h2 className="text-xl font-bold mb-2 text-cyan-300">Prediction Result</h2>
              <div className="text-center my-4">
                  <p className="text-gray-400 text-sm">PROBABILITY OF FORAGING HABITAT</p>
                  <p className="text-6xl font-bold text-cyan-400">{predictionResult.probability}%</p>
              </div>
              <p className="text-sm">{predictionResult.message}</p>
              <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400 space-y-2">
                  <p>Chlorophyll-a: <span className="font-mono text-cyan-300 float-right">{predictionResult.data.chlorophyll} mg/m³</span></p>
                  <p>Sea Surface Temp: <span className="font-mono text-cyan-300 float-right">{predictionResult.data.sst} °C</span></p>
                  <p>Nearest Zone: <span className="font-mono text-cyan-300 float-right">{predictionResult.data.distanceToZone} km</span></p>
                  <p className="text-gray-500 pt-1">({predictionResult.data.nearestZoneName})</p>
              </div>
          </div>
        )}
      </div>

      <footer className="mt-auto pt-6 text-xs text-gray-500 text-center">
        <p>Data Layers: NASA GIBS (MODIS/Aqua, GHRSST). Not for navigational use.</p>
      </footer>
    </aside>
  );
}

export default Sidebar;