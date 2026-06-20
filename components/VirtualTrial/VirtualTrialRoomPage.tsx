import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Download, RefreshCw, Palette, User, Shirt, ShoppingBag, Sparkles, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../../config/api';

interface Garment {
  id: string;
  url: string;
  type: 'top' | 'bottom';
  name?: string;
}

const VirtualTrialRoomPage: React.FC = () => {
  const [topGarment, setTopGarment] = useState<Garment | null>(null);
  const [bottomGarment, setBottomGarment] = useState<Garment | null>(null);
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [vitonBackendStatus, setVitonBackendStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  
  // API4.AI specific states
  const [avatarSex, setAvatarSex] = useState<'male' | 'female'>('male');
  const [clothingPrompt, setClothingPrompt] = useState('');
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Check API4.AI backend status on mount
  useEffect(() => {
    checkVitonBackend();
  }, []);

  const checkVitonBackend = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.VIRTUAL_TRYON.HEALTH);
      if (response.ok) {
        setVitonBackendStatus('online');
      } else {
        setVitonBackendStatus('offline');
      }
    } catch (error) {
      setVitonBackendStatus('offline');
    }
  };

  const handlePersonImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedFormats.includes(file.type)) {
      alert('❌ Invalid file format!\n\nPlease upload:\n• JPEG\n• PNG\n• WEBP\n\nYour file: ' + file.type);
      e.target.value = '';
      return;
    }

    // Validate file size (12MB max)
    const maxSizeInMB = 12;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      alert(`❌ File too large!\n\nMaximum size: ${maxSizeInMB}MB\nYour file: ${fileSizeMB}MB\n\nPlease compress or resize your image.`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Validate minimum dimensions
        const minWidth = 256;
        const minHeight = 256;
        if (img.width < minWidth || img.height < minHeight) {
          alert(`❌ Image too small!\n\nMinimum size: ${minWidth}x${minHeight}px\nYour image: ${img.width}x${img.height}px\n\nPlease use a higher resolution image.`);
          e.target.value = '';
          return;
        }

        // Show recommendation for optimal size
        const recommendedWidth = 768;
        const recommendedHeight = 1024;
        if (img.width < recommendedWidth || img.height < recommendedHeight) {
          const proceed = confirm(`⚠️ Image size notice\n\nYour image: ${img.width}x${img.height}px\nRecommended: ${recommendedWidth}x${recommendedHeight}px or higher\n\n✓ For best results, use:\n• Full body photo\n• Single person\n• Front-facing pose\n• Good lighting\n• Clear background\n\nDo you want to continue?`);
          if (!proceed) {
            e.target.value = '';
            return;
          }
        }

        setPersonImage(reader.result as string);
        setAiResult(null);
      };
      img.onerror = () => {
        alert('❌ Failed to load image!\n\nPlease ensure the file is a valid image.');
        e.target.value = '';
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      alert('❌ Failed to read file!\n\nPlease try again.');
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const processWithAPI4AI = async () => {
    if (!personImage || (!topGarment && !bottomGarment)) {
      alert('Please upload a person photo and at least one garment');
      return;
    }

    setIsProcessingAI(true);
    try {
      const formData = new FormData();
      
      // Convert base64 to blob for avatar image
      const avatarBlob = await fetch(personImage).then(r => r.blob());
      formData.append('avatarImage', avatarBlob, 'avatar.jpg');

      // Add the first available garment
      if (topGarment) {
        const topBlob = await fetch(topGarment.url).then(r => r.blob());
        formData.append('topGarment', topBlob, 'top.png');
      } else if (bottomGarment) {
        const bottomBlob = await fetch(bottomGarment.url).then(r => r.blob());
        formData.append('bottomGarment', bottomBlob, 'bottom.png');
      }

      // Add API4.AI parameters
      formData.append('avatarSex', avatarSex);
      formData.append('clothingPrompt', clothingPrompt || 'wearing stylish clothing');
      formData.append('avatarPrompt', avatarPrompt || `a ${avatarSex} model in professional pose`);
      formData.append('backgroundPrompt', backgroundPrompt || '');

      let response;
      try {
        response = await fetch(API_ENDPOINTS.VIRTUAL_TRYON.BATCH_PROCESS, {
          method: 'POST',
          body: formData
        });
      } catch (fetchError: any) {
        throw new Error('Failed to connect to backend: ' + fetchError.message);
      }

      if (!response.ok) {
        let errorText = '';
        let errorData: any = null;
        try {
          errorData = await response.json();
          errorText = errorData.error || errorData.message || JSON.stringify(errorData);
        } catch {
          errorText = await response.text();
        }
        console.error('Backend error response:', errorText, errorData);
        
        // Check for specific error types
        if (response.status === 413 || errorText.toLowerCase().includes('too large')) {
          throw new Error('Image files are too large! Each image must be under 16MB. Please compress or resize your images.');
        } else if (response.status === 422 || errorText.toLowerCase().includes('missing')) {
          throw new Error('Missing required images. Please upload both person and garment images.');
        } else if (response.status === 400) {
          throw new Error(`Invalid request: ${errorText}`);
        } else {
          throw new Error(`Server error (${response.status}): ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      if (data.success) {
        setAiResult(data.result_image);
        let message = `✨ AI try-on completed in ${data.processing_time?.toFixed(2)}s!\n\n✓ Your exact garment has been placed on the person\n✓ Powered by API4.AI Virtual Try-On`;
        if (data.warning) {
          message += `\n\n⚠️ Note: ${data.warning}`;
        }
        alert(message);
      } else {
        throw new Error(data.error || 'Processing failed');
      }
    } catch (error: any) {
      console.error('Try-on error:', error);
      const errorMessage = error.message || 'Unknown error';
      
      // Check if it's a network error
      if (errorMessage.includes('Failed to connect to backend') || errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        alert(`❌ Cannot connect to backend!\n\nPlease ensure:\n1. Backend is running on port 8080\n2. No firewall blocking the connection\n3. Press F12 and check Console for details`);
      } else {
        alert(`❌ Error: ${errorMessage}\n\nPlease check:\n1. Images are under 16MB each\n2. Images meet format requirements (JPEG/PNG)\n3. Browser console (F12) for details`);
      }
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'top' | 'bottom') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedFormats.includes(file.type)) {
      alert('❌ Invalid file format!\n\nPlease upload:\n• JPEG\n• PNG\n• WEBP\n\nYour file: ' + file.type);
      e.target.value = '';
      return;
    }

    // Validate file size (12MB max)
    const maxSizeInMB = 12;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      alert(`❌ File too large!\n\nMaximum size: ${maxSizeInMB}MB\nYour file: ${fileSizeMB}MB\n\nPlease compress or resize your image.`);
      e.target.value = '';
      return;
    }

    if (type === 'top') setIsLoadingTop(true);
    else setIsLoadingBottom(true);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Validate minimum dimensions
        const minWidth = 256;
        const minHeight = 256;
        if (img.width < minWidth || img.height < minHeight) {
          alert(`❌ Garment image too small!\n\nMinimum size: ${minWidth}x${minHeight}px\nYour image: ${img.width}x${img.height}px\n\nPlease use a higher resolution image.`);
          if (type === 'top') setIsLoadingTop(false);
          else setIsLoadingBottom(false);
          e.target.value = '';
          return;
        }

        const newGarment: Garment = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          type,
          name: file.name
        };

        if (type === 'top') {
          setTopGarment(newGarment);
          setIsLoadingTop(false);
        } else {
          setBottomGarment(newGarment);
          setIsLoadingBottom(false);
        }
      };

      img.onerror = () => {
        alert('❌ Failed to load garment image!\n\nPlease ensure the file is a valid image.');
        if (type === 'top') setIsLoadingTop(false);
        else setIsLoadingBottom(false);
        e.target.value = '';
      };
      img.src = reader.result as string;
    };

    reader.onerror = () => {
      if (type === 'top') setIsLoadingTop(false);
      else setIsLoadingBottom(false);
      alert('Failed to load image');
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const clearGarment = (type: 'top' | 'bottom') => {
    if (type === 'top') setTopGarment(null);
    else setBottomGarment(null);
  };

  const clearAll = () => {
    setTopGarment(null);
    setBottomGarment(null);
    setAiResult(null);
    setClothingPrompt('');
    setAvatarPrompt('');
    setBackgroundPrompt('');
  };

  const downloadImage = () => {
    if (!previewRef.current) return;
    alert('Download feature requires html2canvas library. Preview is ready to be captured!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-4 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 mb-2 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-4 py-1.5 rounded-full border border-indigo-300 shadow-md">
            <Sparkles className="text-purple-600" size={16} />
            <span className="text-xs font-bold text-purple-900">
              🤖 AI-POWERED VIRTUAL TRY-ON
            </span>
            <Sparkles className="text-purple-600" size={16} />
          </div>
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">
            Virtual Trial Room
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-sm">
            Upload your photo and garments for AI-powered true virtual try-on using API4.AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-3 space-y-3">
            {/* Backend Status Indicator */}
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-xl border-2 shadow-lg ${
                vitonBackendStatus === 'online'
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">🤖 AI Service Status</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    vitonBackendStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                  <span className="text-[9px] text-gray-700">
                    {vitonBackendStatus === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </motion.section>

            {/* Offline Message */}
            {vitonBackendStatus === 'offline' && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-400 shadow-lg"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">⚠️</div>
                  <h3 className="text-sm font-bold text-orange-900 mb-2">
                    Backend Service Offline
                  </h3>
                  <p className="text-[10px] text-orange-800 mb-3">
                    The AI virtual try-on service is currently unavailable. Please ensure the backend is running on port 8080.
                  </p>
                  <button
                    onClick={checkVitonBackend}
                    className="w-full py-2 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-all shadow-md"
                  >
                    Retry Connection
                  </button>
                </div>
              </motion.section>
            )}

            {/* Person Image Upload */}
            {vitonBackendStatus === 'online' && (
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-3 rounded-xl shadow-lg border-2 border-green-300"
              >
                <h2 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-1">
                  <User size={14} /> Upload Person Photo
                </h2>
                {personImage ? (
                  <div className="space-y-2">
                    <div className="h-32 rounded-lg overflow-hidden bg-gray-50 border border-green-300 shadow-inner">
                      <img src={personImage} alt="Person" className="w-full h-full object-contain p-1"/>
                    </div>
                    <button
                      onClick={() => setPersonImage(null)}
                      className="w-full py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1 border border-red-200"
                    >
                      <Trash2 size={12} /> Remove Photo
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePersonImageUpload}
                      className="hidden"
                      id="person-upload"
                    />
                    <label
                      htmlFor="person-upload"
                      className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-green-400 rounded-lg cursor-pointer hover:bg-green-50 transition-all group bg-gradient-to-br from-green-50/50 to-emerald-50/50"
                    >
                      <Upload className="text-green-600 mb-1 group-hover:scale-110 transition-transform" size={24} />
                      <span className="text-xs font-bold text-green-900">Upload Your Photo</span>
                      <span className="text-[10px] text-gray-600">Full body photo works best</span>
                      <span className="text-[9px] text-gray-500 mt-1">Max 10MB • JPEG/PNG/WEBP</span>
                    </label>
                  </div>
                )}
              </motion.section>
            )}

            {/* Avatar Sex Selector */}
            {vitonBackendStatus === 'online' && personImage && (
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-3 rounded-xl shadow-lg border-2 border-blue-300"
              >
                <h2 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-1">
                  <User size={14} /> Avatar Gender
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAvatarSex('male')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      avatarSex === 'male'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-blue-900 hover:bg-blue-100 border border-blue-300'
                    }`}
                  >
                    👔 Male
                  </button>
                  <button
                    onClick={() => setAvatarSex('female')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      avatarSex === 'female'
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-white text-pink-900 hover:bg-pink-100 border border-pink-300'
                    }`}
                  >
                    👗 Female
                  </button>
                </div>
              </motion.section>
            )}

            {/* Upload Top Wear */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-3 rounded-xl shadow-lg border border-purple-200"
            >
              <h2 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-1">
                <Shirt size={14} /> Top Wear
              </h2>
              {isLoadingTop ? (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="mt-2 text-xs text-purple-800 font-medium">Loading...</p>
                </div>
              ) : topGarment ? (
                <div className="space-y-2">
                  <div className="h-32 rounded-lg overflow-hidden bg-gray-50 border border-purple-300 shadow-inner">
                    <img src={topGarment.url} alt="Top" className="w-full h-full object-contain p-1"/>
                  </div>
                  <button
                    onClick={() => clearGarment('top')}
                    className="w-full py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1 border border-red-200"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleGarmentUpload(e, 'top')}
                    className="hidden"
                    id="top-upload"
                  />
                  <label
                    htmlFor="top-upload"
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-all group bg-gradient-to-br from-purple-50/50 to-pink-50/50"
                  >
                    <Upload className="text-purple-500 mb-1 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-xs font-bold text-purple-900">Upload Shirt</span>
                    <span className="text-[10px] text-gray-600">Kurta, T-Shirt, Jacket</span>
                    <span className="text-[9px] text-gray-500 mt-1">Max 10MB • JPEG/PNG/WEBP</span>
                  </label>
                </div>
              )}
            </motion.section>

            {/* Upload Bottom Wear */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-3 rounded-xl shadow-lg border border-pink-200"
            >
              <h2 className="text-sm font-bold text-pink-900 mb-2 flex items-center gap-1">
                <ShoppingBag size={14} /> Bottom Wear
              </h2>
              {isLoadingBottom ? (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-pink-300 rounded-lg bg-pink-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                  <p className="mt-2 text-xs text-pink-800 font-medium">Loading...</p>
                </div>
              ) : bottomGarment ? (
                <div className="space-y-2">
                  <div className="h-32 rounded-lg overflow-hidden bg-gray-50 border border-pink-300 shadow-inner">
                    <img src={bottomGarment.url} alt="Bottom" className="w-full h-full object-contain p-1"/>
                  </div>
                  <button
                    onClick={() => clearGarment('bottom')}
                    className="w-full py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1 border border-red-200"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleGarmentUpload(e, 'bottom')}
                    className="hidden"
                    id="bottom-upload"
                  />
                  <label
                    htmlFor="bottom-upload"
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer hover:bg-pink-50 transition-all group bg-gradient-to-br from-pink-50/50 to-rose-50/50"
                  >
                    <Upload className="text-pink-500 mb-1 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-xs font-bold text-pink-900">Upload Pants</span>
                    <span className="text-[10px] text-gray-600">Jeans, Skirt, Trousers</span>
                    <span className="text-[9px] text-gray-500 mt-1">Max 10MB • JPEG/PNG/WEBP</span>
                  </label>
                </div>
              )}
            </motion.section>

            {/* AI Prompts Section */}
            {personImage && (topGarment || bottomGarment) && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border-2 border-blue-400 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1">
                    <Settings size={14} /> AI Settings
                  </h3>
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="text-[9px] text-blue-700 underline"
                  >
                    {showAdvancedOptions ? 'Hide' : 'Advanced'}
                  </button>
                </div>

                {/* Clothing Prompt */}
                <div className="mb-2">
                  <label className="text-[10px] font-bold text-blue-900 mb-1 block">
                    Clothing Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={clothingPrompt}
                    onChange={(e) => setClothingPrompt(e.target.value)}
                    placeholder="e.g., elegant red dress, casual denim jacket"
                    className="w-full px-2 py-1.5 text-xs border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {showAdvancedOptions && (
                  <>
                    {/* Avatar Prompt */}
                    <div className="mb-2">
                      <label className="text-[10px] font-bold text-blue-900 mb-1 block">
                        Avatar Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={avatarPrompt}
                        onChange={(e) => setAvatarPrompt(e.target.value)}
                        placeholder={`e.g., a ${avatarSex} model in professional pose`}
                        className="w-full px-2 py-1.5 text-xs border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Background Prompt */}
                    <div>
                      <label className="text-[10px] font-bold text-blue-900 mb-1 block">
                        Background (Optional)
                      </label>
                      <input
                        type="text"
                        value={backgroundPrompt}
                        onChange={(e) => setBackgroundPrompt(e.target.value)}
                        placeholder="e.g., studio lighting, outdoor setting"
                        className="w-full px-2 py-1.5 text-xs border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </motion.section>
            )}

            {/* AI Processing Button */}
            {personImage && (topGarment || bottomGarment) && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-xl border-2 border-purple-400 shadow-lg"
              >
                <button
                  onClick={processWithAPI4AI}
                  disabled={isProcessingAI}
                  className={`w-full py-3 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isProcessingAI
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  {isProcessingAI ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate AI Try-On
                    </>
                  )}
                </button>
                <p className="mt-2 text-[9px] text-center text-indigo-700">
                  🤖 Powered by API4.AI Virtual Try-On (Production-Ready API)
                </p>
              </motion.section>
            )}

            {/* Action Buttons */}
            {(topGarment || bottomGarment) && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 rounded-xl border border-green-300 shadow-lg"
              >
                <button
                  onClick={clearAll}
                  className="w-full py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-1"
                >
                  <RefreshCw size={14} /> Clear All Garments
                </button>
              </motion.section>
            )}
          </div>

          {/* Center/Right - Fashion Model Preview */}
          <div className="xl:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-indigo-300 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-indigo-900">
                    {aiResult ? '🤖 AI Try-On Result' : 'AI Virtual Try-On Preview'}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {aiResult 
                      ? 'AI-powered photorealistic result' 
                      : 'Upload your photo and garments to start'}
                  </p>
                </div>
                {(topGarment || bottomGarment || aiResult) && (
                  <button
                    onClick={downloadImage}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center gap-1"
                  >
                    <Download size={14} /> Save
                  </button>
                )}
              </div>

              {/* Fashion Model Display */}
              <div 
                ref={previewRef}
                className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-white rounded-xl overflow-hidden shadow-inner"
                style={{ aspectRatio: '1/2', maxWidth: '350px', margin: '0 auto' }}
              >
                {aiResult ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={aiResult} 
                      alt="AI Try-On Result" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-md px-2 py-1 rounded-full z-20">
                      <span className="text-white text-[10px] font-bold">🤖 AI Generated</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="bg-white/95 backdrop-blur-sm px-6 py-8 rounded-xl shadow-xl border-2 border-indigo-300 max-w-[280px] text-center">
                      <div className="text-6xl mb-4">🤖</div>
                      <h3 className="text-lg font-bold text-indigo-900 mb-2">
                        AI Virtual Try-On
                      </h3>
                      <p className="text-xs text-gray-700 mb-4">
                        {!personImage
                          ? 'Upload your photo to get started'
                          : !topGarment && !bottomGarment
                          ? 'Upload at least one garment'
                          : 'Click "Generate AI Try-On" to see results'}
                      </p>
                      <div className="flex flex-col gap-2 text-[10px] text-left text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            personImage ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {personImage ? '✓' : '1'}
                          </div>
                          <span>Upload your photo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            personImage ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {personImage ? '✓' : '2'}
                          </div>
                          <span>Select your gender</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            topGarment || bottomGarment ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {topGarment || bottomGarment ? '✓' : '3'}
                          </div>
                          <span>Upload garment(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center bg-gray-300 text-gray-600">
                            4
                          </div>
                          <span>Generate AI try-on</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Tips Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-xl p-3"
              >
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-1 text-xs">
                  <Palette size={14} />
                  💡 Image Requirements & Tips
                </h3>
                <ul className="space-y-1 text-[10px] text-blue-800">
                  <li>📸 <strong>Format:</strong> JPEG or PNG (max 16MB)</li>
                  <li>📐 <strong>Size:</strong> Minimum 256x256px, recommended 768x1024px+</li>
                  <li>👤 <strong>Person Photo:</strong> Full body, single person, front-facing</li>
                  <li>👕 <strong>Garment Photo:</strong> Clear product image on plain background</li>
                  <li>💡 <strong>Lighting:</strong> Good lighting and high image quality</li>
                  <li>✨ <strong>Processing:</strong> Takes 5-15 seconds per result</li>
                  <li>🎯 <strong>Accuracy:</strong> Your EXACT garment will be preserved in the result!</li>
                  <li>🎨 <strong>Prompts:</strong> Use prompts to customize background, lighting, style</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTrialRoomPage;
