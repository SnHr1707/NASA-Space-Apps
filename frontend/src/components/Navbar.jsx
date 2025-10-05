// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeLinkStyle = {
    color: '#22d3ee', // cyan-400
    borderBottom: '2px solid #22d3ee'
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 bg-opacity-80 backdrop-blur-md z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          Sharky
        </NavLink>
        <div className="flex space-x-6 text-lg">
          <NavLink
            to="/"
            className="text-gray-300 hover:text-cyan-400 transition-colors pb-1"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Home
          </NavLink>
          <NavLink
            to="/learn"
            className="text-gray-300 hover:text-cyan-400 transition-colors pb-1"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Learn
          </NavLink>
          <NavLink
            to="/quiz"
            className="text-gray-300 hover:text-cyan-400 transition-colors pb-1"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Quiz
          </NavLink>
          <NavLink
            to="/predictor"
            className="text-gray-300 hover:text-cyan-400 transition-colors pb-1"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Predictor
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;