
import React, { useState, useEffect } from 'react';

interface Occasion {
  occasionId: number;
  occasionType: string;
  occasionName: string;
  region: string;
  description: string;
  gender: string;
  outfitSuggestions?: string;
  colorPalette?: string;
  accessories?: string;
  dosAndDonts?: string;
}

const OccasionPage: React.FC = () => {
  const [menOccasions, setMenOccasions] = useState<Occasion[]>([]);
  const [womenOccasions, setWomenOccasions] = useState<Occasion[]>([]);
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female'>('Male');
  const [selectedOccasionId, setSelectedOccasionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch occasions for both genders
    Promise.all([
      fetch('http://localhost:8080/api/occasions/gender/Male').then(res => res.json()),
      fetch('http://localhost:8080/api/occasions/gender/Female').then(res => res.json())
    ])
      .then(([menData, womenData]) => {
        setMenOccasions(menData);
        setWomenOccasions(womenData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch occasions", err);
        setError('Could not load occasions. Please ensure the backend is running.');
        setLoading(false);
      });
  }, []);

  const currentOccasions = selectedGender === 'Male' ? menOccasions : womenOccasions;
  const activeOccasion = currentOccasions.find(o => o.occasionId === selectedOccasionId);

  // Reset selected occasion when switching gender tabs
  const handleGenderChange = (gender: 'Male' | 'Female') => {
    setSelectedGender(gender);
    setSelectedOccasionId(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-stone-900 mb-4">Global & Regional Occasions</h1>
        <p className="text-stone-500">Discover handpicked styles for India's diverse festivals and global celebrations.</p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Gender Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-stone-100 rounded-full p-1.5">
          <button
            onClick={() => handleGenderChange('Male')}
            className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${
              selectedGender === 'Male'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            👔 Men's Occasions
          </button>
          <button
            onClick={() => handleGenderChange('Female')}
            className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${
              selectedGender === 'Female'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            👗 Women's Occasions
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto mb-16">
        <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-4 tracking-widest">
          Select Celebration for {selectedGender === 'Male' ? 'Men' : 'Women'}
        </label>
        <select
          className="w-full bg-white border-2 border-stone-200 px-6 py-4 rounded-full text-lg font-medium focus:ring-2 focus:ring-amber-800 outline-none appearance-none cursor-pointer shadow-sm"
          onChange={(e) => setSelectedOccasionId(Number(e.target.value))}
          value={selectedOccasionId || ''}
          disabled={loading || currentOccasions.length === 0}
        >
          <option value="">Choose an event...</option>
          {currentOccasions.map(occ => (
            <option key={occ.occasionId} value={occ.occasionId}>
              {occ.occasionName} ({occ.occasionType})
            </option>
          ))}
        </select>
      </div>

      {activeOccasion ? (
        <div className="space-y-8">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-10 rounded-[48px] border-2 border-stone-200 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                      selectedGender === 'Male' 
                        ? 'text-blue-800 bg-blue-100' 
                        : 'text-pink-800 bg-pink-100'
                    }`}>
                      {activeOccasion.occasionType}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full">
                      {activeOccasion.gender}
                    </span>
                  </div>
                  <h2 className="text-4xl font-serif text-stone-900">{activeOccasion.occasionName}</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Region</p>
                  <p className="text-stone-700 font-serif text-lg">{activeOccasion.region || 'Global'}</p>
                </div>
              </div>
              
              <div className="prose prose-stone max-w-none mb-8">
                <h3 className="text-lg font-serif text-stone-800 mb-4 border-b-2 border-stone-200 pb-2">
                  📖 Styling Guide & Description
                </h3>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {activeOccasion.description || 'No description available.'}
                </p>
              </div>

              {/* Outfit Suggestions */}
              {activeOccasion.outfitSuggestions && (
                <div className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200">
                  <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                    👔 Outfit Suggestions
                  </h3>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                    {activeOccasion.outfitSuggestions}
                  </p>
                </div>
              )}

              {/* Color Palette */}
              {activeOccasion.colorPalette && (
                <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                    🎨 Color Palette
                  </h3>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                    {activeOccasion.colorPalette}
                  </p>
                </div>
              )}

              {/* Accessories */}
              {activeOccasion.accessories && (
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                    💎 Accessories & Finishing Touches
                  </h3>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                    {activeOccasion.accessories}
                  </p>
                </div>
              )}

              {/* Dos and Don'ts */}
              {activeOccasion.dosAndDonts && (
                <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200">
                  <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                    ✅ Dos & ❌ Don'ts
                  </h3>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                    {activeOccasion.dosAndDonts}
                  </p>
                </div>
              )}

              <div className="mt-8 p-6 bg-stone-50 rounded-3xl border-2 border-stone-200 flex items-start gap-6">
                <div className="w-14 h-14 bg-amber-800 rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 mb-2">Cultural Context</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    This recommendation respects the regional traditions of {activeOccasion.region || 'various cultures'} while incorporating modern global trends. 
                    Perfect for {selectedGender === 'Male' ? 'men' : 'women'} attending {activeOccasion.occasionName}.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-stone-200 rounded-[40px] bg-gradient-to-br from-white to-stone-50">
          <div className="text-6xl mb-4">{selectedGender === 'Male' ? '👔' : '👗'}</div>
          <p className="text-stone-400 italic text-xl">
            {loading ? 'Fetching celebrations...' : `Select an occasion to see personalized outfit recommendations for ${selectedGender === 'Male' ? 'men' : 'women'}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default OccasionPage;
