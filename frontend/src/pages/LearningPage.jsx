// src/pages/LearningPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { learningData } from '../data/learningData';

const levels = ['beginner', 'intermediate', 'expert'];

const LearningPage = () => {
  const [activeLevel, setActiveLevel] = useState(levels[0]);
  const [selectedCard, setSelectedCard] = useState(null);
  const { cards, title: levelTitle } = learningData[activeLevel];

  // Variants for animations
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full h-screen flex flex-col p-4 sm:p-8 bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center w-full max-w-4xl mx-auto flex-shrink-0"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-4">Learning Modules</h1>
        <p className="text-base sm:text-lg text-gray-300 mb-6">
          Choose a level, then click on a card to learn more.
        </p>
      </motion.div>

      {/* Level Selector Tabs */}
      <div className="w-full max-w-md mx-auto mb-6 flex justify-center bg-gray-800 p-2 rounded-xl flex-shrink-0">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`w-full capitalize relative text-sm sm:text-base font-semibold py-2.5 rounded-lg transition-colors
              ${activeLevel === level ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {activeLevel === level && (
              <motion.div
                layoutId="active-level-pill"
                className="absolute inset-0 bg-cyan-600 rounded-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{level}</span>
          </button>
        ))}
      </div>

      {/* Scrollable Content Grid */}
      <div className="flex-grow overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold text-center text-cyan-500 mb-6">{levelTitle}</h2>
        <motion.div
            key={activeLevel} // This key triggers the animation when the level changes
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.07 } }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl mx-auto"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="group relative rounded-xl overflow-hidden cursor-pointer shadow-lg"
              onClick={() => setSelectedCard(card)}
              variants={cardVariants}
              layoutId={`card-container-${card.title}`} 
            >
              <motion.img 
                src={card.image} 
                alt={card.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <h3 className="absolute bottom-0 left-0 p-4 text-lg sm:text-xl font-bold text-white">
                {card.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setSelectedCard(null)} 
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] bg-gray-800 rounded-2xl overflow-hidden flex flex-col"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()} 
            >
              <img src={selectedCard.image} alt={selectedCard.title} className="w-full h-72 object-cover flex-shrink-0" />
              <div className="p-6 sm:p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">{selectedCard.title}</h2>
                {selectedCard.text.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-300 leading-relaxed mb-4">
                        {paragraph}
                    </p>
                ))}
              </div>
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/40 rounded-full p-1"
                onClick={() => setSelectedCard(null)}
              >
                <X size={28} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningPage;