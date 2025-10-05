// src/pages/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizData } from '../data/quizData';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(quizData.length).fill(null));
  const [showScore, setShowScore] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const userAnswer = userAnswers[currentQuestion];
    setIsAnswered(userAnswer !== null);
  }, [currentQuestion, userAnswers]);

  const handleAnswerClick = (selectedOption) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newAnswers);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };
  
  const handleSubmit = () => {
    setShowScore(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(quizData.length).fill(null));
    setShowScore(false);
  };

  const getButtonClass = (option) => {
    const userAnswer = userAnswers[currentQuestion];
    if (userAnswer === null) {
      return 'bg-gray-700 hover:bg-cyan-600';
    }
    if (option.isCorrect) {
      return 'bg-green-500';
    }
    if (userAnswer === option) {
      return 'bg-red-500';
    }
    return 'bg-gray-700 opacity-50';
  };
  
  const calculateScore = () => {
    return userAnswers.reduce((score, userAnswer, index) => {
        if (userAnswer && userAnswer.isCorrect) {
            return score + 1;
        }
        return score;
    }, 0);
  };

  const questionVariants = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 },
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-900 text-white">
      <div className="w-full max-w-3xl bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {showScore ? (
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-4">Quiz Complete!</h2>
              <p className="text-xl sm:text-2xl mb-6">You scored {calculateScore()} out of {quizData.length}</p>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {quizData.map((question, index) => (
                  <div key={index} className="text-left p-4 bg-gray-700 rounded-lg">
                    <p className="font-semibold text-lg">{index + 1}. {question.question}</p>
                    <div className="flex items-center mt-2">
                      {userAnswers[index]?.isCorrect ? 
                        <CheckCircle className="text-green-400 mr-2" /> : 
                        <XCircle className="text-red-400 mr-2" />
                      }
                      <p>Your answer: {userAnswers[index]?.text || 'Not Answered'}</p>
                    </div>
                    {!userAnswers[index]?.isCorrect &&
                      <p className="text-green-400 mt-1">Correct answer: {question.options.find(opt => opt.isCorrect).text}</p>
                    }
                  </div>
                ))}
              </div>

              <button 
                onClick={restartQuiz} 
                className="mt-8 px-8 py-3 bg-cyan-500 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
              >
                Restart Quiz
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion}
              variants={questionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400">
                    Question {currentQuestion + 1}
                    <span className="text-gray-400 text-base sm:text-lg">/{quizData.length}</span>
                  </h2>
                  <div className="w-1/2 bg-gray-700 rounded-full h-2.5">
                    <motion.div 
                        className="bg-cyan-500 h-2.5 rounded-full" 
                        style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                        initial={{width: 0}}
                        animate={{width: `${((currentQuestion) / quizData.length) * 100}%`}}
                        transition={{duration: 0.5}}
                    />
                  </div>
                </div>
                <p className="text-lg sm:text-xl mt-4">{quizData[currentQuestion].question}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizData[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg text-left transition-all duration-300 ${getButtonClass(option)}`}
                    disabled={isAnswered}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8">
                <button 
                    onClick={handleBack} 
                    disabled={currentQuestion === 0}
                    className="flex items-center px-4 py-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    Back
                </button>

                <button 
                  onClick={handleSkip} 
                  className="px-4 py-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                >
                  Skip
                </button>

                {currentQuestion === quizData.length - 1 ? (
                    <button onClick={handleSubmit} className="flex items-center px-4 py-2 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                        Submit
                    </button>
                ) : (
                    <button onClick={handleNext} className="flex items-center px-4 py-2 bg-cyan-500 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">
                        Next
                        <ChevronRight size={20} className="ml-1" />
                    </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;