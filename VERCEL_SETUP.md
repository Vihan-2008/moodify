# Vercel Deployment Setup for Moodify

## Environment Variables for Vercel

In your Vercel dashboard, add these environment variables:

\`\`\`
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret  
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://moodify-project-sable.vercel.app/
\`\`\`

## Spotify App Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your Moodify app
3. Click "Edit Settings"
4. Add this Redirect URI:
   \`\`\`
   https://moodify-project-sable.vercel.app/
   \`\`\`
5. Save the settings

## Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy the app
5. Update Spotify app settings with the Vercel URL

Your app should now work correctly with Spotify OAuth at:
https://moodify-project-sable.vercel.app/
