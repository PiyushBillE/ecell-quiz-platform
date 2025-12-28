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
      <h2 className="text-2xl font-semibold mb-6">Current Quizzes</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No quizzes created yet.</p>
          <p className="text-gray-400 mt-2">Create your first quiz to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white border-2 border-gray-200 rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Created: {formatDate(quiz.created_at)}
              </p>
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    quiz.is_active
                      ? 'text-green-600 bg-green-100'
                      : 'text-yellow-600 bg-yellow-100'
                  }`}
                >
                  {quiz.is_active ? 'Active' : 'Draft'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {!quiz.is_active && (
                  <button
                    onClick={() => handleUpload(quiz.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    Upload
                  </button>
                )}
                <button
                  onClick={() => handleDisplay(quiz.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Display
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
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

