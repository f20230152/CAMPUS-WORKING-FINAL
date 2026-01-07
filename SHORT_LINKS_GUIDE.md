# Short Links Guide

## Overview
This system generates encrypted/shortened URLs for all 500+ college campuses using the free **is.gd** URL shortener service.

## How It Works

### 1. **External Short URLs (is.gd)**
- Each POI gets a short URL like: `https://is.gd/abc123`
- These automatically redirect to: `https://f20230152.github.io/CAMPUS-WORKING-FINAL/#/{poi_id}`
- **No app changes needed** - the browser follows the redirect automatically

### 2. **Internal Short Codes (Optional)**
- The app also supports short codes directly: `/#/abc123`
- The app looks up the short code and resolves it to the full POI ID
- Works seamlessly with existing routing

## Generated Files

After running the script, you'll get:

1. **`public/data/short-links.json`**
   - Full mapping: POI ID → Short URL data
   - Contains: `shortUrl`, `longUrl`, `collegeName`, `createdAt`

2. **`public/data/short-links-reverse.json`**
   - Reverse mapping: Short code → POI ID
   - Used by the app for short code lookups

3. **`public/data/short-links.csv`** (after running CSV generator)
   - Spreadsheet-friendly format
   - Easy to share with team/marketing

## Usage

### Generating Short Links

```bash
# Generate all short links (takes ~17-20 minutes)
node scripts/generate-short-links.js

# Generate CSV file (after short links are generated)
node scripts/generate-short-links-csv.js
```

### Using Short Links

**Option 1: External Short URLs (Recommended)**
```
https://is.gd/abc123
```
- Share this link directly
- Automatically redirects to the full URL
- Works everywhere (email, SMS, social media)

**Option 2: Internal Short Codes**
```
https://f20230152.github.io/CAMPUS-WORKING-FINAL/#/abc123
```
- Uses your domain
- App resolves the short code automatically
- No external dependency

## Rate Limits

- **is.gd API**: Free, no authentication required
- **Rate Limit**: ~1 request per 2 seconds (respected by script)
- **Total Time**: ~17-20 minutes for 500+ POIs

## Progress Tracking

The script:
- ✅ Saves progress every 10 successful requests
- ✅ Skips already-generated links (resumable)
- ✅ Shows real-time progress in console
- ✅ Handles errors gracefully

## Example Output

```json
{
  "c0v89ojmud18qpl381s0": {
    "shortUrl": "https://is.gd/abc123",
    "longUrl": "https://f20230152.github.io/CAMPUS-WORKING-FINAL/#/c0v89ojmud18qpl381s0",
    "collegeName": "KIIT University",
    "createdAt": "2025-01-27T10:30:00.000Z"
  }
}
```

## Troubleshooting

**Q: Script fails with rate limit error**
- A: The script already includes 2-second delays. If issues persist, increase `DELAY_MS` in the script.

**Q: Some links failed to generate**
- A: Re-run the script - it will skip existing links and only generate missing ones.

**Q: How do I share all links?**
- A: Run `generate-short-links-csv.js` to create a CSV file with all mappings.

**Q: Can I use a different URL shortener?**
- A: Yes! Modify `createShortUrl()` function in `scripts/generate-short-links.js` to use a different API.

## Next Steps

1. ✅ Script is running in background (check console for progress)
2. ⏳ Wait for generation to complete (~17-20 minutes)
3. 📄 Run CSV generator: `node scripts/generate-short-links-csv.js`
4. 🚀 Deploy to GitHub Pages
5. 📤 Share short links with users!

