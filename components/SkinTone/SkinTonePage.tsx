
import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { getColorHex, isLightColor } from '../../utils/colorUtils';

interface SkinToneRule {
  ruleId: number;
  skinTone: string;
  suitableColors: string;
  avoidColors: string;
}

const SkinTonePage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rules, setRules] = useState<SkinToneRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch skin tone rules from Spring Boot backend
    fetch(API_ENDPOINTS.SKIN_TONE.ALL)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch skin tone rules');
        }
        return res.json();
      })
      .then(data => {
        setRules(data);
        if (data.length > 0) setSelectedId(data[0].ruleId);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch skin tone rules", err);
        setError('Could not load skin tone rules. Please ensure the backend is running.');
        setLoading(false);
      });
  }, []);

  const activeProfile = rules.find(p => p.ruleId === selectedId);

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-stone-900 mb-4">Tone Harmony - Color Science for Your Skin</h1>
        <p className="text-stone-500 max-w-2xl mx-auto">
          Color science helps determine which shades enhance your features and which ones overshadow them. 
          Select your skin tone profile below for personalized color recommendations.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Elegant Dropdown Selector */}
      <div className="max-w-2xl mx-auto mb-12">
        <label className="block text-xs uppercase font-black tracking-widest text-stone-400 mb-4 text-center">
          Select Your Skin Tone
        </label>
        <div className="relative">
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-full appearance-none bg-white border-2 border-stone-200 rounded-3xl px-8 py-5 text-lg font-semibold text-stone-900 cursor-pointer hover:border-amber-300 focus:border-stone-900 focus:outline-none focus:ring-4 focus:ring-stone-100 transition-all shadow-sm"
          >
            {rules.map(profile => (
              <option key={profile.ruleId} value={profile.ruleId}>
                {profile.skinTone}
              </option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Quick Preview Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {rules.map(profile => (
            <button
              key={profile.ruleId}
              onClick={() => setSelectedId(profile.ruleId)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedId === profile.ruleId
                  ? 'bg-stone-900 text-white shadow-lg scale-105'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {profile.skinTone}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      <div>
        {activeProfile ? (
          <div className="bg-white p-12 rounded-[56px] shadow-sm border border-stone-100 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-serif text-stone-900 mb-2">{activeProfile.skinTone} Tone</h2>
                <p className="text-stone-400">Personalized color recommendations based on your skin tone.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-amber-800">Expert Approved</span>
              </div>
            </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Good Colors */}
                <div>
                  <h3 className="flex items-center text-emerald-700 font-black uppercase tracking-[0.2em] text-xs mb-8">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Recommended Palettes
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {activeProfile.suitableColors.split(',').map((color, idx) => {
                      const colorName = color.trim();
                      const colorHex = getColorHex(colorName);
                      const isLight = isLightColor(colorHex);
                      
                      return (
                        <div key={idx} className="flex flex-col items-center gap-3 group">
                          <div 
                            className="w-full aspect-square rounded-3xl shadow-lg border-4 border-stone-50 transition-transform group-hover:scale-110 flex items-center justify-center text-[10px] font-bold" 
                            style={{ 
                              backgroundColor: colorHex,
                              color: isLight ? '#374151' : '#FFFFFF'
                            }}
                          >
                            {colorName}
                          </div>
                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-tighter text-center">{colorName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Avoid Colors */}
                <div>
                  <h3 className="flex items-center text-rose-700 font-black uppercase tracking-[0.2em] text-xs mb-8">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    Colors to Avoid
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {activeProfile.avoidColors.split(',').map((color, idx) => {
                      const colorName = color.trim();
                      const colorHex = getColorHex(colorName);
                      const isLight = isLightColor(colorHex);
                      
                      return (
                        <div key={idx} className="flex flex-col items-center gap-3 group">
                          <div 
                            className="w-full aspect-square rounded-3xl shadow-sm border-2 border-stone-100 opacity-60 grayscale-[0.2] transition-transform group-hover:scale-110 flex items-center justify-center text-[10px] font-bold" 
                            style={{ 
                              backgroundColor: colorHex,
                              color: isLight ? '#6B7280' : '#D1D5DB'
                            }}
                          >
                            {colorName}
                          </div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter text-center">{colorName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-16 p-8 bg-stone-50 rounded-[40px] flex flex-col md:flex-row items-center gap-8 border border-stone-100">
                 <div className="shrink-0 bg-stone-900 text-amber-400 w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-2xl">?</div>
                 <div>
                    <h4 className="font-bold text-stone-900 mb-1">Pro Tip: Lighting Matters</h4>
                    <p className="text-sm text-stone-500 leading-relaxed">Colors that look "Avoid" in harsh daylight might work well under warm indoor party lights. Always test your final look in the lighting of your event venue.</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-16 rounded-[56px] shadow-sm border border-stone-100 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <p className="text-stone-400 text-lg italic">
                  {loading ? 'Loading color analysis...' : 'Select a skin tone profile to see personalized recommendations'}
                </p>
              </div>
            </div>
          )}
        </div>

      {/* Universal Picks Section */}
      <div className="mt-12 max-w-4xl mx-auto p-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-[48px] border-2 border-amber-100 shadow-sm">
        <div className="flex items-center justify-center gap-4 mb-6">
          <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h4 className="text-amber-900 font-serif text-2xl">Universal Color Picks</h4>
        </div>
        <p className="text-center text-amber-800/70 text-sm uppercase tracking-widest mb-8">
          Colors that work beautifully with any skin tone
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { hex: '#000080', name: 'Navy Blue' },
            { hex: '#4169E1', name: 'Royal Blue' },
            { hex: '#008080', name: 'Teal' },
            { hex: '#800020', name: 'Burgundy' },
            { hex: '#36454F', name: 'Charcoal' },
            { hex: '#FFFFFF', name: 'White' },
            { hex: '#000000', name: 'Black' }
          ].map(({ hex, name }) => (
            <div key={hex} className="flex flex-col items-center gap-3 group">
              <div 
                className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white transition-transform group-hover:scale-110 group-hover:shadow-xl" 
                style={{ backgroundColor: hex }}
              ></div>
              <span className="text-xs font-bold text-amber-900/80 text-center">{name}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-amber-800/60 italic">
            These classic shades are safe choices that complement all skin undertones
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkinTonePage;
