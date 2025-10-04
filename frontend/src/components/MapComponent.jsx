import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, ImageOverlay, LayersControl, WMSTileLayer } from 'react-leaflet';

// Helper function to format the date correctly for the NASA URL
const formatDateForURL = (date) => {
  const year = date.getUTCFullYear();
  // `getUTCDay()` is day of week, we need day of year.
  // Calculate day of the year
  const start = new Date(Date.UTC(year, 0, 0));
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Pad with leading zeros if necessary
  const dayOfYearStr = String(dayOfYear).padStart(3, '0');
  const monthStr = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dayStr = String(date.getUTCDate()).padStart(2, '0');

  return {
    year: year,
    yearDay: `${year}${dayOfYearStr}`, // e.g., 2025271
    yearMonthDayPath: `${year}/${monthStr}${dayStr}` // e.g., 2025/0928
  };
};

const MapComponent = ({ theme }) => {
  // Default to yesterday's date since today's data might not be available yet
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [selectedDate, setSelectedDate] = useState(yesterday);

  // useMemo will re-calculate the URL only when the selectedDate changes
  const chlorophyllData = useMemo(() => {
    const { year, yearDay, yearMonthDayPath } = formatDateForURL(selectedDate);
    const url = `https://oceancolor.gsfc.nasa.gov/showimages/MODISA/IMAGES/CHL/L3/${yearMonthDayPath}/AQUA_MODIS.2025${yearMonthDayPath.split('/')[1]}.L3m.DAY.CHL.chlor_a.4km.NRT.nc.png`;
    console.log(yearMonthDayPath.split('/')[1]);
    // The image is a global cylindrical projection, so its bounds are the whole world.
    const bounds = [
      [-90, -180],
      [90, 180],
    ];
    return { url, bounds };
  }, [selectedDate]);

  const handleDateChange = (event) => {
    // We need to parse the date as UTC to avoid timezone issues
    const [year, month, day] = event.target.value.split('-').map(Number);
    setSelectedDate(new Date(Date.UTC(year, month - 1, day)));
  };

  const mapCenter = [25.0, -45.0]; // Center map over the Atlantic

  return (
    <div className="relative">
      <MapContainer center={mapCenter} zoom={3} style={{ height: '75vh', width: '100%' }}>
        <LayersControl position="topright">
          {/* BASE MAPS - The user can only select one of these at a time */}
          <LayersControl.BaseLayer checked name="Dark Map">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Color Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </LayersControl.BaseLayer>

          {/* OVERLAYS - The user can toggle these on and off */}
          <LayersControl.Overlay checked name="Chlorophyll Concentration">
            <ImageOverlay
              url={chlorophyllData.url}
              bounds={chlorophyllData.bounds}
              opacity={0.7}
              // This key forces React to re-render the component when the URL changes
              key={chlorophyllData.url} 
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Sea Surface Temperature (SST)">
            {/* This is a WMS layer from NASA GIBS for the dataset you specified */}
            <WMSTileLayer
              url="https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
              params={{
                layers: 'MODIS_Aqua_L3_SST_Thermal_4km_Day_Time',
                format: 'image/png',
                transparent: true
              }}
              opacity={0.7}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      {/* Date Picker Control Panel */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] p-3 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
        <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Select Date for Chlorophyll Data
        </label>
        <input
          type="date"
          id="date-picker"
          className="p-1 rounded border-gray-300 dark:bg-gray-600 dark:text-white"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default MapComponent;