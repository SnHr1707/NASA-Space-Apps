// src/pages/QuizPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizData } from '../data/quizData';

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', color: '' });

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ message: 'Correct!', color: 'bg-green-500' });
    } else {
      setFeedback({ message: 'Not quite!', color: 'bg-red-500' });
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
      setFeedback({ message: '', color: '' }); // Reset feedback
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const questionVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-gray-900">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        {showScore ? (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <h2 className="text-4xl font-bold text-cyan-400 mb-4">Quiz Complete!</h2>
            <p className="text-2xl mb-8">You scored {score} out of {quizData.length}</p>
            <button onClick={restartQuiz} className="px-8 py-3 bg-cyan-500 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">
              Restart Quiz
            </button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                variants={questionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-cyan-400">
                    Question {currentQuestion + 1}/{quizData.length}
                  </h2>
                  <p className="text-xl mt-2">{quizData[currentQuestion].question}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizData[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerClick(option.isCorrect)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-gray-700 rounded-lg hover:bg-cyan-500 transition-colors duration-200"
                      disabled={feedback.message !== ''}
                    >
                      {option.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}

        <AnimatePresence>
          {feedback.message && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className={`absolute bottom-0 left-0 w-full p-4 text-center text-xl font-bold ${feedback.color}`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;