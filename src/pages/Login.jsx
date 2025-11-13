import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, UserPlus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { email, password, fullName, isSignUp });
    
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isSignUp && !fullName) {
      toast.error('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        console.log('Attempting sign up...');
        await signUp(email, password, fullName);
        toast.success('Account created successfully!');
      } else {
        console.log('Attempting sign in...');
        await signIn(email, password);
        toast.success('Signed in successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      // Error toast is already shown in AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--background)'}}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{color: 'var(--text)'}}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'var(--background)'}}>
      <div className="w-full max-w-md">
        <div className="card p-8" style={{
          background: 'linear-gradient(180deg, rgba(0,4,10,0.55), rgba(4,16,23,0.55))',
          border: '1px solid rgba(0,255,160,0.06)',
          boxShadow: '0 8px 32px rgba(0,255,160,0.08)'
        }}>
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              boxShadow: '0 0 30px rgba(0,255,160,0.15)'
            }}>
              <Shield className="w-8 h-8" style={{color: '#001014'}} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--text)'}}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p style={{color: 'rgba(191,252,240,0.7)'}}>
              {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" style={{ position: 'relative', zIndex: 10 }}>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: 'rgba(191,252,240,0.85)'}}>
                  Full Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: 'rgba(191,252,240,0.5)', pointerEvents: 'none', zIndex: 1}} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      console.log('Full name changed:', e.target.value);
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid rgba(0,255,160,0.5)';
                      e.target.style.boxShadow = '0 0 10px rgba(0,255,160,0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid rgba(0,255,160,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(0,255,160,0.2)',
                      color: 'var(--text)',
                      outline: 'none',
                      fontSize: '16px',
                      zIndex: 2,
                      position: 'relative'
                    }}
                    placeholder="Enter your full name"
                    required={isSignUp}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: 'rgba(191,252,240,0.85)'}}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: 'rgba(191,252,240,0.5)', pointerEvents: 'none', zIndex: 1}} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    console.log('Email changed:', e.target.value);
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(0,255,160,0.5)';
                    e.target.style.boxShadow = '0 0 10px rgba(0,255,160,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(0,255,160,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(0,255,160,0.2)',
                    color: 'var(--text)',
                    outline: 'none',
                    fontSize: '16px',
                    zIndex: 2,
                    position: 'relative'
                  }}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: 'rgba(191,252,240,0.85)'}}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: 'rgba(191,252,240,0.5)', pointerEvents: 'none', zIndex: 1}} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    console.log('Password changed:', e.target.value.length, 'characters');
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(0,255,160,0.5)';
                    e.target.style.boxShadow = '0 0 10px rgba(0,255,160,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(0,255,160,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(0,255,160,0.2)',
                    color: 'var(--text)',
                    outline: 'none',
                    fontSize: '16px',
                    zIndex: 2,
                    position: 'relative'
                  }}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: loading 
                  ? 'rgba(0,255,160,0.3)' 
                  : 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: '#001014',
                boxShadow: loading 
                  ? 'none' 
                  : '0 0 30px rgba(0,255,160,0.15)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,160,0.25)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,160,0.15)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-6 text-center">
            <p style={{color: 'rgba(191,252,240,0.7)'}} className="text-sm">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail('');
                  setPassword('');
                  setFullName('');
                }}
                className="font-semibold hover:underline"
                style={{color: 'var(--primary)'}}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{color: 'rgba(191,252,240,0.5)'}}>
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

