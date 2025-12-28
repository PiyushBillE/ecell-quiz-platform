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
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
            Active Quizzes
          </h2>
          <p className="text-gray-400">Test your knowledge with interactive quizzes</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">
              No active quizzes available at the moment.
            </p>
            <p className="text-gray-500 mt-2">
              Check back later for new quizzes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleQuizClick(quiz.id)}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {formatDate(quiz.created_at)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    Test your knowledge with this interactive quiz. Click to start playing and challenge yourself!
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-300 bg-blue-500/20 rounded-full border border-blue-500/30">
                      Active
                    </span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Click to play →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

