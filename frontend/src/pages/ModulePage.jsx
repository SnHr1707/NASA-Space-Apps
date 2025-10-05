// src/pages/ModulePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { learningData } from '../data/learningData';

const ModulePage = () => {
  const { level } = useParams();
  const moduleContent = learningData[level];
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainContentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(prev + 1, moduleContent.cards.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moduleContent]);

  useEffect(() => {
    // Focus the main content area to ensure keydown events are captured
    mainContentRef.current?.focus();
  }, []);


  if (!moduleContent) {
    return <div className="text-center p-10">Module not found! <Link to="/learn" className="text-cyan-400">Go back</Link></div>;
  }

  const { title, cards } = moduleContent;
  const currentCard = cards[currentIndex];

  const cardVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="flex h-full bg-gray-900" ref={mainContentRef} tabIndex={-1}>
      {/* Sidebar */}
      <aside className="w-1/4 h-full bg-gray-800 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 sticky top-0 bg-gray-800 py-2">{title}</h2>
        <nav>
          <ul>
            {cards.map((card, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => setCurrentIndex(index)}
                  className={`w-full text-left p-2 rounded transition-colors duration-200 ${
                    index === currentIndex ? 'bg-cyan-500 text-white font-semibold' : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {card.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-10 flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl flex items-center space-x-8">
              <div className="w-1/2">
                <h3 className="text-4xl font-bold text-cyan-400 mb-4">{currentCard.title}</h3>
                <p className="text-gray-300 leading-relaxed">{currentCard.text}</p>
              </div>
              <div className="w-1/2">
                <img src={currentCard.image} alt={currentCard.title} className="rounded-lg w-full h-auto object-cover shadow-lg" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute bottom-10 flex space-x-4">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="px-6 py-2 bg-cyan-500 rounded hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            &larr; Previous
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1))}
            disabled={currentIndex === cards.length - 1}
            className="px-6 py-2 bg-cyan-500 rounded hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Next &rarr;
          </button>
        </div>
      </main>
    </div>
  );
};

export default ModulePage;