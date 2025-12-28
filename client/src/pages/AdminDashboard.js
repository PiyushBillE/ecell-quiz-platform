import React, { useState } from 'react';
import CreateQuiz from '../components/CreateQuiz';
import CurrentQuizzes from '../components/CurrentQuizzes';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage quizzes and create new ones</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
          <div className="border-b border-gray-700/50">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-all duration-300 ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                Create Quiz
              </button>
              <button
                onClick={() => setActiveTab('current')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-all duration-300 ${
                  activeTab === 'current'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
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
    </div>
  );
};

export default AdminDashboard;

