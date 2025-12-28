import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

      const response = await axios.post(`${API_URL}/quiz/create`, formData, {
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
      <h2 className="text-2xl font-semibold mb-6">Create New Quiz</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Name
          </label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Question {qIndex + 1}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                value={question.question_text}
                onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(qIndex, e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options (2-4 options, select one as correct)
              </label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={option.is_correct}
                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={option.option_text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
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
                  className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Quiz (Draft)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;

