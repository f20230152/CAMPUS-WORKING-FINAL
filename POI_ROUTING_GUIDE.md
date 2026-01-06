# POI-Based Routing Guide

## Overview
The app now supports dynamic routing for 500+ college campuses using POI IDs from the CSV file.

## URL Structure

### Default (No POI ID)
```
https://f20230152.github.io/CAMPUS-WORKING-FINAL/
```
- Uses default campus data (KIIT University)

### POI-Specific URLs
```
https://f20230152.github.io/CAMPUS-WORKING-FINAL/{poi_id}
```

**Examples:**
- KIIT University: `https://f20230152.github.io/CAMPUS-WORKING-FINAL/c0v89ojmud18qpl381s0`
- IIT Bombay: `https://f20230152.github.io/CAMPUS-WORKING-FINAL/4d74d528-2b1f-43d9-8179-64c8c47d0937`
- Thapar Institute: `https://f20230152.github.io/CAMPUS-WORKING-FINAL/c0v85kbnrs5psrn7ivvg`

## How It Works

1. **CSV to JSON Conversion**
   - CSV file: `Swiggy Wrapped Answers - Top 500 POI.csv`
   - Converted to: `public/data/pois.json`
   - Contains all 501 POIs indexed by POI ID

2. **Dynamic Data Loading**
   - App extracts POI ID from URL
   - Fetches data from `pois.json` (cached after first load)
   - Falls back to default data if POI not found

3. **Client-Side Routing**
   - Uses React Router for seamless navigation
   - Works with GitHub Pages static hosting
   - 404.html handles direct URL access

## Performance

- **Single JSON File**: All POI data in one file (~500KB)
- **Caching**: Data cached after first load
- **Concurrent Users**: Supports unlimited simultaneous users
- **Fast Loading**: Client-side routing, no server needed

## CSV Structure

Required columns:
- `POI Id` - Unique identifier (used in URL)
- `Name` - College name
- `Favourite dish of your college`
- `Largest value food order at your college`
- `unofficial campus favorite restaurant`
- `The official 12 AM craving / dish`
- `Max number of orders in a week for a student in your college`
- `Highest number of pizzas ordered on a single day`
- `Highest number of biryanis ordered on a single day`

## Updating Data

1. Update `Swiggy Wrapped Answers - Top 500 POI.csv`
2. Run conversion script:
   ```bash
   node scripts/convert-csv-to-json.js
   ```
3. Commit and push changes
4. GitHub Actions will rebuild and deploy

## Testing

### Local Testing
```bash
npm run dev
# Visit: http://localhost:5173/{poi_id}
```

### Production Testing
After deployment, test URLs:
- Root: `https://f20230152.github.io/CAMPUS-WORKING-FINAL/`
- POI: `https://f20230152.github.io/CAMPUS-WORKING-FINAL/c0v89ojmud18qpl381s0`

## Troubleshooting

### POI Not Found
- Check POI ID in URL matches CSV
- Verify `pois.json` contains the POI
- Check browser console for errors

### 404 Errors
- Ensure `public/404.html` exists
- Verify GitHub Pages is configured correctly
- Check base path in `vite.config.js`

### Data Not Loading
- Check network tab for `pois.json` request
- Verify JSON file is in `public/data/`
- Check CORS issues (shouldn't happen on same domain)

