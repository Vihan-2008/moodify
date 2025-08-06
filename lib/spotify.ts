const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read',
  'user-read-recently-played'
].join(' ')

export const spotifyAuth = {
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID!,
      response_type: 'code',
      redirect_uri: SPOTIFY_REDIRECT_URI!,
      scope: SPOTIFY_SCOPES,
      show_dialog: 'true'
    })
    return `https://accounts.spotify.com/authorize?${params.toString()}`
  }
}

export const spotifyApi = {
  getUserProfile: async (accessToken: string) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get user profile')
    }

    return response.json()
  },

  getUserTopArtists: async (accessToken: string, limit = 20) => {
    const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=medium_term`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get top artists')
    }

    return response.json()
  },

  getUserTopTracks: async (accessToken: string, limit = 20) => {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=medium_term`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get top tracks')
    }

    return response.json()
  },

  searchTracks: async (accessToken: string, query: string, limit = 50) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to search tracks')
    }

    return response.json()
  },

  getRecommendations: async (accessToken: string, params: any) => {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })

    const response = await fetch(`https://api.spotify.com/v1/recommendations?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get recommendations')
    }

    return response.json()
  },

  getAudioFeatures: async (accessToken: string, trackIds: string[]) => {
    const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get audio features')
    }

    return response.json()
  },

  createPlaylist: async (accessToken: string, userId: string, name: string, description: string) => {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        public: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create playlist')
    }

    return response.json()
  },

  addTracksToPlaylist: async (accessToken: string, playlistId: string, trackUris: string[]) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to add tracks to playlist')
    }

    return response.json()
  }
}
