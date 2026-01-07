# Audio Conversion Instructions

## Convert MPEG to AAC (.m4a) for iOS Compatibility

The audio file needs to be converted to AAC (.m4a) format for proper iOS Safari playback.

### Step 1: Install FFmpeg (if not installed)

**Windows:**
1. Download from: https://ffmpeg.org/download.html
2. Or use Chocolatey: `choco install ffmpeg`
3. Or use winget: `winget install ffmpeg`

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg  # Ubuntu/Debian
sudo yum install ffmpeg  # CentOS/RHEL
```

### Step 2: Convert the Audio File

Run this exact command in the project root:

```bash
ffmpeg -i public/music/background-music.mpeg -c:a aac -b:a 128k -movflags +faststart public/music/background-music.m4a
```

**What this does:**
- `-i public/music/background-music.mpeg` - Input file
- `-c:a aac` - Use AAC codec
- `-b:a 128k` - Audio bitrate 128kbps
- `-movflags +faststart` - Optimize for web streaming (starts playing before full download)
- `public/music/background-music.m4a` - Output file

### Step 3: Verify the File

After conversion, you should have:
- `public/music/background-music.m4a` (new file)
- `public/music/background-music.mpeg` (original, kept as fallback)

### Step 4: Test

The code will now:
1. Try to load `background-music.m4a` first (iOS/Android/Safari compatible)
2. Fall back to `background-music.mpeg` if M4A fails

### MIME Type

The server should serve `.m4a` files with `Content-Type: audio/mp4`

For GitHub Pages, this is handled automatically.
For local development with Vite, this is handled automatically.

### Why .m4a?

- ✅ iOS Safari native support
- ✅ Android native support  
- ✅ Desktop Safari support
- ✅ Better compression than MPEG
- ✅ Fast start for web streaming

