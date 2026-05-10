
import React from 'react';
import { Link } from 'react-router-dom';

const modules = [
  {
    id: 'occasion',
    title: 'Global Occasions',
    description: 'From Indian Weddings to Parisian Cocktails and Black Tie Galas.',
    image: '/assets/images/occasion.svg',
    path: '/occasion',
    accent: 'bg-rose-50'
  },
  {
    id: 'skin-tone',
    title: 'Tone Harmony',
    description: 'Inclusive color analysis for the diverse spectrum of global skin tones.',
    image: '/assets/images/skintone.svg',
    path: '/skin-tone',
    accent: 'bg-amber-50'
  },
  {
    id: 'trends',
    title: 'The Trend Bridge',
    description: 'Bridging the gap between Milan runways and Mumbai craftsmanship.',
    image: '/assets/images/trends.svg',
    path: '/trends',
    accent: 'bg-indigo-50'
  },
  {
    id: 'wardrobe',
    title: 'Digital Closet',
    description: 'Manage your ethnic wear and western staples in one smart space.',
    image: '/assets/images/wardrobe.svg',
    path: '/wardrobe',
    accent: 'bg-emerald-50'
  },
  {
    id: 'psychology',
    title: 'Global Psychology',
    description: 'How colors influence perception in both Eastern and Western societies.',
    image: '/assets/images/psychology.svg',
    path: '/psychology',
    accent: 'bg-purple-50'
  },
  {
    id: 'virtual-trial',
    title: 'Virtual Trial Room',
    description: 'Upload your photo and try on outfits digitally before you buy.',
    image: '/assets/images/stylist.svg',
    path: '/virtual-trial',
    accent: 'bg-amber-100'
  }
];

const HomePage: React.FC = () => {
  return (
    <div className="bg-[#faf9f6]">
      <section className="relative min-h-[90vh] lg:h-[85vh] flex items-center overflow-hidden py-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/hero.svg" 
            alt="Global Fashion Background"
            className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-transparent to-[#faf9f6]/90"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-amber-800 uppercase bg-amber-100/60 rounded-full border border-amber-200">
              International Craftsmanship
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif text-stone-900 leading-[1.1] mb-8">
              Style Without <br/> 
              <span className="italic text-amber-800">Borders.</span>
            </h1>
            <p className="text-base md:text-lg text-stone-700 mb-10 font-light leading-relaxed max-w-lg">
              Our <span className="font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Smart Outfit Recommendation System</span> is your passport to smart dressing. We blend the timeless elegance of Indian heritage with the sophisticated edge of global fashion.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-stone-900 mb-4">Universal Style Modules</h2>
          <div className="w-24 h-1 bg-amber-800 mx-auto"></div>
          <p className="mt-4 text-stone-500">Tailored intelligence for the modern, global citizen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <Link 
              key={module.id} 
              to={module.path}
              className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={module.image} 
                  alt={module.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className={`p-8 ${module.accent} flex-grow transition-colors group-hover:bg-white`}>
                <h3 className="text-2xl font-serif text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
                  {module.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  {module.description}
                </p>
                <div className="flex items-center text-amber-800 text-sm font-bold tracking-widest uppercase">
                  Discover
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-stone-900 py-24 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-serif text-white mb-8 leading-tight">
            Global Vision, <br/><span className="text-amber-500 italic">Timeless Style.</span>
          </h2>
          <div className="space-y-6 text-stone-400 text-lg">
            <p>
              Our personalized fashion platform is designed for the modern individual who moves between worlds. Whether you're attending a board meeting in New York or a Royal Wedding in Rajasthan, our AI bridges the gap.
            </p>
            <p>
              We celebrate the intersection of global minimalist trends with the high-maximalism of Indian celebratory wear. This is where high-tech styling meets the soul of hand-woven craftsmanship.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
