// Script to convert CSV to JSON format for POI data
// Handles commas in quoted values correctly
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Better CSV parser that handles quoted values with commas
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  return result;
}

// Read CSV file
const csvPath = path.join(__dirname, '..', 'Swiggy Wrapped Answers - Top 500 POI.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.trim().split('\n');
const headers = parseCSVLine(lines[0]);

// Create POI data object
const poiData = {};

for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  const poi = {};
  
  headers.forEach((header, index) => {
    poi[header] = values[index] || '';
  });
  
  // Convert to our JSON format
  const poiId = poi['POI Id'];
  if (poiId) {
    poiData[poiId] = {
      poi_id: poiId,
      college_name: poi['Name'] || '',
      stats: {
        favourite_dish: (poi['Favourite dish of your college'] || '').toLowerCase(),
        largest_order_value: parseInt(poi['Largest value food order at your college'] || '0', 10),
        unofficial_favorite_restaurant: poi['unofficial campus favorite restaurant'] || '',
        official_12am_craving: (poi['The official 12 AM craving / dish'] || '').toLowerCase(),
        max_orders_in_a_week: parseInt(poi['Max number of orders in a week for a student in your college'] || '0', 10),
        max_pizzas_single_day: parseInt(poi['Highest number of pizzas ordered on a single day'] || '0', 10),
        max_biryanis_single_day: parseInt(poi['Highest number of biryanis ordered on a single day'] || '0', 10)
      }
    };
  }
}

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'public', 'data', 'pois.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(poiData, null, 2), 'utf-8');
console.log(`✅ Converted ${Object.keys(poiData).length} POIs to JSON`);
console.log(`📁 Output: ${outputPath}`);
