// Script to generate short URLs for all POIs using is.gd (free URL shortener)
// Usage: node scripts/generate-short-links.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://f20230152.github.io/CAMPUS-WORKING-FINAL/';
const DELAY_MS = 2000; // 2 seconds between requests to respect rate limits
const OUTPUT_FILE = path.join(__dirname, '../public/data/short-links.json');

// Load POI data
const poisPath = path.join(__dirname, '../public/data/pois.json');
const poisData = JSON.parse(fs.readFileSync(poisPath, 'utf-8'));
const poiIds = Object.keys(poisData);

console.log(`Found ${poiIds.length} POIs to process`);

// Load existing short links if file exists
let shortLinksMap = {};
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    shortLinksMap = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    console.log(`Loaded ${Object.keys(shortLinksMap).length} existing short links`);
  } catch (e) {
    console.log('Starting fresh - no existing short links found');
  }
}

// Function to create short URL using is.gd API
async function createShortUrl(longUrl) {
  try {
    const encodedUrl = encodeURIComponent(longUrl);
    const apiUrl = `https://is.gd/create.php?format=json&url=${encodedUrl}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.shorturl) {
      return data.shorturl;
    } else {
      throw new Error(data.errormessage || 'Unknown error');
    }
  } catch (error) {
    console.error(`Error creating short URL: ${error.message}`);
    return null;
  }
}

// Function to sleep/delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to generate all short links
async function generateAllShortLinks() {
  const results = { ...shortLinksMap };
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  console.log('\nStarting short URL generation...\n');

  for (let i = 0; i < poiIds.length; i++) {
    const poiId = poiIds[i];
    
    // Skip if already exists
    if (results[poiId]) {
      console.log(`[${i + 1}/${poiIds.length}] Skipped ${poiId} - already exists`);
      skippedCount++;
      continue;
    }

    const longUrl = `${BASE_URL}#/${poiId}`;
    console.log(`[${i + 1}/${poiIds.length}] Creating short URL for ${poisData[poiId].college_name}...`);
    
    const shortUrl = await createShortUrl(longUrl);
    
    if (shortUrl) {
      results[poiId] = {
        shortUrl: shortUrl,
        longUrl: longUrl,
        collegeName: poisData[poiId].college_name,
        createdAt: new Date().toISOString()
      };
      successCount++;
      console.log(`  ✓ ${shortUrl}`);
      
      // Save progress every 10 successful requests
      if (successCount % 10 === 0) {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
        console.log(`  💾 Progress saved (${successCount} successful)`);
      }
    } else {
      errorCount++;
      console.log(`  ✗ Failed to create short URL`);
    }

    // Delay between requests (except for last one)
    if (i < poiIds.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Final save
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

  console.log('\n=== Generation Complete ===');
  console.log(`Total POIs: ${poiIds.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Skipped (already exists): ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`\nResults saved to: ${OUTPUT_FILE}`);
  
  // Create reverse mapping (short code -> POI ID) for easy lookup
  const reverseMap = {};
  Object.entries(results).forEach(([poiId, data]) => {
    if (data.shortUrl) {
      // Extract short code from URL (e.g., "abc123" from "https://is.gd/abc123")
      const shortCode = data.shortUrl.split('/').pop();
      reverseMap[shortCode] = poiId;
    }
  });

  const reverseMapPath = path.join(__dirname, '../public/data/short-links-reverse.json');
  fs.writeFileSync(reverseMapPath, JSON.stringify(reverseMap, null, 2));
  console.log(`Reverse mapping saved to: ${reverseMapPath}`);
}

// Run the script
generateAllShortLinks().catch(console.error);

