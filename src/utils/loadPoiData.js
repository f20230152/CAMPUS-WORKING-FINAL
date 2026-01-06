// Utility to load POI data based on POI ID from URL
// Fetches from public/data/pois.json which contains all POI data

let poiCache = null;

export async function loadPoiData(poiId) {
  try {
    console.log('loadPoiData called with POI ID:', poiId);
    
    // Load all POI data once and cache it
    if (!poiCache) {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const jsonUrl = `${baseUrl}data/pois.json`;
      console.log('Fetching POI data from:', jsonUrl);
      
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        console.error('Failed to load POI data, status:', response.status);
        throw new Error(`Failed to load POI data: ${response.status}`);
      }
      poiCache = await response.json();
      console.log('POI cache loaded, total POIs:', Object.keys(poiCache).length);
    }

    // Get specific POI data - try exact match first
    let poiData = poiCache[poiId];
    console.log('Looking for POI:', poiId);
    console.log('POI found (exact match):', !!poiData);
    
    // If not found, try case-insensitive search
    if (!poiData) {
      const lowerPoiId = poiId.toLowerCase();
      const matchingKey = Object.keys(poiCache).find(key => key.toLowerCase() === lowerPoiId);
      if (matchingKey) {
        poiData = poiCache[matchingKey];
        console.log('POI found (case-insensitive):', matchingKey);
      }
    }
    
    if (!poiData) {
      console.warn(`POI ${poiId} not found in cache.`);
      console.warn('Available POI IDs (first 10):', Object.keys(poiCache).slice(0, 10));
      console.warn('Total POIs in cache:', Object.keys(poiCache).length);
      // Return default data if POI not found
      return await getDefaultData();
    }

    console.log('Returning POI data for:', poiData.college_name);
    return poiData;
  } catch (error) {
    console.error('Error loading POI data:', error);
    // Fallback to default data
    return await getDefaultData();
  }
}

async function getDefaultData() {
  try {
    const defaultData = await import('../data/campus.json');
    return defaultData.default;
  } catch (error) {
    console.error('Error loading default data:', error);
    // Return a minimal fallback
    return {
      poi_id: 'default',
      college_name: 'Campus',
      stats: {
        favourite_dish: 'biryani',
        largest_order_value: 0,
        unofficial_favorite_restaurant: '',
        official_12am_craving: 'burger',
        max_orders_in_a_week: 0,
        max_pizzas_single_day: 0,
        max_biryanis_single_day: 0
      }
    };
  }
}

// Extract POI ID from URL
export function getPoiIdFromUrl() {
  const path = window.location.pathname;
  // Remove base path if exists
  const basePath = import.meta.env.BASE_URL || '/';
  let cleanPath = path;
  
  if (basePath !== '/') {
    cleanPath = path.replace(basePath, '/');
  }
  
  // Extract POI ID from path like /CAMPUS-WORKING-FINAL/{poi_id} or /{poi_id}
  const segments = cleanPath.split('/').filter(s => s && s !== 'CAMPUS-WORKING-FINAL');
  
  // Last segment is the POI ID
  const poiId = segments[segments.length - 1];
  
  // If no POI ID or it's empty/root, return null (will use default)
  if (!poiId || poiId === '' || poiId === 'index.html') {
    return null;
  }
  
  return poiId;
}

