import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const QuizGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${API_URL}/quiz/${id}`);
      setQuiz(response.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to load quiz');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleOptionSelect = (optionId, isCorrect) => {
    if (showNext) return; // Prevent selection after correct answer

    setSelectedOption(optionId);

    if (isCorrect) {
      setShowNext(true);
      setToast({ type: 'success', message: 'Correct!' });
      
      // Auto-advance after 2 seconds
      setTimeout(() => {
        handleNext();
      }, 2000);
    } else {
      setToast({ type: 'error', message: 'Incorrect, try again.' });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowNext(false);
      setToast(null);
    } else {
      setCompleted(true);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-300">Quiz not found or has no questions.</p>
          <button
            onClick={handleBackToHome}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl w-full text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-12">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
            Congratulations!
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            You have completed the <span className="font-semibold text-white">{quiz.title}</span>
          </p>
          <p className="text-lg text-gray-400 mb-8">
            provided by Ecell BVDU
          </p>
          <button
            onClick={handleBackToHome}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white text-lg rounded-lg hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 shadow-2xl transform hover:scale-105 font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            {quiz.title}
          </h1>
          <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl transition-all backdrop-blur-sm border ${
              toast.type === 'success'
                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Question Card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 md:p-8 mb-6">
          {/* Question Text */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            {currentQuestion.question_text}
          </h2>

          {/* Question Image */}
          {currentQuestion.image_url && (
            <div className="mb-6 flex justify-center">
              <img
                src={`${API_URL.split('/api')[0]}${currentQuestion.image_url}`}
                alt="Question"
                className="max-w-full h-auto rounded-lg shadow-md max-h-96 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option) => {
              let buttonClass =
                'w-full px-6 py-4 text-left text-lg font-medium rounded-lg border-2 transition-all duration-200 ';

              if (selectedOption === option.id) {
                if (option.is_correct) {
                  buttonClass += 'bg-green-500 text-white border-green-600 shadow-lg transform scale-105';
                } else {
                  buttonClass += 'bg-red-500 text-white border-red-600 shadow-lg';
                }
              } else {
                buttonClass += 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-50';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id, option.is_correct)}
                  disabled={showNext}
                  className={buttonClass}
                >
                  {option.option_text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Button */}
        {showNext && (
          <div className="text-center">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {currentQuestionIndex < quiz.questions.length - 1
                ? 'Next Question'
                : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;

