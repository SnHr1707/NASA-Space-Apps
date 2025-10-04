import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import 'leaflet/dist/leaflet.css';

function App() {
  // State to manage the current theme
  const [theme, setTheme] = useState('dark');

  // Effect to apply the theme class to the root HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    // Dynamic background and text colors for theme switching
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen font-sans">
      <header className="bg-white dark:bg-gray-800 p-4 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
            Sharks from Space
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-1">
            Live Satellite Data Browser
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* We pass the current theme to the map component */}
          <MapComponent theme={theme} />
        </div>
      </main>
    </div>
  );
}

export default App;