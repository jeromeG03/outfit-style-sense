
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, UserCircle, Palette, Calendar, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    user_name: '',
    password: '',
    gender: '',
    skin_tone: '',
    age: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Call Spring Boot backend API
      const response = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          userName: formData.user_name,
          password: formData.password,
          gender: formData.gender,
          skinTone: formData.skin_tone,
          age: parseInt(formData.age)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      setIsSuccess(true);
    } catch (err) {
      setError('Signup failed. Username might already exist or server is not available.');
      console.error('Signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-2xl shadow-amber-900/5 max-w-md w-full text-center border border-amber-100"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Welcome Aboard!</h2>
          <p className="text-stone-600 mb-8">
            Your account has been created successfully. You can now explore your personalized stylist.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center w-full bg-amber-800 text-white py-4 rounded-xl font-medium hover:bg-amber-900 transition-all group"
          >
            Go to Login
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-[#faf9f6]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl shadow-amber-900/5 max-w-2xl w-full overflow-hidden border border-amber-100 flex flex-col md:flex-row"
      >
        {/* Left Side - Visual */}
        <div className="md:w-1/3 bg-amber-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">Join the Style Revolution</h2>
            <p className="text-amber-100/80 text-sm leading-relaxed">
              Create an account to get personalized Indian wear recommendations based on your unique profile.
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-700/30 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-900/30 rounded-full blur-3xl"></div>
          
          <div className="mt-12 relative z-10">
            <div className="flex -space-x-2 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-amber-800 bg-amber-100 flex items-center justify-center text-[10px] text-amber-800 font-bold"
                >
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-200">Joined by 2,000+ fashion enthusiasts</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-2/3 p-10 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900">Create Account</h3>
            <p className="text-stone-500 text-sm">Enter your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center">
                <Mail className="w-3 h-3 mr-2" />
                Email Address
              </label>
              <div className="relative">
                <input 
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center">
                <User className="w-3 h-3 mr-2" />
                Username
              </label>
              <div className="relative">
                <input 
                  required
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center">
                <Lock className="w-3 h-3 mr-2" />
                Password
              </label>
              <input 
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center">
                  <UserCircle className="w-3 h-3 mr-2" />
                  Gender
                </label>
                <select 
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center">
                  <Calendar className="w-3 h-3 mr-2" />
                  Age
                </label>
                <input 
                  required
                  type="number"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Skin Tone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center">
                <Palette className="w-3 h-3 mr-2" />
                Skin Tone
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['Fair', 'Medium', 'Olive', 'Tan', 'Deep'].map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, skin_tone: tone }))}
                    className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                      formData.skin_tone === tone 
                        ? 'bg-amber-800 text-white border-amber-800 shadow-lg shadow-amber-900/20' 
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
              <input type="hidden" name="skin_tone" value={formData.skin_tone} required />
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-amber-800 text-white py-4 rounded-xl font-medium hover:bg-amber-900 transition-all shadow-lg shadow-amber-900/10 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p className="text-center text-sm text-stone-500 mt-6">
              Already have an account? <Link to="/login" className="text-amber-800 font-semibold hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
