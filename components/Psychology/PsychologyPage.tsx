
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { API_ENDPOINTS } from '../../config/api';

interface ColorPsychology {
  colorId: number;
  colorName: string;
  psychologyEffect: string;
  suitableFor: string;
}

const PsychologyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingColors, setLoadingColors] = useState(true);
  const [error, setError] = useState<string>('');
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
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

  const analyzePsychology = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the psychological and social perception of this outfit: "${description}".
        Focus on:
        1. Perception by others (Global vs Indian context).
        2. Emotional/Psychological impact on the wearer.
        3. Professional vs Casual impression.
        4. Colors meaning.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              perception: { type: Type.STRING },
              emotionalImpact: { type: Type.STRING },
              impression: { type: Type.STRING },
              colorMeaning: { type: Type.STRING }
            },
            required: ["perception", "emotionalImpact", "impression", "colorMeaning"]
          }
        }
      });
      setAnalysis(JSON.parse(response.text || '{}'));
    } catch (e) {
      console.error(e);
      alert("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            {dbColors.map((color) => (
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
                  style={{ backgroundColor: color.colorName.toLowerCase() }}
                ></div>
                <span className="font-semibold text-sm">{color.colorName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Color Detail */}
      {selectedColor && (
        <div className="mb-16 bg-white p-12 rounded-[56px] shadow-sm border border-stone-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center gap-6 mb-8">
            <div 
              className="w-24 h-24 rounded-3xl shadow-xl border-4 border-stone-50"
              style={{ backgroundColor: selectedColor.colorName.toLowerCase() }}
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
                    style={{ backgroundColor: color.colorName.toLowerCase() }}
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

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 mb-20">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-12 rounded-[56px] shadow-2xl text-white">
           <h3 className="text-2xl font-serif mb-3 text-amber-400">AI-Powered Outfit Psychology Analysis</h3>
           <p className="text-stone-300 mb-8 text-sm">Get instant insights into how your outfit choices affect perception and mood across different cultural contexts.</p>
           <textarea 
            placeholder="Describe your outfit (e.g., 'I am wearing a black turtleneck with a silk ethnic stole')..."
            className="w-full bg-white/10 backdrop-blur border-2 border-white/20 px-6 py-4 rounded-3xl min-h-[120px] mb-6 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm text-white placeholder:text-stone-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
           ></textarea>
           <button 
            onClick={analyzePsychology}
            disabled={loading || !description}
            className="w-full bg-amber-500 text-stone-900 py-5 rounded-full font-bold shadow-xl hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
           >
             {loading ? (
               <>
                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Analyzing Perception...
               </>
             ) : 'Analyze My Presence'}
           </button>
        </div>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-700">
           <div className="p-10 bg-white rounded-[40px] border border-stone-100 shadow-sm">
              <h4 className="text-amber-800 font-bold text-xs uppercase mb-4 tracking-widest">Social Perception</h4>
              <p className="text-stone-700 leading-relaxed text-sm">{analysis.perception}</p>
           </div>
           <div className="p-10 bg-stone-50 rounded-[40px] border border-stone-100">
              <h4 className="text-amber-800 font-bold text-xs uppercase mb-4 tracking-widest">Emotional Impact</h4>
              <p className="text-stone-700 leading-relaxed text-sm">{analysis.emotionalImpact}</p>
           </div>
           <div className="p-10 bg-stone-900 text-white rounded-[40px] md:col-span-2">
              <div className="grid md:grid-cols-2 gap-10">
                 <div>
                    <h4 className="text-amber-400 font-bold text-xs uppercase mb-4 tracking-widest">Impression Matrix</h4>
                    <p className="opacity-80 text-sm">{analysis.impression}</p>
                 </div>
                 <div>
                    <h4 className="text-amber-400 font-bold text-xs uppercase mb-4 tracking-widest">Color Semantics</h4>
                    <p className="opacity-80 text-sm">{analysis.colorMeaning}</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PsychologyPage;
