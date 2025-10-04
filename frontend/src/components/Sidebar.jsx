import React from 'react';

const Sidebar = ({ selectedDate, setSelectedDate, activeLayers, setActiveLayers }) => {

  const handleDateChange = (event) => {
    // We need to parse the date as UTC to avoid timezone issues
    const [year, month, day] = event.target.value.split('-').map(Number);
    setSelectedDate(new Date(Date.UTC(year, month - 1, day)));
  };

  const handleSliderChange = (event) => {
    const dayOfYear = parseInt(event.target.value, 10);
    const newDate = new Date(Date.UTC(selectedDate.getUTCFullYear(), 0, dayOfYear));
    setSelectedDate(newDate);
  }

  const getDayOfYear = (date) => {
    const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  // Helper function to check for leap years
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  const daysInYear = isLeapYear(selectedDate.getUTCFullYear()) ? 366 : 365;

  const handleLayerToggle = (layerName) => {
    setActiveLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 p-4 shadow-lg z-10 flex flex-col space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2 text-cyan-600 dark:text-cyan-400">Controls</h2>
        {/* Date Picker Control Panel */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
          <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Select Date
          </label>
          <input
            type="date"
            id="date-picker"
            className="w-full p-2 rounded border-gray-300 dark:bg-gray-600 dark:text-white"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />
          <div className="mt-4">
             <label htmlFor="date-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Day of Year: {getDayOfYear(selectedDate)}
             </label>
            <input
                type="range"
                id="date-slider"
                min="1"
                max={daysInYear}
                value={getDayOfYear(selectedDate)}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2 text-cyan-600 dark:text-cyan-400">Data Layers</h2>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner space-y-3">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="chlorophyll"
                    checked={activeLayers.chlorophyll}
                    onChange={() => handleLayerToggle('chlorophyll')}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="chlorophyll" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Chlorophyll Concentration
                </label>
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="sst"
                    checked={activeLayers.sst}
                    onChange={() => handleLayerToggle('sst')}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="sst" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Sea Surface Temperature
                </label>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;