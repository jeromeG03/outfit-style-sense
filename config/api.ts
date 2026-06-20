// API Configuration - Automatically uses Railway backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  
  // User endpoints
  USERS: {
    LOGIN: `${API_BASE_URL}/api/users/login`,
    REGISTER: `${API_BASE_URL}/api/users/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/users/forgot-password`,
    VERIFY_RESET_CODE: `${API_BASE_URL}/api/users/verify-reset-code`,
    RESET_PASSWORD: `${API_BASE_URL}/api/users/reset-password`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/users/${id}`,
    GET: (id: number) => `${API_BASE_URL}/api/users/${id}`,
  },
  
  // Wardrobe endpoints
  WARDROBE: {
    BASE: `${API_BASE_URL}/api/wardrobe`,
    BY_USER: (userId: number) => `${API_BASE_URL}/api/wardrobe/user/${userId}`,
    BY_USER_AND_GENDER: (userId: number, gender: string) => 
      `${API_BASE_URL}/api/wardrobe/user/${userId}/gender/${gender}`,
    SUGGESTIONS: (itemId: number, userId: number) => 
      `${API_BASE_URL}/api/wardrobe/suggestions/${itemId}/user/${userId}`,
    OUTFITS: (userId: number) => `${API_BASE_URL}/api/wardrobe/outfits/user/${userId}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/wardrobe/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/wardrobe/${id}`,
  },
  
  // Trends endpoints
  TRENDS: {
    CURRENT: `${API_BASE_URL}/api/trends/current`,
    CATEGORIES: `${API_BASE_URL}/api/trends/categories`,
    REGIONS: `${API_BASE_URL}/api/trends/regions`,
    HISTORICAL: (days: number = 7) => `${API_BASE_URL}/api/trends/historical?days=${days}`,
    COLORS: `${API_BASE_URL}/api/trends/colors`,
  },
  
  // Occasions endpoints
  OCCASIONS: {
    ALL: `${API_BASE_URL}/api/occasions`,
    BY_GENDER: (gender: string) => `${API_BASE_URL}/api/occasions/gender/${gender}`,
  },
  
  // Skin Tone endpoints
  SKIN_TONE: {
    ALL: `${API_BASE_URL}/api/skintone/rules`,
    RECOMMENDATIONS: (skinTone: string) => `${API_BASE_URL}/api/skintone/recommendations/${skinTone}`,
  },
  
  // Color Psychology endpoints
  COLOR_PSYCHOLOGY: {
    ALL: `${API_BASE_URL}/api/psychology/colors`,
    BY_COLOR: (color: string) => `${API_BASE_URL}/api/psychology/color/${color}`,
  },
  
  // Virtual Try-On endpoints
  VIRTUAL_TRYON: {
    HEALTH: `${API_BASE_URL}/api/virtual-tryon/health`,
    BATCH_PROCESS: `${API_BASE_URL}/api/virtual-tryon/batch-process`,
  },
};

// Utility function for making API calls with error handling
export const apiCall = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_BASE_URL;
