import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CurrentQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${API_URL}/quiz/all`);
      setQuizzes(response.data);
    } catch (err) {
      setError('Failed to fetch quizzes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (quizId) => {
    try {
      await axios.patch(`${API_URL}/quiz/${quizId}/activate`, { is_active: true });
      fetchQuizzes();
      alert('Quiz uploaded successfully! It is now visible on the home page.');
    } catch (err) {
      alert('Failed to upload quiz');
      console.error(err);
    }
  };

  const handleDisplay = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/quiz/${quizId}`);
      fetchQuizzes();
      alert('Quiz deleted successfully');
    } catch (err) {
      alert('Failed to delete quiz');
      console.error(err);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6">Current Quizzes</h2>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">No quizzes created yet.</p>
          <p className="text-gray-500 mt-2">Create your first quiz to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Created: {formatDate(quiz.created_at)}
              </p>
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                    quiz.is_active
                      ? 'text-green-300 bg-green-500/20 border-green-500/30'
                      : 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30'
                  }`}
                >
                  {quiz.is_active ? 'Active' : 'Draft'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {!quiz.is_active && (
                  <button
                    onClick={() => handleUpload(quiz.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg font-semibold"
                  >
                    Upload
                  </button>
                )}
                <button
                  onClick={() => handleDisplay(quiz.id)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg font-semibold"
                >
                  Display
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentQuizzes;

