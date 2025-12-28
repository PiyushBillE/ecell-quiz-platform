import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateQuiz from '../components/CreateQuiz';
import CurrentQuizzes from '../components/CurrentQuizzes';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage quizzes and create new ones</p>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Quiz
            </button>
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Quizzes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'create' ? <CreateQuiz /> : <CurrentQuizzes />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

