import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [userType, setUserType] = useState('audience'); // 'audience' or 'admin'
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Ensure admin mode always uses login
  const effectiveIsLogin = userType === 'admin' ? true : isLogin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // For admin, only allow login (no registration)
    if (userType === 'admin' && !effectiveIsLogin) {
      setError('Admin registration is not allowed. Please use the hardcoded admin credentials.');
      setLoading(false);
      return;
    }

    const result = effectiveIsLogin
      ? await login(email, password)
      : await register(email, password);

    setLoading(false);

    if (result.success) {
      // Redirect admin to admin dashboard, audience to home
      if (result.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    // In a real implementation, you would use Google OAuth SDK
    // For now, this is a placeholder that shows the flow
    try {
      // This would typically open a Google OAuth popup
      // For demo purposes, we'll simulate it
      alert('Google OAuth integration required. Please use email/password for now.');
      setLoading(false);
    } catch (err) {
      setError('Google login failed');
      setLoading(false);
    }
  };

  // Reset form when switching user types
  const handleUserTypeChange = (type) => {
    setUserType(type);
    setIsLogin(true); // Admin can only login, not register
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        {/* User Type Selector */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => handleUserTypeChange('audience')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              userType === 'audience'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Audience Member
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeChange('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              userType === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin
          </button>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {userType === 'admin'
              ? 'Admin Sign In'
              : effectiveIsLogin
              ? 'Sign in to your account'
              : 'Create a new account'}
          </h2>
          
          {userType === 'admin' && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Admin Credentials:</strong>
                <br />
                Email: EcellBVDU@ecell.com
                <br />
                Password: SharkTank2026
              </p>
            </div>
          )}

          {userType === 'audience' && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {effectiveIsLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {effectiveIsLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-lg relative block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:z-10 sm:text-sm backdrop-blur-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-lg relative block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:z-10 sm:text-sm backdrop-blur-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Processing...' : userType === 'admin' ? 'Sign in as Admin' : effectiveIsLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          {/* Google OAuth - Only for Audience */}
          {userType === 'audience' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-lg bg-gradient-to-r from-gray-800 to-gray-900 text-sm font-medium text-gray-300 hover:text-white hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;

