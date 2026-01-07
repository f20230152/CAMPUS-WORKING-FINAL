// Utility to lookup POI ID from short code
// Supports both external short URLs (is.gd) and internal short codes

let shortLinksCache = null;
let reverseMapCache = null;

// Load short links mapping
async function loadShortLinks() {
  if (shortLinksCache) {
    return shortLinksCache;
  }

  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const jsonUrl = `${baseUrl}data/short-links.json`;
    const response = await fetch(jsonUrl);
    
    if (response.ok) {
      shortLinksCache = await response.json();
      return shortLinksCache;
    }
  } catch (error) {
    console.warn('Failed to load short links mapping:', error);
  }

  return {};
}

// Load reverse mapping (short code -> POI ID)
async function loadReverseMap() {
  if (reverseMapCache) {
    return reverseMapCache;
  }

  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const jsonUrl = `${baseUrl}data/short-links-reverse.json`;
    const response = await fetch(jsonUrl);
    
    if (response.ok) {
      reverseMapCache = await response.json();
      return reverseMapCache;
    }
  } catch (error) {
    console.warn('Failed to load reverse mapping:', error);
  }

  return {};
}

// Extract short code from URL
// Handles formats like:
// - https://is.gd/abc123
// - /#/abc123
// - abc123
export function extractShortCode(input) {
  if (!input) return null;

  // Remove protocol and domain
  let code = input.replace(/^https?:\/\//, '');
  code = code.replace(/^[^\/]+\//, ''); // Remove domain part
  
  // Remove hash and path prefixes
  code = code.replace(/^#\//, '');
  code = code.replace(/^\/+/, '');
  code = code.replace(/\/+$/, '');
  
  // Remove base path if exists
  const basePath = import.meta.env.BASE_URL || '/';
  if (basePath !== '/' && code.startsWith(basePath.replace(/\/$/, ''))) {
    code = code.replace(basePath.replace(/\/$/, ''), '');
  }

  return code || null;
}

// Lookup POI ID from short code
export async function getPoiIdFromShortCode(shortCode) {
  if (!shortCode) return null;

  const reverseMap = await loadReverseMap();
  return reverseMap[shortCode] || null;
}

// Get short URL for a POI ID
export async function getShortUrl(poiId) {
  if (!poiId) return null;

  const shortLinks = await loadShortLinks();
  const linkData = shortLinks[poiId];
  return linkData?.shortUrl || null;
}

// Get all short links (for admin/debugging)
export async function getAllShortLinks() {
  return await loadShortLinks();
}

