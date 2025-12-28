# Ecell BVDU Navi Mumbai Quiz Platform

A web-based quiz application for the college club "Ecell BVDU Navi Mumbai." It facilitates interactive quizzes for audience members during events and allows administrators to manage and project quizzes on a big screen.

## Features

### For Audience Members
- View active quizzes on the homepage
- Sign up/Login with Email/Password or Google OAuth
- Play interactive quizzes with real-time feedback
- Visual feedback (Green for correct, Red for incorrect)
- Progress tracking during quiz

### For Administrators
- Exclusive admin dashboard access
- Create quizzes with multiple questions
- Upload images for questions
- Add 2-4 options per question
- Mark correct answers
- Upload quizzes to make them active
- Display quizzes on projector screen
- Delete quizzes

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT, bcrypt
- **File Upload**: Multer

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install all dependencies**:
   ```bash
   npm run install-all
   ```
   
   Or install separately:
   ```bash
   # Root dependencies
   npm install
   
   # Server dependencies
   cd server
   npm install
   
   # Client dependencies
   cd ../client
   npm install
   ```

3. **Create environment file** (optional):
   ```bash
   # In server directory
   cd server
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key-here
   ```

4. **Start the development servers**:
   ```bash
   # From root directory
   npm run dev
   ```
   
   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

   Or start separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

## Default Admin Credentials

- **Email**: `EcellBVDU@ecell.com`
- **Password**: `SharkTank2026`

**Note**: Admin account is created automatically on first server start. No registration allowed for admin role.

## Project Structure

```
Ecell/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── uploads/           # Uploaded images
│   ├── database.js        # Database setup
│   └── index.js           # Server entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (audience only)
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login

### Quizzes
- `GET /api/quiz/active` - Get all active quizzes
- `GET /api/quiz/all` - Get all quizzes (admin only)
- `GET /api/quiz/:id` - Get quiz details with questions
- `POST /api/quiz/create` - Create new quiz (admin only)
- `PATCH /api/quiz/:id/activate` - Activate/Deactivate quiz (admin only)
- `DELETE /api/quiz/:id` - Delete quiz (admin only)

### User
- `GET /api/user/me` - Get current user info

## Usage Guide

### For Administrators

1. **Login** with admin credentials
2. Navigate to **Admin Dashboard**
3. **Create Quiz**:
   - Enter quiz name
   - Set number of questions
   - For each question:
     - Enter question text
     - (Optional) Upload an image
     - Add 2-4 options
     - Mark one option as correct
   - Click "Save Quiz (Draft)"
4. **Upload Quiz**:
   - Go to "Current Quizzes" tab
   - Click "Upload" to make quiz active
5. **Display Quiz**:
   - Click "Display" to view quiz (for projector)
6. **Delete Quiz**:
   - Click "Delete" to permanently remove quiz

### For Audience Members

1. **View Active Quizzes** on homepage
2. **Login/Sign Up** when clicking a quiz
3. **Play Quiz**:
   - Read question and view image (if any)
   - Select an option
   - If incorrect: Try again (button turns red)
   - If correct: Button turns green, "Next Question" appears
   - Complete all questions to see completion screen

## Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT UNIQUE)
- `password_hash` (TEXT)
- `role` (TEXT: 'admin' or 'audience')
- `google_id` (TEXT, nullable)
- `created_at` (DATETIME)

### Quizzes Table
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT)
- `created_at` (DATETIME)
- `is_active` (INTEGER: 0 or 1)

### Questions Table
- `id` (INTEGER PRIMARY KEY)
- `quiz_id` (INTEGER, FOREIGN KEY)
- `question_text` (TEXT)
- `image_url` (TEXT, nullable)

### Options Table
- `id` (INTEGER PRIMARY KEY)
- `question_id` (INTEGER, FOREIGN KEY)
- `option_text` (TEXT)
- `is_correct` (INTEGER: 0 or 1)

## Production Deployment

1. **Build the frontend**:
   ```bash
   cd client
   npm run build
   ```

2. **Set environment variables**:
   - Set `JWT_SECRET` to a strong random string
   - Set `PORT` if different from 5000

3. **Start the server**:
   ```bash
   cd server
   npm start
   ```

4. **Serve static files** (optional):
   - Configure your web server (nginx, Apache) to serve the `client/build` directory
   - Or use Express static middleware to serve the build folder

## Notes

- Google OAuth integration requires additional setup with Google Cloud Console
- For production, consider migrating from SQLite to PostgreSQL or MySQL
- Image uploads are stored in `server/uploads/` directory
- Database file is created automatically at `server/database.sqlite`

## License

ISC

