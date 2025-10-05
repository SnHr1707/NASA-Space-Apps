// src/pages/PredictorPage.jsx
import React, { useState } from 'react';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';

const PredictorPage = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [marker, setMarker] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleMapClick = (latlng) => {
    if (isSelecting) {
      setMarker({
        longitude: latlng.lng,
        latitude: latlng.lat,
      });
      setIsSelecting(false);
      setPredictionResult(null);
    }
  };

  return (
    <div className="relative w-full h-full flex">
      <Sidebar
        isSelecting={isSelecting}
        setIsSelecting={setIsSelecting}
        marker={marker}
        isPredicting={isPredicting}
        setIsPredicting={setIsPredicting}
        predictionResult={predictionResult}
        setPredictionResult={setPredictionResult}
      />
      <Map
        isSelecting={isSelecting}
        marker={marker}
        onMapClick={handleMapClick}
      />
    </div>
  );
};

export default PredictorPage;