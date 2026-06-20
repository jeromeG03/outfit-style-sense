
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLoggedInUser, isLoggedIn } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Heart, Zap, Star } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

interface WardrobeItem {
  wardrobeId?: number;
  userId: number;
  gender: string;
  clothType: string;
  color: string;
  pattern: string;
  season: string;
  imagePath: string;
}

interface OutfitSuggestion {
  item: WardrobeItem;
  matchScore: number;
  compatibility: string;
  reasons: string[];
}

interface CompleteOutfit {
  top: WardrobeItem;
  bottom: WardrobeItem;
  score: number;
  rating: string;
  occasion: string;
}

interface ColorPsychology {
  colorId: number;
  colorName: string;
  psychologyEffect: string;
  suitableFor: string;
}

interface SkinToneRule {
  ruleId: number;
  skinTone: string;
  suitableColors: string;
  avoidColors: string;
}

const MEN_TYPES = ['Shirt', 'T-Shirt', 'Pant', 'Jeans', 'Jacket', 'Blazer', 'Shorts'];
const WOMEN_TYPES = ['Top', 'Blouse', 'Skirt', 'Jeans', 'Saree', 'Dress', 'Jacket'];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Beige', 'Grey', 'Green', 'Yellow'];
const PATTERNS = ['Solid', 'Striped', 'Checked', 'Floral', 'Printed'];
const SEASONS = ['Summer', 'Winter', 'Rainy', 'All Season'];

const WardrobePage: React.FC = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState<'Men' | 'Women'>('Men');
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  
  // View State
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'suggestions' | 'outfits'>('wardrobe');
  
  // Form State
  const [formData, setFormData] = useState<Partial<WardrobeItem>>({
    clothType: '',
    color: '',
    pattern: '',
    season: '',
    imagePath: ''
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // DB Insights
  const [psychology, setPsychology] = useState<ColorPsychology[]>([]);
  const [skinRules, setSkinRules] = useState<SkinToneRule[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Outfit Combinations State
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [styleTips, setStyleTips] = useState<string[]>([]);
  const [completeOutfits, setCompleteOutfits] = useState<CompleteOutfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      setError('Please login to access your digital closet.');
      setLoading(false);
      return;
    }
    
    const loggedInUser = getLoggedInUser();
    setUser(loggedInUser);
  }, []); // Only run once on mount

  useEffect(() => {
    // Fetch items when user or gender changes
    if (user) {
      fetchItems();
      fetchInsights();
    }
  }, [user, gender]);

  const fetchItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
      console.log(`Fetching items for user ${user.userId} with gender: ${gender}`);
      const res = await fetch(API_ENDPOINTS.WARDROBE.BY_USER_AND_GENDER(user.userId, gender));
      if (!res.ok) {
        throw new Error('Failed to fetch wardrobe items');
      }
      const data = await res.json();
      console.log(`Received ${data.length} items for gender ${gender}`);
      setItems(data);
      
      // Reset activeTab to wardrobe when gender changes
      setActiveTab('wardrobe');
      setSelectedItem(null);
      setSuggestions([]);
      setCompleteOutfits([]);
    } catch (err) {
      console.error("Failed to fetch wardrobe", err);
      setError('Could not load your wardrobe. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload and convert to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, imagePath: base64String });
      setImagePreview(base64String);
      setUploadingImage(false);
    };

    reader.onerror = () => {
      alert('Failed to read image file');
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData({ ...formData, imagePath: '' });
    setImagePreview('');
  };

  const fetchInsights = async () => {
    try {
      const [psyRes, skinRes] = await Promise.all([
        fetch(API_ENDPOINTS.COLOR_PSYCHOLOGY.ALL),
        fetch(API_ENDPOINTS.SKIN_TONE.ALL)
      ]);
      setPsychology(await psyRes.json());
      setSkinRules(await skinRes.json());
    } catch (err) {
      console.error("Failed to fetch insights", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add items to your wardrobe.');
      return;
    }
    
    const payload = { 
      ...formData, 
      gender, 
      userId: user.userId,
      imagePath: formData.imagePath || ''
    };
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? API_ENDPOINTS.WARDROBE.UPDATE(isEditing)
        : API_ENDPOINTS.WARDROBE.BASE;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchItems();
        setFormData({ clothType: '', color: '', pattern: '', season: '', imagePath: '' });
        setImagePreview('');
        setIsEditing(null);
        alert(isEditing ? 'Item updated successfully!' : 'Item added to your wardrobe!');
      } else {
        throw new Error('Failed to save item');
      }
    } catch (err) {
      console.error("Save failed", err);
      alert('Failed to save item. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this item?")) return;
    try {
      await fetch(API_ENDPOINTS.WARDROBE.DELETE(id), { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (item: WardrobeItem) => {
    setFormData(item);
    setIsEditing(item.wardrobeId!);
    setImagePreview(item.imagePath || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPsychologyInsight = (colorName: string) => {
    const insight = psychology.find(p => p.colorName.toLowerCase() === colorName.toLowerCase());
    return insight ? insight.psychologyEffect : "No specific insight available.";
  };

  const getSkinToneCompatibility = (colorName: string) => {
    const compatibleTones = skinRules
      .filter(rule => rule.suitableColors.toLowerCase().includes(colorName.toLowerCase()))
      .map(rule => rule.skinTone);
    
    return compatibleTones.length > 0 ? compatibleTones.join(', ') : "Universal";
  };

  const getColorCombinations = () => {
    // Group items by color
    const colorGroups: { [key: string]: WardrobeItem[] } = {};
    items.forEach(item => {
      if (!colorGroups[item.color]) {
        colorGroups[item.color] = [];
      }
      colorGroups[item.color].push(item);
    });
    return colorGroups;
  };

  // Fetch outfit suggestions for a specific item
  const fetchSuggestionsForItem = async (item: WardrobeItem) => {
    if (!user || !item.wardrobeId) return;
    
    setSelectedItem(item);
    setSuggestionsLoading(true);
    setActiveTab('suggestions');
    
    try {
      console.log('Fetching suggestions for item:', item.wardrobeId);
      const res = await fetch(API_ENDPOINTS.WARDROBE.SUGGESTIONS(item.wardrobeId, user.userId));
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Suggestions received:', data);
      setSuggestions(data.suggestions || []);
      setStyleTips(data.styleTips || []);
      
      if (!data.suggestions || data.suggestions.length === 0) {
        console.warn('No suggestions found. Make sure you have other items in your wardrobe.');
      }
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
      setSuggestions([]);
      setStyleTips([]);
      alert('Failed to fetch suggestions. Check console for details.');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Fetch complete outfit combinations
  const fetchCompleteOutfits = async () => {
    if (!user) return;
    
    setOutfitsLoading(true);
    setActiveTab('outfits');
    
    try {
      console.log('Fetching complete outfits for user:', user.userId);
      const res = await fetch(API_ENDPOINTS.WARDROBE.OUTFITS(user.userId));
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Complete outfits received:', data);
      setCompleteOutfits(data.outfits || []);
      
      if (!data.outfits || data.outfits.length === 0) {
        console.warn('No outfit combinations found. You need at least one top and one bottom item.');
      }
    } catch (err) {
      console.error("Failed to fetch outfits", err);
      setCompleteOutfits([]);
      alert('Failed to fetch outfit combinations. Check console for details.');
    } finally {
      setOutfitsLoading(false);
    }
  };

  if (!isLoggedIn()) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center">
        <div className="bg-white p-16 rounded-[56px] shadow-xl border border-stone-100">
          <div className="w-24 h-24 mx-auto mb-8 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif text-stone-900 mb-4">Login Required</h2>
          <p className="text-stone-500 mb-8">Please login to access your personal digital closet and save your wardrobe items.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-amber-800 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
          <h1 className="text-5xl font-serif text-stone-900 mb-4">Digital Closet</h1>
          <p className="text-stone-500">Welcome back, <span className="font-bold text-stone-900">{user?.userName}</span>! Manage your personal wardrobe.</p>
        </div>
        
        <div className="flex bg-stone-100 p-1.5 rounded-full shadow-inner">
          {['Men', 'Women'].map((g) => (
            <button 
              key={g}
              onClick={() => { 
                setGender(g as any); 
                setIsEditing(null); 
                setFormData({ clothType: '', color: '', pattern: '', season: '', imagePath: '' }); 
                setImagePreview('');
              }}
              className={`px-10 py-3 rounded-full text-sm font-bold transition-all duration-300 ${gender === g ? 'bg-stone-900 text-white shadow-xl scale-105' : 'text-stone-500 hover:text-stone-700'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-4">
          <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm sticky top-24">
            <h3 className="text-xl font-serif text-stone-900 mb-8">{isEditing ? 'Edit Item' : 'Add Clothing Item'}</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">
                    Upload Photo (Optional)
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-2xl border-2 border-stone-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className="w-full h-48 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 transition-all"
                      >
                        {uploadingImage ? (
                          <>
                            <svg className="w-10 h-10 text-amber-600 animate-spin mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm text-stone-500">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-12 h-12 text-stone-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-semibold text-stone-700 mb-1">Click to upload photo</span>
                            <span className="text-xs text-stone-500">PNG, JPG up to 2MB</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Cloth Type</label>
                  <select 
                    required
                    value={formData.clothType}
                    onChange={(e) => setFormData({ ...formData, clothType: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-100 px-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-amber-800 outline-none"
                  >
                    <option value="">Select</option>
                    {(gender === 'Men' ? MEN_TYPES : WOMEN_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Color</label>
                  <select 
                    required
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-100 px-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-amber-800 outline-none"
                  >
                    <option value="">Select</option>
                    {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Pattern</label>
                  <select 
                    required
                    value={formData.pattern}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-100 px-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-amber-800 outline-none"
                  >
                    <option value="">Select</option>
                    {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Season</label>
                  <select 
                    required
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-100 px-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-amber-800 outline-none"
                  >
                    <option value="">Select</option>
                    {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-amber-800 transition-all flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Update Wardrobe
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add to Wardrobe
                  </>
                )}
              </button>
              
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => { 
                    setIsEditing(null); 
                    setFormData({ clothType: '', color: '', pattern: '', season: '', imagePath: '' }); 
                    setImagePreview('');
                  }}
                  className="w-full text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-stone-600 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Display Section */}
        <div className="lg:col-span-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 mb-8 p-2 bg-stone-50 rounded-3xl">
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === 'wardrobe'
                  ? 'bg-stone-900 text-white shadow-lg'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              My Wardrobe ({items.length})
            </button>
            <button
              onClick={fetchCompleteOutfits}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === 'outfits'
                  ? 'bg-amber-800 text-white shadow-lg'
                  : 'text-stone-500 hover:text-amber-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Complete Outfits
            </button>
            {selectedItem && (
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'suggestions'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-stone-500 hover:text-purple-600'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Suggestions for {selectedItem.clothType}
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-stone-50 animate-pulse h-48 rounded-[40px]"></div>
              ))}
            </div>
          ) : activeTab === 'wardrobe' ? (
            // Wardrobe Tab
            items.length > 0 ? (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.wardrobeId} 
                  className="group bg-white rounded-[40px] border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 p-8"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      {item.imagePath ? (
                        <img 
                          src={item.imagePath} 
                          alt={item.clothType}
                          className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-stone-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: item.color.toLowerCase() }}>
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                      )}
                      <div>
                        <h4 className="text-xl font-serif text-stone-900">{item.clothType}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">{item.season}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.wardrobeId!)}
                        className="p-2 rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-stone-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Color</p>
                      <p className="text-sm font-bold text-stone-700">{item.color}</p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Pattern</p>
                      <p className="text-sm font-bold text-stone-700">{item.pattern}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-50 space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 mb-2">Psychology Insight</p>
                      <p className="text-xs text-stone-600 italic leading-relaxed">
                        "{getPsychologyInsight(item.color)}"
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Best for Skin Tones</p>
                      <p className="text-xs font-bold text-stone-700">
                        {getSkinToneCompatibility(item.color)}
                      </p>
                    </div>
                    
                    {/* Get Suggestions Button */}
                    <button
                      onClick={() => fetchSuggestionsForItem(item)}
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-2xl font-bold text-sm hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                    >
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      Find Matching Items
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Color Psychology & Combinations Insights */}
            {items.length > 0 && (
              <div className="mt-12 space-y-8">
                <h3 className="text-2xl font-serif text-stone-900 mb-6">Your Wardrobe Insights</h3>
                
                {/* Color Summary */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-[40px] border-2 border-amber-100">
                  <h4 className="text-xs uppercase font-black tracking-widest text-amber-800 mb-6">Color Distribution</h4>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(getColorCombinations()).map(([color, colorItems]) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                          selectedColor === color
                            ? 'bg-stone-900 text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-stone-100 text-stone-700 hover:border-amber-300'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full shadow-md" 
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></div>
                        <span className="font-bold text-sm">{color}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          selectedColor === color ? 'bg-white/20' : 'bg-stone-100'
                        }`}>
                          {colorItems.length}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {selectedColor && (
                    <div className="mt-8 p-6 bg-white rounded-3xl border border-amber-200">
                      <h5 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <div 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: selectedColor.toLowerCase() }}
                        ></div>
                        {selectedColor} Items in Your Closet
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {getColorCombinations()[selectedColor].map((item) => (
                          <div key={item.wardrobeId} className="p-4 bg-stone-50 rounded-2xl text-center">
                            <p className="font-semibold text-sm text-stone-900">{item.clothType}</p>
                            <p className="text-[10px] text-stone-500 uppercase mt-1">{item.pattern}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-stone-100">
                        <p className="text-xs uppercase font-black tracking-widest text-amber-800 mb-3">Psychology Insight</p>
                        <p className="text-sm text-stone-700 italic leading-relaxed">{getPsychologyInsight(selectedColor)}</p>
                        <p className="text-xs uppercase font-black tracking-widest text-stone-400 mb-2 mt-4">Best for Skin Tones</p>
                        <p className="text-sm font-bold text-stone-700">{getSkinToneCompatibility(selectedColor)}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Outfit Suggestions */}
                <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm">
                  <h4 className="text-xs uppercase font-black tracking-widest text-stone-400 mb-6">Smart Combinations</h4>
                  <div className="space-y-4">
                    {items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md" 
                          style={{ backgroundColor: item.color.toLowerCase() }}
                        >
                          <span className="text-xs font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-stone-900">{item.clothType} + Complementary Piece</p>
                          <p className="text-xs text-stone-500">Perfect for {item.season} season</p>
                        </div>
                        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </>
            ) : (
              // Empty Wardrobe State  
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-stone-100 rounded-[56px] bg-stone-50/30 text-center p-12">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <h4 className="text-stone-400 font-serif text-xl mb-2">Empty Closet</h4>
                <p className="text-stone-400 text-sm max-w-xs">Start building your {gender.toLowerCase()}'s digital wardrobe by adding your first clothing item.</p>
              </div>
            )
          ) : activeTab === 'suggestions' ? (
            // Suggestions Tab
            selectedItem ? (
            <div className="space-y-6">
              {/* Selected Item Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-[40px] border-2 border-purple-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: selectedItem.color.toLowerCase() }}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-stone-900">{selectedItem.clothType}</h3>
                    <p className="text-sm text-stone-600">Finding perfect matches for your {selectedItem.color} {selectedItem.clothType}</p>
                  </div>
                </div>

                {/* Style Tips */}
                {styleTips.length > 0 && (
                  <div className="mt-6 p-6 bg-white rounded-3xl border border-purple-200">
                    <h4 className="text-xs uppercase font-black tracking-widest text-purple-600 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Style Tips
                    </h4>
                    <div className="space-y-2">
                      {styleTips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-stone-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions Grid */}
              {suggestionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-stone-50 animate-pulse h-64 rounded-[40px]"></div>
                  ))}
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <h4 className="text-xs uppercase tracking-widest font-black text-stone-400">
                    {suggestions.length} Matching Items Found
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestions.map((suggestion, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-white p-6 rounded-[40px] border-2 border-stone-100 hover:border-purple-300 hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {suggestion.item.imagePath ? (
                              <img 
                                src={suggestion.item.imagePath} 
                                alt={suggestion.item.clothType}
                                className="w-14 h-14 rounded-xl object-cover shadow-md border-2 border-stone-100"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: suggestion.item.color.toLowerCase() }}>
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                              </div>
                            )}
                            <div>
                              <h5 className="text-lg font-serif text-stone-900">{suggestion.item.clothType}</h5>
                              <p className="text-xs text-stone-500">{suggestion.item.color} • {suggestion.item.pattern}</p>
                            </div>
                          </div>
                          
                          {/* Match Score Badge */}
                          <div className={`px-4 py-2 rounded-full text-xs font-black ${
                            suggestion.compatibility === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                            suggestion.compatibility === 'Good' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {suggestion.matchScore}/100
                          </div>
                        </div>

                        {/* Compatibility Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                          suggestion.compatibility === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200' :
                          suggestion.compatibility === 'Good' ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-2 border-amber-200'
                        }`}>
                          {suggestion.compatibility === 'Excellent' && <Heart className="w-4 h-4 fill-current" />}
                          {suggestion.compatibility === 'Good' && <TrendingUp className="w-4 h-4" />}
                          {suggestion.compatibility} Match
                        </div>

                        {/* Reasons */}
                        <div className="space-y-2">
                          {suggestion.reasons.map((reason, rIdx) => (
                            <div key={rIdx} className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-xs text-stone-600">{reason}</p>
                            </div>
                          ))}
                        </div>

                        {/* Season Tag */}
                        <div className="mt-4 pt-4 border-t border-stone-100">
                          <span className="text-xs text-stone-500">Perfect for {suggestion.item.season}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-stone-400">No matching items found. Add more clothes to your wardrobe!</p>
                </div>
              )}
            </div>
            ) : (
              // No item selected for suggestions
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-stone-100 rounded-[56px] bg-purple-50/30 text-center p-12">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-10 h-10 text-purple-400" />
                </div>
                <h4 className="text-purple-400 font-serif text-xl mb-2">No Item Selected</h4>
                <p className="text-stone-500 text-sm max-w-xs">Go to My Wardrobe tab and click "Find Matching Items" on any clothing piece to see suggestions.</p>
              </div>
            )
          ) : activeTab === 'outfits' ? (
            // Complete Outfits View
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-[40px] border-2 border-amber-100">
                <h3 className="text-2xl font-serif text-stone-900 mb-2 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  Complete Outfit Combinations
                </h3>
                <p className="text-sm text-stone-600">AI-generated perfect outfit pairings from your wardrobe</p>
              </div>

              {outfitsLoading ? (
                <div className="grid grid-cols-1 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-stone-50 animate-pulse h-48 rounded-[40px]"></div>
                  ))}
                </div>
              ) : completeOutfits.length > 0 ? (
                <>
                  <h4 className="text-xs uppercase tracking-widest font-black text-stone-400">
                    {completeOutfits.length} Outfit Combinations Available
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    {completeOutfits.map((outfit, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx}
                        className="bg-white p-8 rounded-[40px] border-2 border-stone-100 hover:border-amber-300 hover:shadow-2xl transition-all"
                      >
                        <div className="flex flex-col md:flex-row gap-8">
                          {/* Outfit Preview */}
                          <div className="flex gap-4">
                            {/* Top */}
                            <div className="relative">
                              {outfit.top.imagePath ? (
                                <img 
                                  src={outfit.top.imagePath} 
                                  alt={outfit.top.clothType}
                                  className="w-32 h-32 rounded-3xl object-cover shadow-lg border-2 border-stone-100"
                                />
                              ) : (
                                <div className="w-32 h-32 rounded-3xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: outfit.top.color.toLowerCase() }}>
                                  <div className="text-center">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    <p className="text-[10px] font-bold uppercase">Top</p>
                                  </div>
                                </div>
                              )}
                              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                {outfit.score}
                              </div>
                            </div>
                            
                            {/* Plus Sign */}
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                              </div>
                            </div>
                            
                            {/* Bottom */}
                            {outfit.bottom.imagePath ? (
                              <img 
                                src={outfit.bottom.imagePath} 
                                alt={outfit.bottom.clothType}
                                className="w-32 h-32 rounded-3xl object-cover shadow-lg border-2 border-stone-100"
                              />
                            ) : (
                              <div className="w-32 h-32 rounded-3xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: outfit.bottom.color.toLowerCase() }}>
                                <div className="text-center">
                                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                  <p className="text-[10px] font-bold uppercase">Bottom</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Outfit Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-xl font-serif text-stone-900 mb-1">
                                  {outfit.top.clothType} + {outfit.bottom.clothType}
                                </h4>
                                <p className="text-sm text-stone-500">
                                  {outfit.top.color} {outfit.top.pattern} • {outfit.bottom.color} {outfit.bottom.pattern}
                                </p>
                              </div>
                              
                              {/* Rating Badge */}
                              <div className={`px-5 py-2 rounded-full text-sm font-black flex items-center gap-2 ${
                                outfit.rating.includes('Excellent') ? 'bg-emerald-100 text-emerald-700' :
                                outfit.rating.includes('Good') ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {outfit.rating.includes('Excellent') && <Heart className="w-4 h-4 fill-current" />}
                                {outfit.rating}
                              </div>
                            </div>

                            {/* Occasion Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {outfit.occasion.split(',').map((occ, occIdx) => (
                                <span
                                  key={occIdx}
                                  className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs font-semibold text-stone-700"
                                >
                                  {occ.trim()}
                                </span>
                              ))}
                            </div>

                            {/* Score Details */}
                            <div className="mt-6 pt-6 border-t border-stone-100">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <span className="text-sm font-black text-amber-700">{outfit.score}</span>
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-stone-900">Match Score</p>
                                    <p className="text-[10px] text-stone-500">Out of 100</p>
                                  </div>
                                </div>
                                
                                <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${outfit.score}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={`h-full ${
                                      outfit.score >= 80 ? 'bg-emerald-500' :
                                      outfit.score >= 60 ? 'bg-blue-500' :
                                      'bg-amber-500'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-stone-300" />
                  </div>
                  <p className="text-stone-400 mb-2">No outfit combinations found</p>
                  <p className="text-sm text-stone-500">Add more tops and bottoms to generate outfits!</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WardrobePage;
