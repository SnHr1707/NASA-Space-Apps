// src/components/Sidebar.jsx
import React from 'react';

// This function now only sends lat/lng to the backend
const runApiPrediction = async (marker) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: marker.latitude,
                longitude: marker.longitude,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // FastAPI sends error details in the 'detail' key
            throw new Error(data.detail || `HTTP error! status: ${response.status}`);
        }

        let message = "";
        if (data.shark_presence_probability > 0.75) {
            message = `High probability. This area shows favorable conditions and is located near a known habitat.`;
        } else if (data.shark_presence_probability > 0.4) {
            message = `Moderate probability. Conditions may be suitable.`;
        } else {
            message = `Low probability. The environmental factors are not ideal for foraging.`;
        }

        return {
            probability: Math.round(data.shark_presence_probability * 100),
            message,
            data: {
                chlorophyll: data.chlorophyll.toFixed(2),
                sst: data.sst.toFixed(2),
                distanceToZone: data.distance_from_coast_km.toFixed(0),
            }
        };

    } catch (error) {
        console.error("Failed to fetch prediction:", error);
        return {
            probability: 'Error',
            message: error.message || 'Could not connect to the prediction server.',
            data: {},
        };
    }
};


function Sidebar({
  isSelecting,
  setIsSelecting,
  marker,
  isPredicting,
  setIsPredicting,
  predictionResult,
  setPredictionResult,
}) {

  const handleSelectClick = () => {
    setIsSelecting(!isSelecting);
  };

  const handlePredictClick = async () => {
    if (!marker) return;
    setIsPredicting(true);
    setPredictionResult(null);

    const result = await runApiPrediction(marker);

    setPredictionResult(result);
    setIsPredicting(false);
  };

  return (
    <aside className="absolute md:relative z-10 w-full md:w-96 h-auto md:h-full bg-gray-900 bg-opacity-90 text-white p-6 flex flex-col shadow-lg overflow-y-auto">
       <header className="mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">Shark Predictor</h1>
        <p className="text-gray-400 text-sm">Predict shark habitats using a model trained on NASA & GBIF data.</p>
      </header>

      <div className="flex-grow">
        <div className="space-y-4">
          <button
            onClick={handleSelectClick}
            className={`w-full text-lg font-semibold p-3 rounded-lg transition-all duration-200 flex items-center justify-center
              ${isSelecting
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
          >
            {isSelecting ? 'Cancel Selection' : '1. Select Location'}
          </button>

          <button
            onClick={handlePredictClick}
            disabled={!marker || isPredicting}
            className="w-full text-lg font-semibold p-3 rounded-lg transition-all duration-200 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            2. Predict Habitat
          </button>
        </div>

        {marker && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-cyan-300">Selected Point:</h3>
            <p className="text-sm">Longitude: {marker.longitude.toFixed(4)}</p>
            <p className="text-sm">Latitude: {marker.latitude.toFixed(4)}</p>
          </div>
        )}

        {isPredicting && (
          <div className="mt-6 flex flex-col items-center justify-center text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-lg font-semibold">Fetching NASA Data...</p>
            <p className="text-sm text-gray-400">This may take a moment.</p>
          </div>
        )}

        {predictionResult && !isPredicting && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg animate-fade-in">
              <h2 className="text-xl font-bold mb-2 text-cyan-300">Prediction Result</h2>
              <div className="text-center my-4">
                  <p className="text-gray-400 text-sm">PROBABILITY OF FORAGING HABITAT</p>
                  <p className={`text-6xl font-bold ${predictionResult.probability === 'Error' ? 'text-red-500' : 'text-cyan-400'}`}>
                    {predictionResult.probability === 'Error' ? 'Error' : `${predictionResult.probability}%`}
                  </p>
              </div>
              <p className="text-sm">{predictionResult.message}</p>
              {predictionResult.data.chlorophyll && (
                <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400 space-y-2">
                    <p>Fetched Chlorophyll-a: <span className="font-mono text-cyan-300 float-right">{predictionResult.data.chlorophyll} mg/m³</span></p>
                    <p>Fetched Sea Surface Temp: <span className="font-mono text-cyan-300 float-right">{predictionResult.data.sst} °C</span></p>
                    <p>Nearest Hotspot: <span className="font-mono text-cyan-300 float-right">{predictionResult.data.distanceToZone} km</span></p>
                </div>
              )}
          </div>
        )}
      </div>

      <footer className="mt-auto pt-6 text-xs text-gray-500 text-center">
        <p>Data Layers: NASA GIBS. Not for navigational use.</p>
      </footer>
    </aside>
  );
}

export default Sidebar;