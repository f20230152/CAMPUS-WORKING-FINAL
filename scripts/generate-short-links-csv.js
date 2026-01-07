// Script to generate a CSV file with all short links after they've been generated
// Usage: node scripts/generate-short-links-csv.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHORT_LINKS_FILE = path.join(__dirname, '../public/data/short-links.json');
const OUTPUT_CSV = path.join(__dirname, '../public/data/short-links.csv');

// Load short links
if (!fs.existsSync(SHORT_LINKS_FILE)) {
  console.error('Short links file not found. Please run generate-short-links.js first.');
  process.exit(1);
}

const shortLinks = JSON.parse(fs.readFileSync(SHORT_LINKS_FILE, 'utf-8'));

// Generate CSV
const csvRows = [
  'College Name,POI ID,Short URL,Full URL'
];

Object.entries(shortLinks).forEach(([poiId, data]) => {
  if (data.shortUrl) {
    const collegeName = data.collegeName || 'Unknown';
    const row = [
      `"${collegeName}"`,
      poiId,
      data.shortUrl,
      data.longUrl
    ].join(',');
    csvRows.push(row);
  }
});

// Write CSV file
fs.writeFileSync(OUTPUT_CSV, csvRows.join('\n'));

console.log(`✅ Generated CSV with ${csvRows.length - 1} short links`);
console.log(`📄 Saved to: ${OUTPUT_CSV}`);

