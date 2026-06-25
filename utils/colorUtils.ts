// Comprehensive color name to hex code mapping
export const COLOR_MAP: Record<string, string> = {
  // Basic colors
  'red': '#FF0000',
  'blue': '#0000FF',
  'green': '#008000',
  'yellow': '#FFFF00',
  'orange': '#FFA500',
  'purple': '#800080',
  'pink': '#FFC0CB',
  'brown': '#A52A2A',
  'black': '#000000',
  'white': '#FFFFFF',
  'gray': '#808080',
  'grey': '#808080',
  
  // Shades of red
  'crimson': '#DC143C',
  'maroon': '#800000',
  'burgundy': '#800020',
  'scarlet': '#FF2400',
  'coral': '#FF7F50',
  'salmon': '#FA8072',
  
  // Shades of blue
  'navy': '#000080',
  'navy blue': '#000080',
  'royal blue': '#4169E1',
  'sky blue': '#87CEEB',
  'turquoise': '#40E0D0',
  'cyan': '#00FFFF',
  'teal': '#008080',
  'aqua': '#00FFFF',
  'indigo': '#4B0082',
  
  // Shades of green
  'lime': '#00FF00',
  'olive': '#808000',
  'olive green': '#556B2F',
  'emerald': '#50C878',
  'forest green': '#228B22',
  'mint': '#98FF98',
  'sage': '#BCB88A',
  
  // Shades of yellow/gold
  'gold': '#FFD700',
  'golden': '#FFD700',
  'mustard': '#FFDB58',
  'lemon': '#FFF700',
  'cream': '#FFFDD0',
  'beige': '#F5F5DC',
  'khaki': '#F0E68C',
  'tan': '#D2B48C',
  
  // Shades of orange
  'peach': '#FFDAB9',
  'apricot': '#FBCEB1',
  'rust': '#B7410E',
  'terracotta': '#E2725B',
  
  // Shades of purple/pink
  'lavender': '#E6E6FA',
  'violet': '#EE82EE',
  'magenta': '#FF00FF',
  'fuchsia': '#FF00FF',
  'rose': '#FF007F',
  'hot pink': '#FF69B4',
  'mauve': '#E0B0FF',
  'plum': '#DDA0DD',
  
  // Neutrals
  'charcoal': '#36454F',
  'silver': '#C0C0C0',
  'ivory': '#FFFFF0',
  'off-white': '#FAF9F6',
  'pearl': '#F0EAD6',
  
  // Earth tones
  'sienna': '#A0522D',
  'umber': '#635147',
  'ochre': '#CC7722',
  'sand': '#C2B280',
  
  // Pastels
  'pastel pink': '#FFD1DC',
  'pastel blue': '#AEC6CF',
  'pastel green': '#77DD77',
  'pastel yellow': '#FDFD96',
  'pastel purple': '#B39EB5',
  
  // Jewel tones
  'ruby': '#E0115F',
  'sapphire': '#0F52BA',
  'amethyst': '#9966CC',
  'topaz': '#FFC87C',
  'jade': '#00A86B'
};

// Function to get hex color from color name
export function getColorHex(colorName: string): string {
  const normalizedName = colorName.toLowerCase().trim();
  
  // Direct match
  if (COLOR_MAP[normalizedName]) {
    return COLOR_MAP[normalizedName];
  }
  
  // Try to find partial match (e.g., "light blue" contains "blue")
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  // Fallback to color families if no match
  if (normalizedName.includes('red') || normalizedName.includes('rose')) return '#FF6B6B';
  if (normalizedName.includes('blue')) return '#4A90E2';
  if (normalizedName.includes('green')) return '#5CB85C';
  if (normalizedName.includes('yellow') || normalizedName.includes('gold')) return '#FFD700';
  if (normalizedName.includes('orange')) return '#FF8C42';
  if (normalizedName.includes('purple') || normalizedName.includes('violet')) return '#9B59B6';
  if (normalizedName.includes('pink')) return '#FF69B4';
  if (normalizedName.includes('brown')) return '#8B4513';
  if (normalizedName.includes('gray') || normalizedName.includes('grey')) return '#808080';
  if (normalizedName.includes('black')) return '#000000';
  if (normalizedName.includes('white') || normalizedName.includes('cream')) return '#FFFDD0';
  
  // Ultimate fallback - return a neutral color
  return '#9CA3AF';
}

// Function to check if color is light or dark (for text contrast)
export function isLightColor(hex: string): boolean {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
}
