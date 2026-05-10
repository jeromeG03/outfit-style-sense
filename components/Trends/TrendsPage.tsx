
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryTrend {
  name: string;
  percentage: number;
  color: string;
  searches?: number;
  growth?: number;
}

interface TrendingItem {
  name: string;
  searches: number;
  growth: number;
  category: string;
}

interface RegionalData {
  name: string;
  topCategory: string;
  engagement: number;
  avgPrice: string;
}

interface HistoricalData {
  date: string;
  indoWestern: number;
  heritage: number;
  minimalist: number;
  streetwear: number;
  searches: number;
}

interface ColorTrend {
  name: string;
  hex: string;
  popularity: number;
  growth: number;
}

const TrendsPage: React.FC = () => {
  const [categoryTrends, setCategoryTrends] = useState<CategoryTrend[]>([]);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [regions, setRegions] = useState<RegionalData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [trendingColors, setTrendingColors] = useState<ColorTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [totalSearches, setTotalSearches] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTrends = async () => {
    try {
      console.log('🔄 Fetching trends data...', new Date().toLocaleTimeString());
      
      const [currentRes, itemsRes, regionsRes, historicalRes, colorsRes] = await Promise.all([
        fetch('http://localhost:8080/api/trends/current'),
        fetch('http://localhost:8080/api/trends/categories'),
        fetch('http://localhost:8080/api/trends/regions'),
        fetch('http://localhost:8080/api/trends/historical?days=7'),
        fetch('http://localhost:8080/api/trends/colors')
      ]);

      if (!currentRes.ok || !itemsRes.ok || !regionsRes.ok) {
        throw new Error('Failed to fetch trends data');
      }

      const [current, items, regionsData, historical, colors] = await Promise.all([
        currentRes.json(),
        itemsRes.json(),
        regionsRes.json(),
        historicalRes.json(),
        colorsRes.json()
      ]);

      console.log('✅ Trends data updated:', {
        timestamp: current.lastUpdated,
        totalSearches: current.totalSearches,
        categories: current.categories.length,
        trendingItems: items.trendingItems.length
      });

      setCategoryTrends(current.categories);
      setLastUpdated(current.lastUpdated);
      setTotalSearches(current.totalSearches);
      setTrendingItems(items.trendingItems);
      setRegions(regionsData.regions);
      setHistoricalData(historical.data);
      setTrendingColors(colors.colors.slice(0, 6));
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch trends', err);
      setError('Could not load trend data. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
    
    // Auto-refresh every 5 seconds if enabled
    if (autoRefresh) {
      console.log('🔔 Auto-refresh enabled: Data will update every 5 seconds');
      const interval = setInterval(fetchTrends, 5000);
      
      return () => {
        console.log('🛑 Auto-refresh disabled');
        clearInterval(interval);
      };
    } else {
      console.log('⏸️ Auto-refresh paused');
    }
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
            <p className="text-stone-500">Loading real-time trend data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      {/* Header with Live Indicator */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-5xl font-serif text-stone-900">Trend Bridge</h1>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 bg-emerald-500 rounded-full"
          ></motion.div>
        </div>
        <p className="text-stone-500 max-w-2xl mx-auto mb-6">
          Real-time aggregated market insights from global fashion hubs. Data updates dynamically.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-stone-600">Live Data</span>
          </div>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500">Updated: {lastUpdated}</span>
          <span className="text-stone-300">|</span>
          <span className="font-bold text-stone-900">{totalSearches.toLocaleString()} searches</span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${ 
              autoRefresh
                ? 'bg-stone-900 text-white shadow-lg'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {autoRefresh ? '● Auto-Refresh' : '○ Paused'}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Trend Visualization */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-stone-100">
           <h3 className="text-xs uppercase tracking-widest font-black text-stone-400 mb-10">Popularity index (Last 90 Days)</h3>
           <div className="space-y-8">
             {categoryTrends.map(trend => (
               <div key={trend.name}>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>{trend.name}</span>
                    <span className="text-stone-400">{trend.percentage}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${trend.color} h-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${trend.percentage}%` }}
                    ></div>
                  </div>
               </div>
             ))}
           </div>
           <p className="mt-8 text-[10px] text-stone-400 leading-relaxed uppercase tracking-tighter italic">
             *Data modeled after Myntra, Ajio, and Farfetch quarterly insights for academic demonstration.
           </p>
        </div>

        {/* Global Insight Card */}
        <div className="bg-stone-900 text-white p-12 rounded-[40px] flex flex-col justify-center">
           <span className="text-amber-500 text-6xl font-serif mb-6">“</span>
           <h2 className="text-3xl font-serif mb-6 leading-tight italic">
             The bridge between luxury handlooms and functional global minimalism is the fastest growing sector in 2025.
           </h2>
           <p className="text-stone-400 text-lg">
             Men's fashion is seeing a 22% surge in "Dandy-Indian" styles, while women's trends favor "Saree-Tech" – traditional weaves with modern utility.
           </p>
        </div>
      </div>

      {/* Trending Items Section */}
      {trendingItems.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-serif text-stone-900 mb-6">Trending Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.slice(0, 8).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-stone-900 text-sm">{item.name}</h4>
                  <span className={`text-xs font-bold ${item.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.growth >= 0 ? '↑' : '↓'} {Math.abs(item.growth)}%
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-2">{item.category}</p>
                <p className="text-2xl font-bold text-stone-900">{item.searches.toLocaleString()}</p>
                <p className="text-xs text-stone-400">searches</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Regional Trends */}
      {regions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-serif text-stone-900 mb-6">Regional Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {regions.map((region, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-gradient-to-br from-stone-50 to-white p-6 rounded-3xl border border-stone-200"
              >
                <h4 className="font-bold text-stone-900 text-lg mb-2">{region.name}</h4>
                <p className="text-xs text-stone-500 mb-4">Top: {region.topCategory}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Engagement</span>
                    <span className="font-bold text-stone-900">{region.engagement}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Avg Price</span>
                    <span className="font-bold text-stone-900">{region.avgPrice}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trending Colors */}
      {trendingColors.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-serif text-stone-900 mb-6">Trending Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {trendingColors.map((color, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * idx }}
                className="group text-center"
              >
                <div 
                  className="w-full aspect-square rounded-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <p className="text-xs font-bold text-stone-900 mb-1">{color.name}</p>
                <p className="text-xs text-stone-500">{color.popularity}%</p>
                {color.growth !== undefined && (
                  <p className={`text-xs font-bold ${color.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {color.growth >= 0 ? '↑' : '↓'} {Math.abs(color.growth)}%
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Historical Trends Chart */}
      {historicalData.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white p-10 rounded-[40px] shadow-lg border border-stone-100"
        >
          <h3 className="text-2xl font-serif text-stone-900 mb-6">7-Day Trend History</h3>
          <div className="space-y-4">
            {historicalData.map((day, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-xs text-stone-500 w-20">{day.date}</span>
                <div className="flex-1 flex gap-1">
                  <div 
                    className="h-8 bg-amber-500 rounded transition-all hover:opacity-80"
                    style={{ width: `${(day.indoWestern / 100) * 100}%` }}
                    title={`Indo-Western: ${day.indoWestern.toFixed(1)}%`}
                  ></div>
                  <div 
                    className="h-8 bg-stone-600 rounded transition-all hover:opacity-80"
                    style={{ width: `${(day.heritage / 100) * 100}%` }}
                    title={`Heritage: ${day.heritage.toFixed(1)}%`}
                  ></div>
                  <div 
                    className="h-8 bg-stone-400 rounded transition-all hover:opacity-80"
                    style={{ width: `${(day.minimalist / 100) * 100}%` }}
                    title={`Minimalist: ${day.minimalist.toFixed(1)}%`}
                  ></div>
                  <div 
                    className="h-8 bg-emerald-600 rounded transition-all hover:opacity-80"
                    style={{ width: `${(day.streetwear / 100) * 100}%` }}
                    title={`Streetwear: ${day.streetwear.toFixed(1)}%`}
                  ></div>
                </div>
                <span className="text-xs text-stone-400 w-32">{day.searches.toLocaleString()} searches</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrendsPage;
