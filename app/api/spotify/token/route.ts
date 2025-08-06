import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, redirect_uri } = await request.json()

    // Log environment variables for debugging (remove in production)
    console.log('Environment check:', {
      hasClientId: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      clientIdLength: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID?.length,
      redirectUri: redirect_uri
    })

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
      console.error('Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID')
      return NextResponse.json({ error: 'Missing Spotify Client ID' }, { status: 500 })
    }

    if (!process.env.SPOTIFY_CLIENT_SECRET) {
      console.error('Missing SPOTIFY_CLIENT_SECRET')
      return NextResponse.json({ error: 'Missing Spotify Client Secret' }, { status: 500 })
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    
    // Use the redirect_uri from the request, or fall back to environment variable
    const redirectUri = redirect_uri || process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'https://moodify-project-sable.vercel.app/'

    console.log('Token exchange attempt:', {
      clientId: clientId.substring(0, 8) + '...',
      redirectUri,
      codeLength: code?.length
    })

    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    })

    console.log('Token request body:', tokenRequestBody.toString())

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: tokenRequestBody,
    })

    const responseText = await response.text()
    console.log('Spotify response status:', response.status)
    console.log('Spotify response:', responseText)

    if (!response.ok) {
      console.error('Spotify token exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      })
      
      let errorMessage = 'Failed to exchange code for token'
      try {
        const errorData = JSON.parse(responseText)
        if (errorData.error_description) {
          errorMessage = errorData.error_description
        }
      } catch (e) {
        // Response is not JSON, use the text
        errorMessage = responseText || errorMessage
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: {
          status: response.status,
          redirectUri: redirectUri
        }
      }, { status: 500 })
    }

    const data = JSON.parse(responseText)
    console.log('Token exchange successful')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during token exchange',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
