
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const RecommendationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [prompt, setPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a world-class fashion stylist specializing in Indian heritage and Global Fusion. Provide a detailed styling recommendation for: ${prompt}. 
        Rules:
        1. Consider the audience is global (India and international).
        2. If appropriate, suggest Indo-Western fusion (e.g., blazer with dhoti, saree with belt, kurta with trousers).
        3. Include a 'Global Etiquette' tip.
        4. Provide an 'Auspicious' factor if it's an Indian event.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              outfitDescription: { type: Type.STRING },
              stylingTips: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              colorPalette: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              culturalSignificance: { type: Type.STRING },
              globalEtiquette: { type: Type.STRING }
            },
            required: ["outfitDescription", "stylingTips", "colorPalette", "culturalSignificance", "globalEtiquette"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      setRecommendation(result);
    } catch (error) {
      console.error("AI Error:", error);
      alert("The stylist is currently offline. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-stone-900 mb-4">Fusion AI Stylist</h1>
        <p className="text-stone-500">Bridging the best of Eastern heritage and Western trends.</p>
      </div>

      <div className="bg-white p-2 rounded-[32px] shadow-2xl border border-stone-100 mb-16 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-2">
          <input 
            type="text" 
            placeholder="e.g., I'm attending a London reception but want a touch of Desi glam..."
            className="flex-grow bg-transparent border-none px-8 py-5 rounded-3xl focus:ring-0 outline-none text-lg"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-stone-900 text-white px-10 py-5 rounded-[28px] font-bold hover:bg-amber-800 disabled:opacity-50 transition-all shadow-xl"
          >
            {loading ? 'Styling...' : 'Design My Look'}
          </button>
        </div>
      </div>

      {recommendation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-12 rounded-[48px] border border-stone-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <span className="text-4xl opacity-10 font-serif">“</span>
              </div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-amber-800 font-bold mb-6">Stylist's Recommendation</h2>
              <p className="text-2xl font-serif text-stone-900 leading-snug mb-10">
                {recommendation.outfitDescription}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-4">How to Style</h3>
                    <ul className="space-y-3">
                      {recommendation.stylingTips.map((tip: string, i: number) => (
                        <li key={i} className="text-stone-600 text-sm flex items-start">
                          <span className="text-amber-600 mr-2">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                 </div>
                 <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-amber-800 mb-3">Global Etiquette</h3>
                    <p className="text-sm text-amber-900/80 leading-relaxed italic">
                      {recommendation.globalEtiquette}
                    </p>
                 </div>
              </div>
            </div>

            <div className="bg-stone-900 text-white p-12 rounded-[48px]">
              <h3 className="text-xl font-serif mb-4 text-amber-400">Cultural & Global Heritage</h3>
              <p className="text-stone-400 leading-relaxed">
                {recommendation.culturalSignificance}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm">
              <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-8">Fusion Palette</h3>
              <div className="space-y-4">
                {recommendation.colorPalette.map((color: string) => (
                  <div key={color} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl shadow-inner border border-stone-100 transition-transform group-hover:scale-110" style={{ backgroundColor: color.toLowerCase() }}></div>
                    <span className="text-sm font-medium text-stone-700">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-100/30 p-2 rounded-[48px] border border-amber-100/50">
               <img src="/assets/images/stylist.svg" className="rounded-[40px] shadow-lg" alt="Stylist Reference" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
