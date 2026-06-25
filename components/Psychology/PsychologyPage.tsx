
import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { getColorHex, isLightColor } from '../../utils/colorUtils';

interface ColorPsychology {
  colorId: number;
  colorName: string;
  psychologyEffect: string;
  suitableFor: string;
}

const PsychologyPage: React.FC = () => {
  const [loadingColors, setLoadingColors] = useState(true);
  const [error, setError] = useState<string>('');
  const [dbColors, setDbColors] = useState<ColorPsychology[]>([]);
  const [selectedColor, setSelectedColor] = useState<ColorPsychology | null>(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.COLOR_PSYCHOLOGY.ALL)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch color psychology data');
        }
        return res.json();
      })
      .then(data => {
        setDbColors(data);
        if (data.length > 0) setSelectedColor(data[0]);
        setLoadingColors(false);
      })
      .catch(err => {
        console.error("Failed to fetch psychology data", err);
        setError('Could not load color psychology data. Please ensure the backend is running.');
        setLoadingColors(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-stone-900 mb-4">Global Color Psychology</h1>
        <p className="text-stone-500 max-w-2xl mx-auto">Understand the hidden language of your wardrobe across cultures. Each color carries unique meanings and psychological effects.</p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Color Selection Pills */}
      {dbColors.length > 0 && (
        <div className="mb-12">
          <label className="block text-xs uppercase font-black tracking-widest text-stone-400 mb-4 text-center">
            Select a Color to Explore
          </label>
          <div className="flex flex-wrap justify-center gap-3">
            {dbColors.map((color) => {
              const colorHex = getColorHex(color.colorName);
              const isLight = isLightColor(colorHex);
              
              return (
                <button
                  key={color.colorId}
                  onClick={() => setSelectedColor(color)}
                  className={`group flex items-center gap-3 px-6 py-3 rounded-full transition-all border-2 ${
                    selectedColor?.colorId === color.colorId
                      ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-105'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: colorHex }}
                  ></div>
                  <span className="font-semibold text-sm">{color.colorName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Color Detail */}
      {selectedColor && (
        <div className="mb-16 bg-white p-12 rounded-[56px] shadow-sm border border-stone-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center gap-6 mb-8">
            <div 
              className="w-24 h-24 rounded-3xl shadow-xl border-4 border-stone-50"
              style={{ backgroundColor: getColorHex(selectedColor.colorName) }}
            ></div>
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-2">{selectedColor.colorName}</h2>
              <p className="text-stone-400">Psychological Impact & Cultural Significance</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-stone-50 rounded-[32px]">
              <h3 className="text-xs uppercase font-black tracking-widest text-amber-800 mb-4">Psychological Effect</h3>
              <p className="text-stone-700 leading-relaxed">{selectedColor.psychologyEffect}</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-[32px] border border-amber-100">
              <h3 className="text-xs uppercase font-black tracking-widest text-amber-800 mb-4">Best Suited For</h3>
              <p className="text-stone-700 leading-relaxed font-medium">{selectedColor.suitableFor}</p>
            </div>
          </div>
        </div>
      )}

      {/* All Colors Grid */}
      {dbColors.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-serif text-center text-stone-900 mb-8">Complete Color Psychology Guide</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbColors.map((color) => (
              <div 
                key={color.colorId} 
                onClick={() => setSelectedColor(color)}
                className="p-6 bg-white rounded-3xl border-2 border-stone-100 hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: getColorHex(color.colorName) }}
                  ></div>
                  <h4 className="font-bold text-lg text-stone-900">{color.colorName}</h4>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-3">{color.psychologyEffect}</p>
                <p className="text-[10px] text-amber-700 uppercase tracking-widest font-bold">→ {color.suitableFor}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologyPage;
