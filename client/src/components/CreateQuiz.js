import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CreateQuiz = () => {
  const [quizName, setQuizName] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([
    {
      question_text: '',
      image: null,
      options: [{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNumQuestionsChange = (e) => {
    const num = parseInt(e.target.value) || 1;
    setNumQuestions(Math.max(1, Math.min(50, num)));
    
    const newQuestions = [];
    for (let i = 0; i < num; i++) {
      if (questions[i]) {
        newQuestions.push(questions[i]);
      } else {
        newQuestions.push({
          question_text: '',
          image: null,
          options: [
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
          ],
        });
      }
    }
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = [...questions];
    updated[index].image = file;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].option_text = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const updated = [...questions];
    // Unset all other correct answers for this question
    updated[qIndex].options.forEach((opt, idx) => {
      opt.is_correct = idx === oIndex;
    });
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length < 4) {
      updated[qIndex].options.push({ option_text: '', is_correct: false });
      setQuestions(updated);
    }
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options.splice(oIndex, 1);
      // If removed option was correct, set first option as correct
      if (updated[qIndex].options.every(opt => !opt.is_correct)) {
        updated[qIndex].options[0].is_correct = true;
      }
      setQuestions(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!quizName.trim()) {
      setError('Quiz name is required');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      if (q.options.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return;
      }
      const hasCorrect = q.options.some(opt => opt.is_correct);
      if (!hasCorrect) {
        setError(`Question ${i + 1} must have a correct answer`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].option_text.trim()) {
          setError(`Question ${i + 1}, Option ${j + 1} text is required`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', quizName);
      
      const questionsData = questions.map(q => ({
        question_text: q.question_text,
        options: q.options.map(opt => ({
          option_text: opt.option_text,
          is_correct: opt.is_correct,
        })),
      }));
      
      formData.append('questions', JSON.stringify(questionsData));

      // Append image files
      questions.forEach((q, index) => {
        if (q.image) {
          formData.append('images', q.image);
        }
      });

      await axios.post(`${API_URL}/quiz/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Quiz created successfully! It is now in Draft status.');
      setQuizName('');
      setNumQuestions(1);
      setQuestions([
        {
          question_text: '',
          image: null,
          options: [
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
          ],
        },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6">Create New Quiz</h2>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg backdrop-blur-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quiz Name
          </label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
            required
          />
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border border-gray-700/50 rounded-xl p-6 space-y-4 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white">
              Question {qIndex + 1}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question Text
              </label>
              <textarea
                value={question.question_text}
                onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(qIndex, e.target.files[0])}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Options (2-4 options, select one as correct)
              </label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={option.is_correct}
                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 bg-gray-800 border-gray-700"
                  />
                  <input
                    type="text"
                    value={option.option_text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
                    required
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {question.options.length < 4 && (
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="mt-2 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  + Add Option
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            {loading ? 'Saving...' : 'Save Quiz (Draft)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;

