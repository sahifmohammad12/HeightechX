# Authentication Setup Guide

This project now includes authentication using Supabase and a Node.js backend server.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js installed on your system

## Setup Instructions

### 1. Supabase Setup

1. Go to https://supabase.com and create a new project
2. Once your project is created, go to Settings > API
3. Copy your:
   - Project URL
   - Anon (public) key

### 2. Environment Variables

#### Frontend (.env file in root directory)

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

#### Backend (server/.env file)

Create a `.env` file in the `server` directory with:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
```

### 3. Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
```

### 4. Run the Application

#### Start Backend Server
```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

#### Start Frontend
In a new terminal:
```bash
npm run dev
```

## Features

- **Sign Up**: Create a new account with email and password
- **Sign In**: Login with existing credentials
- **Protected Routes**: All app routes are protected and require authentication
- **Session Management**: Automatic session handling with Supabase
- **User Display**: Shows logged-in user email in the header
- **Logout**: Sign out functionality

## Project Structure

```
├── server/
│   ├── server.js          # Express backend server
│   ├── package.json        # Backend dependencies
│   └── .env               # Backend environment variables
├── src/
│   ├── contexts/
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/
│   │   └── Login.jsx      # Login/Signup page
│   ├── components/
│   │   └── ProtectedRoute.jsx # Route protection component
│   └── App.jsx            # Main app with routing
└── .env                   # Frontend environment variables
```

## API Endpoints

The backend server provides the following endpoints:

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in with email and password
- `POST /api/auth/signout` - Sign out the current user
- `GET /api/auth/user` - Get current user information
- `POST /api/auth/verify` - Verify user session

## Notes

- The frontend uses Supabase client directly for authentication
- The backend server is optional but provides additional API endpoints
- All routes except `/login` are protected and require authentication
- Users are automatically redirected to `/login` if not authenticated

