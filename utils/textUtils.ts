// Fix character encoding issues from database
export function fixEncodingIssues(text: string): string {
  if (!text) return text;
  
  // Common encoding issues where Windows-1252 characters are misinterpreted as UTF-8
  const replacements: Record<string, string> = {
    'ΓÇó': '•',  // Bullet point
    'ΓÇô': '–',  // En dash
    'ΓÇö': '—',  // Em dash
    'ΓÇÿ': '"',  // Left double quote
    'ΓÇ¥': '"',  // Right double quote
    'ΓÇÖ': ''',  // Left single quote
    'ΓÇÖ': ''',  // Right single quote
    'Γåæ': '…',  // Ellipsis
    'Γåî': '™',  // Trademark
    'Γåô': '®',  // Registered trademark
    'Γåê': '©',  // Copyright
  };

  let fixed = text;
  for (const [wrong, correct] of Object.entries(replacements)) {
    fixed = fixed.replace(new RegExp(wrong, 'g'), correct);
  }
  
  return fixed;
}
