const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'question-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all active quizzes (for home page)
router.get('/active', (req, res) => {
  db.all(
    'SELECT id, title, created_at FROM quizzes WHERE is_active = 1 ORDER BY created_at DESC',
    [],
    (err, quizzes) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(quizzes);
    }
  );
});

// Get all quizzes (admin only)
router.get('/all', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    'SELECT id, title, created_at, is_active FROM quizzes ORDER BY created_at DESC',
    [],
    (err, quizzes) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(quizzes);
    }
  );
});

// Get quiz details with questions and options
router.get('/:id', (req, res) => {
  const quizId = req.params.id;

  db.get('SELECT * FROM quizzes WHERE id = ?', [quizId], (err, quiz) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    db.all(
      'SELECT * FROM questions WHERE quiz_id = ? ORDER BY id',
      [quizId],
      (err, questions) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const questionsWithOptions = [];
        let processed = 0;

        if (questions.length === 0) {
          return res.json({ ...quiz, questions: [] });
        }

        questions.forEach((question, index) => {
          db.all(
            'SELECT id, option_text, is_correct FROM options WHERE question_id = ?',
            [question.id],
            (err, options) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              questionsWithOptions.push({
                ...question,
                options: options.map(opt => ({
                  id: opt.id,
                  option_text: opt.option_text,
                  is_correct: Boolean(opt.is_correct)
                }))
              });

              processed++;
              if (processed === questions.length) {
                res.json({
                  ...quiz,
                  questions: questionsWithOptions.sort((a, b) => a.id - b.id)
                });
              }
            }
          );
        });
      }
    );
  });
});

// Create quiz (admin only)
router.post('/create', authenticateToken, requireAdmin, upload.array('images'), (req, res) => {
  const { title, questions } = req.body;

  if (!title || !questions) {
    return res.status(400).json({ error: 'Title and questions are required' });
  }

  let parsedQuestions;
  try {
    parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid questions format' });
  }

  // Create quiz
  db.run(
    'INSERT INTO quizzes (title, is_active) VALUES (?, ?)',
    [title, 0], // Draft status
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create quiz' });
      }

      const quizId = this.lastID;
      let processed = 0;
      const totalQuestions = parsedQuestions.length;

      if (totalQuestions === 0) {
        return res.json({ id: quizId, message: 'Quiz created successfully' });
      }

      parsedQuestions.forEach((q, index) => {
        const imageFile = req.files && req.files[index] ? req.files[index] : null;
        const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : null;

        db.run(
          'INSERT INTO questions (quiz_id, question_text, image_url) VALUES (?, ?, ?)',
          [quizId, q.question_text, imageUrl],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create question' });
            }

            const questionId = this.lastID;
            const options = q.options || [];

            if (options.length === 0) {
              processed++;
              if (processed === totalQuestions) {
                res.json({ id: quizId, message: 'Quiz created successfully' });
              }
              return;
            }

            let optionsProcessed = 0;
            options.forEach((option) => {
              db.run(
                'INSERT INTO options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
                [questionId, option.option_text, option.is_correct ? 1 : 0],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: 'Failed to create option' });
                  }

                  optionsProcessed++;
                  if (optionsProcessed === options.length) {
                    processed++;
                    if (processed === totalQuestions) {
                      res.json({ id: quizId, message: 'Quiz created successfully' });
                    }
                  }
                }
              );
            });
          }
        );
      });
    }
  );
});

// Update quiz status (Upload/Activate)
router.patch('/:id/activate', authenticateToken, requireAdmin, (req, res) => {
  const quizId = req.params.id;
  const { is_active } = req.body;

  db.run(
    'UPDATE quizzes SET is_active = ? WHERE id = ?',
    [is_active ? 1 : 0, quizId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update quiz' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      res.json({ message: 'Quiz status updated successfully' });
    }
  );
});

// Delete quiz (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const quizId = req.params.id;

  db.run('DELETE FROM quizzes WHERE id = ?', [quizId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete quiz' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  });
});

module.exports = router;

