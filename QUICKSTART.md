# Quick Start Guide

## First Time Setup

1. **Install Dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start Development Servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend on `http://localhost:5000`
   - Frontend on `http://localhost:3000`

3. **Access the Application**:
   - Open your browser to `http://localhost:3000`
   - The admin account is automatically created on first server start

## Admin Login

- **URL**: `http://localhost:3000/login`
- **Email**: `EcellBVDU@ecell.com`
- **Password**: `SharkTank2026`

## Testing the Application

### As Admin:
1. Login with admin credentials
2. Go to Admin Dashboard
3. Create a test quiz:
   - Quiz Name: "Test Quiz"
   - Number of Questions: 2
   - Add questions with options
   - Mark correct answers
   - Save as Draft
4. Go to "Current Quizzes" tab
5. Click "Upload" to make quiz active
6. Click "Display" to view the quiz

### As Audience Member:
1. Go to Home Page (you'll see the active quiz)
2. Click on the quiz
3. You'll be redirected to Login (if not logged in)
4. Sign up with email/password or use Google OAuth
5. Play the quiz!

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Backend: Edit `server/index.js` and change `PORT`
- Frontend: React will automatically suggest another port

### Database Issues
- Delete `server/database.sqlite` and restart the server to reset the database
- Admin account will be recreated automatically

### Image Upload Issues
- Ensure `server/uploads/` directory exists and has write permissions
- Check file size (max 5MB per image)

## Production Build

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

