
import React from 'react';

const FlowDiagramPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-stone-900 mb-4">System Architecture</h1>
        <p className="text-stone-500">Technical flow diagram of the <span className="font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Smart Outfit Recommendation System</span> Engine.</p>
      </div>

      <div className="bg-white p-12 rounded-[56px] shadow-sm border border-stone-100 overflow-x-auto">
        <div className="min-w-[800px] relative py-10">
          {/* Main SVG Container */}
          <svg viewBox="0 0 1000 600" className="w-full h-auto drop-shadow-xl">
            {/* Definitions for Markers */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#92400e" />
              </marker>
            </defs>

            {/* Stage 1: Input */}
            <g className="animate-in fade-in duration-500">
              <rect x="20" y="250" width="180" height="100" rx="20" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <text x="110" y="295" textAnchor="middle" className="font-bold text-amber-900 text-sm">USER INTERACTION</text>
              <text x="110" y="315" textAnchor="middle" className="text-amber-700 text-[10px] uppercase tracking-tighter">Occasion / Closet / Prompt</text>
            </g>

            {/* Stage 2: Selection Logic */}
            <g className="animate-in fade-in duration-700">
              <rect x="280" y="100" width="200" height="80" rx="15" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
              <text x="380" y="135" textAnchor="middle" className="font-bold text-stone-800 text-xs">OCCASION MODULE</text>
              <text x="380" y="155" textAnchor="middle" className="text-stone-400 text-[9px]">Regional Shuffle Logic</text>

              <rect x="280" y="260" width="200" height="80" rx="15" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
              <text x="380" y="295" textAnchor="middle" className="font-bold text-stone-800 text-xs">WARDROBE ENGINE</text>
              <text x="380" y="315" textAnchor="middle" className="text-stone-400 text-[9px]">Gender-Specific Matching</text>

              <rect x="280" y="420" width="200" height="80" rx="15" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
              <text x="380" y="455" textAnchor="middle" className="font-bold text-stone-800 text-xs">TONE HARMONY</text>
              <text x="380" y="475" textAnchor="middle" className="text-stone-400 text-[9px]">Skin Tone Matrix</text>
            </g>

            {/* Stage 3: AI Processing */}
            <g className="animate-in fade-in duration-1000">
              <circle cx="650" cy="300" r="100" fill="#1c1917" />
              <text x="650" y="295" textAnchor="middle" fill="#fbbf24" className="font-bold text-lg">GEMINI AI</text>
              <text x="650" y="315" textAnchor="middle" fill="#78716c" className="text-[9px] uppercase tracking-widest">Natural Language Core</text>
              
              <rect x="580" y="420" width="140" height="40" rx="10" fill="#292524" />
              <text x="650" y="445" textAnchor="middle" fill="#a8a29e" className="text-[10px]">CULTURAL RULES DB</text>
            </g>

            {/* Stage 4: Output */}
            <g className="animate-in fade-in duration-1000">
              <path d="M750 300 Q 850 300 900 300" stroke="#92400e" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
              <rect x="800" y="250" width="180" height="100" rx="20" fill="#1c1917" />
              <text x="890" y="295" textAnchor="middle" fill="white" className="font-bold text-sm">RECOMMENDATION</text>
              <text x="890" y="315" textAnchor="middle" fill="#d97706" className="text-[10px] uppercase">Outfit & Styling Tips</text>
            </g>

            {/* Connection Lines */}
            <path d="M200 300 L 250 300" stroke="#d97706" strokeWidth="2" fill="none" />
            <path d="M250 140 L 280 140" stroke="#d97706" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M250 300 L 280 300" stroke="#d97706" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M250 460 L 280 460" stroke="#d97706" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M250 140 L 250 460" stroke="#d97706" strokeWidth="2" fill="none" />

            <path d="M480 140 Q 550 140 580 230" stroke="#e5e7eb" strokeWidth="1" fill="none" />
            <path d="M480 300 L 550 300" stroke="#e5e7eb" strokeWidth="1" fill="none" />
            <path d="M480 460 Q 550 460 580 370" stroke="#e5e7eb" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="p-8 bg-white rounded-3xl border border-stone-100">
          <h3 className="font-serif text-xl mb-4 text-stone-900">1. Data Ingestion</h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            User provides context: Occasion (e.g., Diwali), Personal Wardrobe items, or free-text style goals.
          </p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-stone-100">
          <h3 className="font-serif text-xl mb-4 text-stone-900">2. Algorithmic Filter</h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            System applies hard-coded cultural rules (Tone Harmony, Festival Colors) and shuffles mock market data (Trends).
          </p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-stone-100">
          <h3 className="font-serif text-xl mb-4 text-stone-900">3. Generative Synthesis</h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            Gemini AI processes inputs to generate natural language advice, ensuring fusion aesthetics are respected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlowDiagramPage;