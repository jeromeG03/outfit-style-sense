
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import OccasionPage from './components/Occasion/OccasionPage';
import SkinTonePage from './components/SkinTone/SkinTonePage';
import TrendsPage from './components/Trends/TrendsPage';
import WardrobePage from './components/Wardrobe/WardrobePage';
import PsychologyPage from './components/Psychology/PsychologyPage';
import RecommendationPage from './components/Recommendation/RecommendationPage';
import LoginPage from './components/Login/LoginPage';
import SignupPage from './components/Signup/SignupPage';
import VirtualTrialRoomPage from './components/VirtualTrial/VirtualTrialRoomPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex flex-col">
                <span className="text-xl font-extrabold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent font-serif tracking-tight group-hover:from-amber-600 group-hover:via-orange-500 group-hover:to-amber-700 transition-all duration-300">Smart Outfit</span>
                <span className="text-xs font-bold text-stone-600 tracking-widest uppercase">Recommendation System</span>
              </div>
            </Link>
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <Link to="/" className="group relative px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200 hover:border-amber-400 transition-all hover:shadow-md hover:scale-105">
                <span className="bg-gradient-to-r from-amber-800 to-orange-600 bg-clip-text text-transparent font-bold flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 bg-amber-800 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-900 transition-all shadow-md shadow-amber-900/10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Welcome, {user.userName}</span>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-xs text-stone-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.userName}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-amber-800 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-900 transition-all shadow-md shadow-amber-900/10"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      {/* Navigation Bar */}
      <Navigation />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/occasion" element={<OccasionPage />} />
            <Route path="/skin-tone" element={<SkinTonePage />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/wardrobe" element={<WardrobePage />} />
            <Route path="/psychology" element={<PsychologyPage />} />
            <Route path="/recommendation" element={<RecommendationPage />} />
            <Route path="/virtual-trial" element={<VirtualTrialRoomPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-400 py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-serif mb-2">
                <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent font-bold">Smart Outfit Recommendation System</span>
              </h3>
              <p className="text-amber-200/80 text-xs italic mb-4">For Personalised Fashion</p>
              <p className="text-sm leading-relaxed">
                Celebrating Indian craftsmanship and digital intelligence. Tailored recommendations for every Indian occasion.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-serif mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/psychology" className="hover:text-amber-500">Color Logic</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-serif mb-4">Academic Work</h3>
              <p className="text-sm">Final Year Project Presentation</p>
              <p className="text-sm">Batch of 2025</p>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-xs">
            &copy; {new Date().getFullYear()} <span className="font-semibold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Smart Outfit Recommendation System</span>. Designed for Excellence.
          </div>
        </footer>
      </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;