# Spotify Integration Setup Guide

## 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the details:
   - **App Name**: Moodify
   - **App Description**: AI-powered playlist generator
   - **Website**: Your deployment URL (e.g., https://yourusername.github.io/moodify)
   - **Redirect URI**: Your deployment URL + "/" (e.g., https://yourusername.github.io/moodify/)

## 2. Get Your Credentials

1. After creating the app, you'll see your **Client ID**
2. Click "Show Client Secret" to reveal your **Client Secret**
3. Copy both values

## 3. Set Environment Variables

### For GitHub Pages / Vercel / Netlify:

Add these environment variables in your deployment platform:

\`\`\`
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://yourdomain.com/
\`\`\`

### For Local Development:

Create a `.env.local` file in your project root:

\`\`\`
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/
\`\`\`

## 4. Update Spotify App Settings

1. Go back to your Spotify app in the developer dashboard
2. Click "Edit Settings"
3. Add your deployment URL to "Redirect URIs":
   - For GitHub Pages: `https://yourusername.github.io/moodify/`
   - For Vercel: `https://your-app-name.vercel.app/`
   - For custom domain: `https://yourdomain.com/`
4. Save the settings

## 5. Common Issues

### "Illegal redirect uri" Error
- Make sure the redirect URI in your Spotify app settings exactly matches your deployment URL
- Include the trailing slash (/)
- The URL must use HTTPS in production

### "Invalid client" Error
- Check that your Client ID is correct
- Make sure the environment variable name is exactly `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`

### Token Exchange Fails
- Verify your Client Secret is correct
- Ensure the environment variable `SPOTIFY_CLIENT_SECRET` is set (without NEXT_PUBLIC_ prefix)

## 6. Testing

1. Deploy your app
2. Visit your deployment URL
3. Click "Connect Spotify"
4. You should be redirected to Spotify for authorization
5. After approving, you should be redirected back to your app

## Example URLs

If your GitHub username is `johndoe` and repository is `moodify`:
- **Website**: `https://johndoe.github.io/moodify`
- **Redirect URI**: `https://johndoe.github.io/moodify/`

Remember to update both the environment variables AND the Spotify app settings with the correct URLs!
