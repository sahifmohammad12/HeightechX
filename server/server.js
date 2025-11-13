import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let useMockAuth = false;

// Simple in-memory user store for testing (fallback when Supabase is not configured)
const mockUsers = new Map();
const mockSessions = new Map();

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  WARNING: Missing Supabase environment variables');
  console.warn('   Using in-memory authentication for testing.');
  console.warn('   To use Supabase, create a .env file in the server directory with:');
  console.warn('   SUPABASE_URL=your_supabase_url');
  console.warn('   SUPABASE_ANON_KEY=your_supabase_anon_key');
  useMockAuth = true;
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Sign up endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Use mock authentication if Supabase is not configured
    if (useMockAuth) {
      if (mockUsers.has(email)) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const userId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const accessToken = `mock_access_${Date.now()}_${Math.random().toString(36).substr(2, 20)}`;
      const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 20)}`;

      const user = {
        id: userId,
        email: email,
        user_metadata: {
          full_name: fullName || '',
        },
        created_at: new Date().toISOString(),
      };

      const session = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: user,
      };

      mockUsers.set(email, { password, user });
      mockSessions.set(accessToken, { user, email });

      return res.status(201).json({
        message: 'User created successfully',
        user: user,
        session: session,
      });
    }

    // Use Supabase authentication
    if (!supabase) {
      return res.status(503).json({ error: 'Authentication service is not configured' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'User created successfully',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in endpoint
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Use mock authentication if Supabase is not configured
    if (useMockAuth) {
      const userData = mockUsers.get(email);
      if (!userData || userData.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const accessToken = `mock_access_${Date.now()}_${Math.random().toString(36).substr(2, 20)}`;
      const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 20)}`;

      const session = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: userData.user,
      };

      mockSessions.set(accessToken, { user: userData.user, email });

      return res.json({
        message: 'Sign in successful',
        user: userData.user,
        session: session,
      });
    }

    // Use Supabase authentication
    if (!supabase) {
      return res.status(503).json({ error: 'Authentication service is not configured' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      message: 'Sign in successful',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out endpoint
app.post('/api/auth/signout', async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    // Use mock authentication if Supabase is not configured
    if (useMockAuth) {
      mockSessions.delete(access_token);
      return res.json({ message: 'Sign out successful' });
    }

    // Use Supabase authentication
    if (!supabase) {
      return res.status(503).json({ error: 'Authentication service is not configured' });
    }

    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    });

    const { error } = await userSupabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Sign out successful' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user endpoint
app.get('/api/auth/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const access_token = authHeader.split('Bearer ')[1];

    // Use mock authentication if Supabase is not configured
    if (useMockAuth) {
      const sessionData = mockSessions.get(access_token);
      if (!sessionData) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      return res.json({ user: sessionData.user });
    }

    // Use Supabase authentication
    if (!supabase) {
      return res.status(503).json({ error: 'Authentication service is not configured' });
    }

    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    });

    const { data: { user }, error } = await userSupabase.auth.getUser();

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify session endpoint
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required', valid: false });
    }

    // Use mock authentication if Supabase is not configured
    if (useMockAuth) {
      const sessionData = mockSessions.get(access_token);
      if (!sessionData) {
        return res.json({ valid: false, error: 'Invalid or expired token' });
      }
      return res.json({ user: sessionData.user, valid: true });
    }

    // Use Supabase authentication
    if (!supabase) {
      return res.json({ error: 'Authentication service is not configured', valid: false });
    }

    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    });

    const { data: { user }, error } = await userSupabase.auth.getUser();

    if (error) {
      return res.json({ error: error.message, valid: false });
    }

    res.json({ user, valid: true });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error', valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

