import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify credentials')
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri!,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Spotify token exchange failed:', errorData)
      throw new Error('Failed to exchange code for token')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 })
  }
}
