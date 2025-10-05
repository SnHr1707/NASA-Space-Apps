// src/pages/LearningPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const learningLevels = [
  { level: 'beginner', title: 'Beginner Basics', description: 'Start your journey and learn the fundamentals of the shark world.' },
  { level: 'intermediate', title: 'Intermediate Insights', description: 'Dive deeper into shark biology, behavior, and their ocean ecosystems.' },
  { level: 'expert', title: 'Expert Exploration', description: 'Explore advanced topics like conservation, research, and unique species.' }
];

const LearningPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-5xl font-bold text-center text-cyan-400 mb-4">Learning Modules</h1>
        <p className="text-lg text-gray-300 text-center mb-12">Choose your level and start exploring the fascinating world of sharks.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {learningLevels.map((item, index) => (
          <motion.div
            key={item.level}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(34, 211, 238, 0.2)' }}
          >
            <Link to={`/learn/${item.level}`} className="block h-full p-8 bg-gray-800 rounded-xl shadow-lg transition-transform duration-300">
              <h2 className="text-3xl font-bold text-cyan-400 mb-3">{item.title}</h2>
              <p className="text-gray-400">{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningPage;