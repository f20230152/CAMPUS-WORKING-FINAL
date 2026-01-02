// Utility to load campus data based on URL
// Example URLs:
// /wrapped/kiit -> loads kiit.json
// /wrapped/iit-bombay -> loads iit-bombay.json

export async function loadCampusData(campusId) {
  try {
    // In production, you would fetch from a public directory
    // For now, we'll use a default import
    const data = await import(`../data/${campusId || 'campus'}.json`);
    return data.default;
  } catch (error) {
    console.error('Error loading campus data:', error);
    // Fallback to default campus data
    const defaultData = await import('../data/campus.json');
    return defaultData.default;
  }
}

// Extract campus ID from URL
export function getCampusIdFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/\/wrapped\/([^\/]+)/);
  return match ? match[1] : null;
}

