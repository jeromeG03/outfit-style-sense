
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Group } from 'react-konva';
import { Upload, Trash2, User, Shirt, Download, RefreshCw, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Garment {
  id: string;
  url: string;
  type: 'top' | 'bottom';
  imageObj?: HTMLImageElement;
}

interface MannequinTemplate {
  id: string;
  name: string;
  svgPath: string;
  topZone: { x: number; y: number; width: number; height: number };
  bottomZone: { x: number; y: number; width: number; height: number };
}

const mannequinTemplates: MannequinTemplate[] = [
  {
    id: 'male',
    name: 'Male Model',
    svgPath: 'M250 50 C 220 50, 200 70, 200 100 L 200 180 L 180 180 L 180 320 L 200 320 L 200 480 L 220 480 L 220 550 L 230 550 L 230 480 L 250 480 L 250 550 L 260 550 L 260 480 L 280 480 L 280 320 L 300 320 L 300 180 L 280 180 L 280 100 C 280 70, 260 50, 250 50 Z',
    topZone: { x: 190, y: 100, width: 120, height: 140 },
    bottomZone: { x: 195, y: 240, width: 110, height: 240 }
  },
  {
    id: 'female',
    name: 'Female Model',
    svgPath: 'M250 50 C 220 50, 200 70, 200 100 L 195 180 L 175 180 L 175 320 L 195 320 L 200 480 L 220 480 L 225 550 L 235 550 L 240 480 L 260 480 L 265 550 L 275 550 L 280 480 L 305 480 L 305 320 L 325 320 L 325 180 L 305 180 L 300 100 C 300 70, 280 50, 250 50 Z',
    topZone: { x: 185, y: 100, width: 130, height: 140 },
    bottomZone: { x: 190, y: 240, width: 120, height: 240 }
  }
];

const URLImage: React.FC<{
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity?: number;
  globalCompositeOperation?: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
}> = ({ src, x, y, width, height, rotation, opacity = 1, globalCompositeOperation, isSelected, onSelect, onChange }) => {
  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaImage
        image={image || undefined}
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        opacity={opacity}
        globalCompositeOperation={globalCompositeOperation as any}
        draggable
        ref={imageRef}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const VirtualTrialRoomPage: React.FC = () => {
  const [mannequin, setMannequin] = useState<string | null>(null);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mannequinImage, setMannequinImage] = useState<HTMLImageElement | null>(null);
  const [isDetectingPose, setIsDetectingPose] = useState(false);
  const [poseDetected, setPoseDetected] = useState<PoseDetectionResult | null>(null);
  const [autoFitEnabled, setAutoFitEnabled] = useState(true);
  const [blendMode, setBlendMode] = useState<'normal' | 'multiply' | 'overlay'>('multiply');
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Initialize pose detector on mount
    initializePoseDetector().catch(console.error);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setStageSize({ width: clientWidth, height: clientHeight });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (mannequin) {
      const img = new window.Image();
      img.src = mannequin;
      img.onload = () => {
        setMannequinImage(img);
        // Automatically detect pose when image loads
        if (autoFitEnabled) {
          detectPoseAndPosition(img);
        }
      };
    }
  }, [mannequin]);

  const detectPoseAndPosition = async (img: HTMLImageElement) => {
    setIsDetectingPose(true);
    try {
      const result = await detectPoseFromImage(img, stageSize.width, stageSize.height);
      setPoseDetected(result);
      
      if (result.confidence > 0.3) {
        console.log(`✓ Pose detected with ${(result.confidence * 100).toFixed(1)}% confidence`);
      } else {
        console.warn('⚠ Low confidence pose detection, using default positions');
      }
    } catch (error) {
      console.error('Failed to detect pose:', error);
    } finally {
      setIsDetectingPose(false);
    }
  };

  const autoPositionGarments = () => {
    if (!poseDetected) return;

    const updatedGarments = garments.map((garment) => {
      if (garment.type === 'top') {
        return {
          ...garment,
          ...poseDetected.topWearPosition,
          opacity: 0.95,
          globalCompositeOperation: blendMode,
        };
      } else if (garment.type === 'bottom') {
        return {
          ...garment,
          ...poseDetected.bottomWearPosition,
          opacity: 0.95,
          globalCompositeOperation: blendMode,
        };
      }
      return garment;
    });

    setGarments(updatedGarments);
  };

  const handleMannequinUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setMannequin(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'top' | 'bottom' | 'other') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        let position = { x: 50, y: 50, width: 200, height: 200 };
        
        // Auto-position based on detected pose
        if (autoFitEnabled && poseDetected) {
          if (type === 'top') {
            position = {
              x: poseDetected.topWearPosition.x,
              y: poseDetected.topWearPosition.y,
              width: poseDetected.topWearPosition.width,
              height: poseDetected.topWearPosition.height,
            };
          } else if (type === 'bottom') {
            position = {
              x: poseDetected.bottomWearPosition.x,
              y: poseDetected.bottomWearPosition.y,
              width: poseDetected.bottomWearPosition.width,
              height: poseDetected.bottomWearPosition.height,
            };
          }
        }

        const newGarment: Garment = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          ...position,
          rotation: 0,
          type,
          opacity: 0.95,
          globalCompositeOperation: blendMode,
        };
        setGarments([...garments, newGarment]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGarment = (id: string) => {
    setGarments(garments.filter(g => g.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-8 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-4">Virtual Trial Room</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your photo to create a virtual mannequin and try on different garments to see how they look on you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Controls */}
            {mannequin && (
              <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-purple-200"
              >
                <h2 className="text-lg font-serif font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-600" /> AI Fitting
                </h2>
                
                {isDetectingPose ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600"></div>
                    <span className="ml-3 text-sm text-purple-700">Detecting pose...</span>
                  </div>
                ) : poseDetected ? (
                  <div className="space-y-4">
                    <div className="bg-white/60 backdrop-blur p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Confidence</span>
                        <span className="text-sm font-bold text-purple-900">
                          {(poseDetected.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                          style={{ width: `${poseDetected.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={autoPositionGarments}
                      disabled={garments.length === 0}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Zap size={18} />
                      Auto-Fit Garments
                    </button>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Auto-position new items</span>
                        <input
                          type="checkbox"
                          checked={autoFitEnabled}
                          onChange={(e) => setAutoFitEnabled(e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                      </label>

                      <div className="pt-2 border-t border-purple-200">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Blend Mode</label>
                        <select
                          value={blendMode}
                          onChange={(e) => setBlendMode(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="normal">Normal</option>
                          <option value="multiply">Multiply (Realistic)</option>
                          <option value="overlay">Overlay</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-purple-700">
                    <Eye size={32} className="mx-auto mb-2 opacity-50" />
                    Pose detection will start automatically
                  </div>
                )}
              </motion.section>
            )}

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
              <h2 className="text-lg font-serif font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <User size={20} /> 1. Your Photo
              </h2>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMannequinUpload}
                  className="hidden"
                  id="mannequin-upload"
                />
                <label
                  htmlFor="mannequin-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-amber-200 rounded-xl cursor-pointer hover:bg-amber-50 transition-colors group-hover:border-amber-400"
                >
                  {mannequin ? (
                    <img src={mannequin} alt="Mannequin" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-amber-400 mb-2" />
                      <span className="text-sm text-amber-800">Upload Full Body Photo</span>
                    </div>
                  )}
                </label>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
              <h2 className="text-lg font-serif font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <Shirt size={20} /> 2. Add Garments
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Top Wear</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleGarmentUpload(e, 'top')}
                    className="hidden"
                    id="top-upload"
                  />
                  <label
                    htmlFor="top-upload"
                    className="flex items-center justify-center w-full py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <Upload size={16} className="mr-2" /> Upload Shirt/Kurta
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Bottom Wear</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleGarmentUpload(e, 'bottom')}
                    className="hidden"
                    id="bottom-upload"
                  />
                  <label
                    htmlFor="bottom-upload"
                    className="flex items-center justify-center w-full py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <Upload size={16} className="mr-2" /> Upload Pants/Saree
                  </label>
                </div>
              </div>
            </section>

            {garments.length > 0 && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
                <h2 className="text-lg font-serif font-semibold text-amber-800 mb-4 flex items-center gap-2">
                  <Layers size={20} /> Layers
                </h2>
                <div className="space-y-2">
                  {garments.map((g) => (
                    <div
                      key={g.id}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                        selectedId === g.id ? 'border-amber-500 bg-amber-50' : 'border-gray-100'
                      }`}
                      onClick={() => setSelectedId(g.id)}
                    >
                      <div className="flex items-center gap-3">
                        <img src={g.url} alt="Garment" className="w-10 h-10 object-cover rounded" />
                        <span className="text-xs font-medium capitalize text-gray-700">{g.type}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGarment(g.id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div 
              ref={containerRef}
              className="relative w-full aspect-[3/4] bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden"
            >
              {!mannequin && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 z-10">
                  <User size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm">Upload your photo to start the trial</p>
                </div>
              )}
              
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                ref={stageRef}
                onMouseDown={(e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  if (clickedOnEmpty) setSelectedId(null);
                }}
              >
                <Layer>
                  {mannequinImage && (
                    <KonvaImage
                      image={mannequinImage}
                      width={stageSize.width}
                      height={stageSize.height}
                      listening={false}
                    />
                  )}
                  {garments.map((g, i) => (
                    <URLImage
                      key={g.id}
                      {...g}
                      src={g.url}
                      opacity={g.opacity}
                      globalCompositeOperation={g.globalCompositeOperation}
                      isSelected={g.id === selectedId}
                      onSelect={() => setSelectedId(g.id)}
                      onChange={(newAttrs) => {
                        const newGarments = garments.slice();
                        newGarments[i] = { ...g, ...newAttrs };
                        setGarments(newGarments);
                      }}
                    />
                  ))}
                </Layer>
              </Stage>

              {/* Toolbar Overlay */}
              {selectedId && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-amber-100 flex items-center gap-6 z-20">
                  <div className="flex flex-col items-center gap-1">
                    <Move size={16} className="text-amber-800" />
                    <span className="text-[10px] uppercase font-bold text-gray-500">Drag</span>
                  </div>
                  <div className="w-px h-8 bg-amber-100" />
                  <div className="flex flex-col items-center gap-1">
                    <Maximize2 size={16} className="text-amber-800" />
                    <span className="text-[10px] uppercase font-bold text-gray-500">Scale</span>
                  </div>
                  <div className="w-px h-8 bg-amber-100" />
                  <div className="flex flex-col items-center gap-1">
                    <RotateCw size={16} className="text-amber-800" />
                    <span className="text-[10px] uppercase font-bold text-gray-500">Rotate</span>
                  </div>
                  <div className="w-px h-8 bg-amber-100" />
                  <button 
                    onClick={() => removeGarment(selectedId)}
                    className="flex flex-col items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="text-[10px] uppercase font-bold">Remove</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 italic">
                <Maximize2 size={14} />
                Tip: Use the handles to resize and rotate garments for a perfect fit.
              </div>
              <button 
                onClick={() => {
                  const uri = stageRef.current.toDataURL();
                  const link = document.createElement('a');
                  link.download = 'my-outfit-preview.png';
                  link.href = uri;
                  link.click();
                }}
                className="bg-amber-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-900 transition-all"
              >
                Save Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTrialRoomPage;
