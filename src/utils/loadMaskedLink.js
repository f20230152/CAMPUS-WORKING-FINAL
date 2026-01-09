// Utility to load masked link for a POI ID
// Fetches from public/data/masked-links.json

let maskedLinksCache = null;

export async function getMaskedLink(poiId) {
  try {
    // Load masked links mapping once and cache it
    if (!maskedLinksCache) {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const jsonUrl = `${baseUrl}data/masked-links.json`;
      
      try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
          console.warn('Masked links file not found, falling back to direct URL');
          return null;
        }
        maskedLinksCache = await response.json();
      } catch (error) {
        console.warn('Error loading masked links:', error);
        return null;
      }
    }
    
    // Return masked link for POI ID, or null if not found
    return maskedLinksCache[poiId] || null;
  } catch (error) {
    console.error('Error getting masked link:', error);
    return null;
  }
}

// Get share URL - returns masked link if available, otherwise falls back to current URL
export async function getShareUrl(poiId) {
  const maskedLink = await getMaskedLink(poiId);
  
  if (maskedLink) {
    return maskedLink;
  }
  
  // Fallback to current URL if masked link not available
  return window.location.href;
}

