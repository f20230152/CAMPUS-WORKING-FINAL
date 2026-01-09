// Script to generate masked links for all campuses using is.gd URL shortening service
// This hides the original GitHub URLs from public view

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV line (handles quoted fields)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Generate masked link using tinyurl API (more reliable)
async function generateMaskedLink(originalUrl) {
  try {
    // Use tinyurl API (free, no API key required, more reliable)
    const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const shortUrl = await response.text();
    
    // TinyURL returns plain text, not JSON
    if (shortUrl && shortUrl.startsWith('http')) {
      return shortUrl.trim();
    } else {
      throw new Error('Invalid response from tinyurl');
    }
  } catch (error) {
    console.error(`Error generating masked link for ${originalUrl}:`, error.message);
    // Try alternative: v.gd (backup service)
    try {
      const backupUrl = `https://v.gd/create.php?format=json&url=${encodeURIComponent(originalUrl)}`;
      const backupResponse = await fetch(backupUrl);
      const backupData = await backupResponse.json();
      
      if (backupData.shorturl) {
        return backupData.shorturl;
      }
    } catch (backupError) {
      // If both fail, return original URL (will be handled in production)
      console.warn(`Both services failed for ${originalUrl}, using original URL`);
      return originalUrl;
    }
    
    return originalUrl;
  }
}

// Main function
async function main() {
  const csvPath = path.join(__dirname, '..', 'Swiggy Wrapped Answers - Final 70.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Parse header
  const header = parseCSVLine(lines[0]);
  const poiIdIndex = header.indexOf('POI Id');
  const weblinkIndex = header.indexOf('Weblink');
  
  if (poiIdIndex === -1 || weblinkIndex === -1) {
    throw new Error('Required columns not found in CSV');
  }
  
  // Add Masked Weblink column to header
  const newHeader = [...header, 'Masked Weblink'];
  
  // Process each row
  const results = [newHeader.join(',')];
  const maskedLinksMap = {};
  
  console.log(`Processing ${lines.length - 1} campuses...`);
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const fields = parseCSVLine(line);
    const poiId = fields[poiIdIndex];
    const originalWeblink = fields[weblinkIndex];
    
    if (!poiId || !originalWeblink) {
      console.warn(`Skipping row ${i + 1}: missing POI ID or Weblink`);
      results.push(line + ',');
      continue;
    }
    
    console.log(`Generating masked link for ${fields[1]} (${poiId})...`);
    
    // Generate masked link
    const maskedLink = await generateMaskedLink(originalWeblink);
    maskedLinksMap[poiId] = maskedLink;
    
    // Add masked link to CSV row
    const newRow = [...fields, maskedLink];
    results.push(newRow.join(','));
    
    // Add delay to avoid rate limiting (is.gd allows ~10 requests/second)
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Write updated CSV
  const outputCsvPath = path.join(__dirname, '..', 'Swiggy Wrapped Answers - Final 70 - With Masked Links.csv');
  fs.writeFileSync(outputCsvPath, results.join('\n'), 'utf-8');
  console.log(`\n✅ Updated CSV saved to: ${outputCsvPath}`);
  
  // Write JSON mapping file for app use
  const jsonPath = path.join(__dirname, '..', 'public', 'data', 'masked-links.json');
  fs.writeFileSync(jsonPath, JSON.stringify(maskedLinksMap, null, 2), 'utf-8');
  console.log(`✅ Masked links mapping saved to: ${jsonPath}`);
  
  console.log(`\n📊 Summary:`);
  console.log(`   - Total campuses processed: ${Object.keys(maskedLinksMap).length}`);
  console.log(`   - Masked links generated: ${Object.keys(maskedLinksMap).length}`);
}

main().catch(console.error);

