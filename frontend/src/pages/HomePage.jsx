// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gray-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 drop-shadow-lg">
          Welcome to Sharky!
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-4 max-w-3xl mx-auto">
          Your portal to the underwater world. Explore learning modules, test your knowledge with quizzes,
          and use our predictive model to identify potential shark habitats across the globe.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, staggerChildren: 0.2 }}
      >
        {/* Card for Learning */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link to="/learn" className="block p-8 bg-gray-800 rounded-2xl shadow-lg hover:shadow-cyan-400/30 transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Learn</h2>
            <p className="text-gray-400">Dive into our modules for all skill levels.</p>
          </Link>
        </motion.div>

        {/* Card for Quiz */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link to="/quiz" className="block p-8 bg-gray-800 rounded-2xl shadow-lg hover:shadow-cyan-400/30 transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Quiz</h2>
            <p className="text-gray-400">Challenge yourself and see what you've learned.</p>
          </Link>
        </motion.div>

        {/* Card for Predictor */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link to="/predictor" className="block p-8 bg-gray-800 rounded-2xl shadow-lg hover:shadow-cyan-400/30 transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Predictor</h2>
            <p className="text-gray-400">Use NASA data to find shark hotspots.</p>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;