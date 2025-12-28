import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveQuizzes();
  }, []);

  const fetchActiveQuizzes = async () => {
    try {
      const response = await axios.get(`${API_URL}/quiz/active`);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (quizId) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/quiz/${quizId}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Ecell BVDU Quiz Portal
        </h1>
        <p className="text-xl text-gray-600">
          Test your knowledge with our interactive quizzes
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No active quizzes available at the moment.
          </p>
          <p className="text-gray-400 mt-2">
            Check back later for new quizzes!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => handleQuizClick(quiz.id)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-6 border-2 border-transparent hover:border-blue-500"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {quiz.title}
              </h2>
              <p className="text-sm text-gray-500">
                Created: {formatDate(quiz.created_at)}
              </p>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                  Active Quiz
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

