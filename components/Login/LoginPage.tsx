
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import { X, Mail, Lock, KeyRound } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'password'>('email');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Call Spring Boot backend API
      const response = await fetch(API_ENDPOINTS.USERS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const userData = await response.json();
      console.log('Login successful:', userData);
      
      // Use auth context to login
      login(userData);
      
      alert("Successfully logged in to Smart Outfit Recommendation System!");
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');

    try {
      if (resetStep === 'email') {
        // Request reset code
        const response = await fetch(API_ENDPOINTS.USERS.FORGOT_PASSWORD, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send reset code');
        }

        const data = await response.json();
        setResetSuccess('Reset code sent to your email! Check console for development.');
        console.log('Reset code for testing:', data.resetCode);
        setResetStep('code');
      } else if (resetStep === 'code') {
        // Verify reset code
        const response = await fetch(API_ENDPOINTS.USERS.VERIFY_RESET_CODE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail, code: resetCode }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Invalid code');
        }

        setResetSuccess('Code verified! Enter your new password.');
        setResetStep('password');
      } else if (resetStep === 'password') {
        // Reset password
        const response = await fetch(API_ENDPOINTS.USERS.RESET_PASSWORD, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail, code: resetCode, newPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reset password');
        }

        setResetSuccess('Password reset successful! You can now login.');
        setTimeout(() => {
          setShowForgotPassword(false);
          setEmail(forgotEmail);
          resetForgotPasswordForm();
        }, 2000);
      }
    } catch (err: any) {
      setResetError(err.message || 'An error occurred');
    } finally {
      setResetLoading(false);
    }
  };

  const resetForgotPasswordForm = () => {
    setForgotEmail('');
    setResetCode('');
    setNewPassword('');
    setResetStep('email');
    setResetError('');
    setResetSuccess('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-10 md:p-12">
          <div className="text-center mb-10">
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-1">
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent font-serif tracking-tight">Smart Outfit</span>
              </h2>
              <h3 className="text-base md:text-lg font-bold tracking-wide">
                <span className="bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 bg-clip-text text-transparent">Recommendation System</span>
              </h3>
              <p className="text-xs md:text-sm text-amber-600 font-semibold italic mt-1">For Personalised Fashion</p>
            </div>
            <h1 className="text-2xl font-serif text-stone-900 mb-2">Welcome Back</h1>
            <p className="text-stone-500 text-sm">Enter your credentials to access your smart closet.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-stone-50 border border-stone-100 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 outline-none transition-all text-sm"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-stone-50 border border-stone-100 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 outline-none transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center text-stone-500 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-stone-300 text-amber-800 focus:ring-amber-800" />
                Remember me
              </label>
              <button type="button" onClick={() => setShowForgotPassword(true)} className="text-amber-800 font-bold hover:underline">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-800 transition-all shadow-xl shadow-stone-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>
        
        <div className="bg-stone-50 p-6 text-center border-t border-stone-100">
          <p className="text-sm text-stone-500">
            Don't have an account? <Link to="/signup" className="text-amber-800 font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                resetForgotPasswordForm();
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-amber-800" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Reset Password</h2>
              <p className="text-sm text-stone-500">
                {resetStep === 'email' && 'Enter your email to receive a reset code'}
                {resetStep === 'code' && 'Enter the 6-digit code sent to your email'}
                {resetStep === 'password' && 'Create a new password'}
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              {resetStep === 'email' && (
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-stone-50 border border-stone-200 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              {resetStep === 'code' && (
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 outline-none transition-all text-center text-2xl tracking-widest font-bold"
                  />
                  <p className="text-xs text-stone-500 mt-2">Code expires in 15 minutes</p>
                </div>
              )}

              {resetStep === 'password' && (
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-stone-50 border border-stone-200 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              {resetError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {resetError}
                </div>
              )}

              {resetSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  {resetSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-amber-800 text-white py-3 rounded-xl font-bold hover:bg-amber-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetLoading ? 'Processing...' : 
                  resetStep === 'email' ? 'Send Code' :
                  resetStep === 'code' ? 'Verify Code' :
                  'Reset Password'}
              </button>

              {resetStep !== 'email' && (
                <button
                  type="button"
                  onClick={() => setResetStep(resetStep === 'code' ? 'email' : 'code')}
                  className="w-full text-stone-600 text-sm hover:text-amber-800 transition-colors"
                >
                  ← Go back
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;