# 🔧 Spotify OAuth Troubleshooting Guide

## Current Status ✅
- ✅ Environment variables are correctly set in Vercel
- ✅ Client ID is present (32 characters)
- ✅ Redirect URI is configured: `https://moodify-project-sable.vercel.app/`
- ❌ Getting "Invalid authorization code" error

## 🎯 Most Likely Issue: Spotify App Configuration

### Step 1: Check Spotify Developer Dashboard
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on your Moodify app
3. Click "Edit Settings"
4. In the "Redirect URIs" section, make sure you have **exactly**:
   \`\`\`
   https://moodify-project-sable.vercel.app/
   \`\`\`
   
### ⚠️ Common Issues:
- **Missing trailing slash**: `https://moodify-project-sable.vercel.app` ❌
- **Correct with trailing slash**: `https://moodify-project-sable.vercel.app/` ✅
- **Multiple URIs**: Remove any old/incorrect redirect URIs
- **HTTP instead of HTTPS**: Must use HTTPS in production

### Step 2: Clear and Test
1. **Clear browser cache** for your Vercel app
2. **Remove any old redirect URIs** from Spotify app settings
3. **Save** the Spotify app settings
4. **Wait 2-3 minutes** for changes to propagate
5. **Try the login flow again**

### Step 3: Timing Issues
- Authorization codes expire after **10 minutes**
- Each code can only be used **once**
- Complete the OAuth flow quickly after clicking "Connect Spotify"

## 🔍 Debug Steps

### Check Your Spotify App Settings:
1. App Name: Should be "Moodify" or similar
2. App Description: Can be anything
3. Website: Can be your Vercel URL
4. **Redirect URIs**: Must contain exactly `https://moodify-project-sable.vercel.app/`
5. Which API/SDKs are you planning to use: Select "Web API"

### Verify Environment Variables Match:
- Vercel: `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` = `https://moodify-project-sable.vercel.app/`
- Spotify: Redirect URIs contains `https://moodify-project-sable.vercel.app/`

## 🚀 Quick Fix Checklist:
- [ ] Spotify app has correct redirect URI with trailing slash
- [ ] No old/incorrect redirect URIs in Spotify app
- [ ] Browser cache cleared
- [ ] Completed OAuth flow within 10 minutes
- [ ] Used fresh authorization (not refreshed page during OAuth)

## 📞 Still Having Issues?
If you're still getting the error after following these steps:
1. Check Vercel function logs for detailed error messages
2. Try creating a new Spotify app with the same settings
3. Ensure your Spotify account has developer access enabled
