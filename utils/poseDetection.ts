import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

export interface BodyKeypoints {
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  leftHip: { x: number; y: number };
  rightHip: { x: number; y: number };
  nose: { x: number; y: number };
  leftKnee: { x: number; y: number };
  rightKnee: { x: number; y: number };
  leftAnkle: { x: number; y: number };
  rightAnkle: { x: number; y: number };
}

export interface GarmentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
}

export interface PoseDetectionResult {
  bodyKeypoints: BodyKeypoints | null;
  topWearPosition: GarmentPosition;
  bottomWearPosition: GarmentPosition;
  confidence: number;
}

let detector: poseDetection.PoseDetector | null = null;

/**
 * Initialize the pose detection model
 */
export const initializePoseDetector = async (): Promise<void> => {
  if (detector) return;

  try {
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    detector = await poseDetection.createDetector(model, detectorConfig);
    console.log('✓ Pose detector initialized successfully');
  } catch (error) {
    console.error('Error initializing pose detector:', error);
    throw error;
  }
};

/**
 * Detect pose from an image element
 */
export const detectPoseFromImage = async (
  imageElement: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
): Promise<PoseDetectionResult> => {
  if (!detector) {
    await initializePoseDetector();
  }

  try {
    const poses = await detector!.estimatePoses(imageElement);
    
    if (poses.length === 0) {
      return getDefaultPositions(canvasWidth, canvasHeight);
    }

    const pose = poses[0];
    const keypoints = pose.keypoints;
    
    // Extract key body points
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    const nose = keypoints.find(kp => kp.name === 'nose');
    const leftKnee = keypoints.find(kp => kp.name === 'left_knee');
    const rightKnee = keypoints.find(kp => kp.name === 'right_knee');
    const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
    const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');

    // Calculate confidence (average of key points)
    const confidenceScores = [
      leftShoulder?.score || 0,
      rightShoulder?.score || 0,
      leftHip?.score || 0,
      rightHip?.score || 0,
    ];
    const avgConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;

    // If confidence is too low, return default positions
    if (avgConfidence < 0.3) {
      console.warn('Low confidence pose detection, using defaults');
      return getDefaultPositions(canvasWidth, canvasHeight);
    }

    const bodyKeypoints: BodyKeypoints = {
      leftShoulder: { x: leftShoulder?.x || 0, y: leftShoulder?.y || 0 },
      rightShoulder: { x: rightShoulder?.x || 0, y: rightShoulder?.y || 0 },
      leftHip: { x: leftHip?.x || 0, y: leftHip?.y || 0 },
      rightHip: { x: rightHip?.x || 0, y: rightHip?.y || 0 },
      nose: { x: nose?.x || 0, y: nose?.y || 0 },
      leftKnee: { x: leftKnee?.x || 0, y: leftKnee?.y || 0 },
      rightKnee: { x: rightKnee?.x || 0, y: rightKnee?.y || 0 },
      leftAnkle: { x: leftAnkle?.x || 0, y: leftAnkle?.y || 0 },
      rightAnkle: { x: rightAnkle?.x || 0, y: rightAnkle?.y || 0 },
    };

    // Calculate positions for top and bottom wear
    const topWearPosition = calculateTopWearPosition(bodyKeypoints, canvasWidth, canvasHeight);
    const bottomWearPosition = calculateBottomWearPosition(bodyKeypoints, canvasWidth, canvasHeight);

    return {
      bodyKeypoints,
      topWearPosition,
      bottomWearPosition,
      confidence: avgConfidence,
    };
  } catch (error) {
    console.error('Error detecting pose:', error);
    return getDefaultPositions(canvasWidth, canvasHeight);
  }
};

/**
 * Calculate position for top wear (shirt, kurta, etc.)
 */
const calculateTopWearPosition = (
  keypoints: BodyKeypoints,
  canvasWidth: number,
  canvasHeight: number
): GarmentPosition => {
  const { leftShoulder, rightShoulder, leftHip, rightHip, nose } = keypoints;

  // Calculate shoulder width
  const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
  const shoulderCenter = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };

  // Calculate torso length (shoulder to hip)
  const torsoLength = Math.abs(
    ((leftHip.y + rightHip.y) / 2) - shoulderCenter.y
  );

  // Scale image to canvas dimensions (pose detection works on original image)
  const scaleX = canvasWidth / (keypoints.rightShoulder.x > 0 ? canvasWidth : 1);
  const scaleY = canvasHeight / (keypoints.rightShoulder.y > 0 ? canvasHeight : 1);

  // Position top wear
  // Center it on shoulders, extend slightly beyond shoulders
  const garmentWidth = shoulderWidth * 1.4; // 40% wider than shoulders
  const garmentHeight = torsoLength * 1.3; // 30% longer than torso

  // Position at neck/shoulder area
  const garmentX = shoulderCenter.x - garmentWidth / 2;
  const garmentY = nose.y + (shoulderCenter.y - nose.y) * 0.5; // Between nose and shoulders

  return {
    x: garmentX,
    y: garmentY,
    width: garmentWidth,
    height: garmentHeight,
    rotation: 0,
    scale: 1,
  };
};

/**
 * Calculate position for bottom wear (pants, saree, etc.)
 */
const calculateBottomWearPosition = (
  keypoints: BodyKeypoints,
  canvasWidth: number,
  canvasHeight: number
): GarmentPosition => {
  const { leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle } = keypoints;

  // Calculate hip width
  const hipWidth = Math.abs(rightHip.x - leftHip.x);
  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
  };

  // Calculate leg length (hip to ankle)
  const leftLegLength = Math.abs(leftAnkle.y - leftHip.y);
  const rightLegLength = Math.abs(rightAnkle.y - rightHip.y);
  const legLength = Math.max(leftLegLength, rightLegLength);

  // Position bottom wear
  const garmentWidth = hipWidth * 1.5; // 50% wider than hips
  const garmentHeight = legLength * 1.1; // 10% longer than legs

  const garmentX = hipCenter.x - garmentWidth / 2;
  const garmentY = hipCenter.y - garmentHeight * 0.05; // Start slightly above hips

  return {
    x: garmentX,
    y: garmentY,
    width: garmentWidth,
    height: garmentHeight,
    rotation: 0,
    scale: 1,
  };
};

/**
 * Get default positions when pose detection fails
 */
const getDefaultPositions = (
  canvasWidth: number,
  canvasHeight: number
): PoseDetectionResult => {
  return {
    bodyKeypoints: null,
    topWearPosition: {
      x: canvasWidth * 0.25,
      y: canvasHeight * 0.2,
      width: canvasWidth * 0.5,
      height: canvasHeight * 0.35,
      rotation: 0,
      scale: 1,
    },
    bottomWearPosition: {
      x: canvasWidth * 0.3,
      y: canvasHeight * 0.5,
      width: canvasWidth * 0.4,
      height: canvasHeight * 0.45,
      rotation: 0,
      scale: 1,
    },
    confidence: 0,
  };
};

/**
 * Calculate angle between two points (for rotation)
 */
export const calculateAngle = (
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

/**
 * Apply perspective transform to make garment look more realistic
 * This calculates scaling factors based on body angle
 */
export const calculatePerspectiveScale = (
  bodyKeypoints: BodyKeypoints
): { scaleX: number; scaleY: number } => {
  const { leftShoulder, rightShoulder, leftHip, rightHip } = bodyKeypoints;

  // Calculate body tilt
  const shoulderAngle = calculateAngle(leftShoulder, rightShoulder);
  const hipAngle = calculateAngle(leftHip, rightHip);

  // If body is tilted, adjust scale
  const avgAngle = (shoulderAngle + hipAngle) / 2;
  const absAngle = Math.abs(avgAngle);

  // More tilt = more perspective scaling
  const perspectiveFactor = 1 - (absAngle / 180) * 0.3;

  return {
    scaleX: perspectiveFactor,
    scaleY: 1, // Keep Y scale constant
  };
};

/**
 * Check if image has transparent background
 */
export const hasTransparentBackground = (imageElement: HTMLImageElement): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve(false);
      return;
    }

    ctx.drawImage(imageElement, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Check first and last rows for transparency
    let hasTransparency = false;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 255) {
        hasTransparency = true;
        break;
      }
    }

    resolve(hasTransparency);
  });
};
