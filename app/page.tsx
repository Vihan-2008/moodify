"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
//import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Type, Calendar, Play, Heart, Share2, Plus, Zap, Sparkles, LogIn, Settings, CheckCircle } from 'lucide-react'
import { UserPreferences } from "@/components/user-preferences"
import { spotifyApi } from "@/lib/spotify"

// Mood to Spotify audio features mapping
const moodToAudioFeatures = {
  happy: {
    valence: { min: 0.6, max: 1.0 },
    energy: { min: 0.5, max: 1.0 },
    danceability: { min: 0.5, max: 1.0 },
    searchTerms: ["happy", "upbeat", "cheerful", "positive", "joy", "celebration"],
  },
  sad: {
    valence: { min: 0.0, max: 0.4 },
    energy: { min: 0.0, max: 0.5 },
    acousticness: { min: 0.3, max: 1.0 },
    searchTerms: ["sad", "melancholy", "heartbreak", "emotional", "tears", "lonely"],
  },
  energetic: {
    energy: { min: 0.7, max: 1.0 },
    danceability: { min: 0.6, max: 1.0 },
    tempo: { min: 120, max: 200 },
    searchTerms: ["energy", "pump", "workout", "power", "intense", "hype"],
  },
  calm: {
    valence: { min: 0.3, max: 0.7 },
    energy: { min: 0.0, max: 0.4 },
    acousticness: { min: 0.4, max: 1.0 },
    instrumentalness: { min: 0.2, max: 1.0 },
    searchTerms: ["calm", "peaceful", "relax", "chill", "zen", "meditation"],
  },
  romantic: {
    valence: { min: 0.4, max: 0.8 },
    energy: { min: 0.2, max: 0.6 },
    acousticness: { min: 0.3, max: 0.8 },
    searchTerms: ["love", "romantic", "heart", "valentine", "romance", "intimate"],
  },
  confident: {
    valence: { min: 0.5, max: 0.9 },
    energy: { min: 0.6, max: 1.0 },
    danceability: { min: 0.4, max: 0.9 },
    searchTerms: ["confident", "boss", "power", "strong", "fierce", "unstoppable"],
  },
  nostalgic: {
    valence: { min: 0.3, max: 0.7 },
    energy: { min: 0.3, max: 0.7 },
    acousticness: { min: 0.2, max: 0.8 },
    searchTerms: ["classic", "retro", "vintage", "throwback", "memories", "nostalgia"],
  },
  angry: {
    valence: { min: 0.0, max: 0.4 },
    energy: { min: 0.7, max: 1.0 },
    loudness: { min: -10, max: 0 },
    searchTerms: ["angry", "rage", "mad", "furious", "intense", "aggressive"],
  },
}

// Enhanced mood detection function
const detectMoodFromText = (text: string) => {
  const moodKeywords = {
    happy: [
      "happy", "joy", "excited", "cheerful", "upbeat", "energetic", "amazing", "awesome", "great", "fantastic",
      "wonderful", "brilliant", "thrilled", "ecstatic", "elated", "positive", "bright", "celebration"
    ],
    sad: [
      "sad", "depressed", "down", "melancholy", "blue", "lonely", "upset", "disappointed", "heartbroken",
      "miserable", "gloomy", "sorrowful", "crying", "tears", "hurt", "grief"
    ],
    angry: [
      "angry", "mad", "frustrated", "annoyed", "furious", "rage", "irritated", "pissed", "livid",
      "outraged", "heated", "aggressive", "hostile", "bitter"
    ],
    calm: [
      "calm", "peaceful", "relaxed", "chill", "serene", "zen", "tranquil", "mellow", "soothing",
      "quiet", "still", "meditative", "centered", "balanced"
    ],
    nostalgic: [
      "nostalgic", "memories", "past", "remember", "miss", "childhood", "old", "vintage",
      "throwback", "reminisce", "classic", "retro", "yesterday"
    ],
    confident: [
      "confident", "strong", "powerful", "bold", "fierce", "unstoppable", "determined", "fearless",
      "brave", "invincible", "boss", "leader", "champion"
    ],
    romantic: [
      "love", "romantic", "heart", "crush", "valentine", "passion", "intimate", "tender",
      "affection", "adore", "romance", "dating", "relationship"
    ],
    energetic: [
      "energy", "pump", "workout", "gym", "active", "dance", "hyped", "pumped", "electric",
      "intense", "wild", "crazy", "party", "adrenaline", "explosive"
    ],
  }

  const lowerText = text.toLowerCase()
  const detectedMoods = []

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    const matches = keywords.filter((keyword) => lowerText.includes(keyword))
    if (matches.length > 0) {
      detectedMoods.push({
        mood,
        confidence: Math.min(matches.length * 15 + Math.random() * 25 + 50, 98),
        keywords: matches,
      })
    }
  }

  if (detectedMoods.length === 0) {
    const neutralWords = ["okay", "fine", "normal", "regular", "usual"]
    const hasNeutral = neutralWords.some((word) => lowerText.includes(word))
    return [{ mood: hasNeutral ? "calm" : "happy", confidence: 65, keywords: [] }]
  }

  return detectedMoods.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
}

const emojiMoods = [
  { emoji: "😊", mood: "happy", label: "Happy", color: "hover:bg-yellow-500/20 hover:border-yellow-500" },
  { emoji: "😢", mood: "sad", label: "Sad", color: "hover:bg-blue-500/20 hover:border-blue-500" },
  { emoji: "😌", mood: "calm", label: "Calm", color: "hover:bg-teal-500/20 hover:border-teal-500" },
  { emoji: "⚡", mood: "energetic", label: "Energetic", color: "hover:bg-red-500/20 hover:border-red-500" },
  { emoji: "😍", mood: "romantic", label: "Romantic", color: "hover:bg-pink-500/20 hover:border-pink-500" },
  { emoji: "😤", mood: "angry", label: "Angry", color: "hover:bg-red-600/20 hover:border-red-600" },
  { emoji: "🥺", mood: "nostalgic", label: "Nostalgic", color: "hover:bg-amber-500/20 hover:border-amber-500" },
  { emoji: "😎", mood: "confident", label: "Confident", color: "hover:bg-purple-500/20 hover:border-purple-500" },
]

export default function MoodifyApp() {
  const [textInput, setTextInput] = useState("")
  const [detectedMoods, setDetectedMoods] = useState<any[]>([])
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [generatedPlaylist, setGeneratedPlaylist] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set())
  const [spotifyUser, setSpotifyUser] = useState<any>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [createdPlaylists, setCreatedPlaylists] = useState<any[]>([])
  const [userPreferences, setUserPreferences] = useState<any>(null)
  const [showPreferences, setShowPreferences] = useState(false)
  const [moodHistory, setMoodHistory] = useState([
    { date: "2024-01-15", mood: "happy", playlist: "AI Happy Vibes", tracks: 25 },
    { date: "2024-01-14", mood: "calm", playlist: "AI Chill Session", tracks: 20 },
    { date: "2024-01-13", mood: "energetic", playlist: "AI Power Hour", tracks: 30 },
    { date: "2024-01-12", mood: "nostalgic", playlist: "AI Memory Lane", tracks: 18 },
  ])

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('moodify-preferences')
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  // Spotify OAuth
  const loginToSpotify = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      response_type: 'code',
      redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
      scope: 'user-read-private user-read-email playlist-modify-public playlist-modify-private user-top-read',
      show_dialog: 'true'
    })
    
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
  }

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")
    const error = urlParams.get("error")

    if (error) {
      console.error('Spotify auth error:', error)
      return
    }

    if (code && !accessToken) {
      // Exchange code for access token
      fetch('/api/spotify/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      .then(response => response.json())
      .then(async (tokenData) => {
        if (tokenData.access_token) {
          setAccessToken(tokenData.access_token)
          const user = await spotifyApi.getUserProfile(tokenData.access_token)
          setSpotifyUser(user)
          
          // Get user's top artists and tracks for better recommendations
          try {
            const topArtists = await spotifyApi.getUserTopArtists(tokenData.access_token, 10)
            const topTracks = await spotifyApi.getUserTopTracks(tokenData.access_token, 10)
            
            const autoPreferences = {
              favoriteArtists: topArtists.items.map((artist: any) => artist.name).slice(0, 5),
              favoriteGenres: [...new Set(topArtists.items.flatMap((artist: any) => artist.genres).slice(0, 5))]
            }
            
            if (!userPreferences) {
              setUserPreferences(autoPreferences)
              localStorage.setItem('moodify-preferences', JSON.stringify(autoPreferences))
            }
          } catch (error) {
            console.error('Error getting user preferences:', error)
          }
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      })
      .catch(error => {
        console.error('Token exchange error:', error)
      })
    }
  }, [accessToken, userPreferences])

  const analyzeMood = async () => {
    if (!textInput.trim()) return

    setIsAnalyzing(true)
    setDetectedMoods([])

    await new Promise((resolve) => setTimeout(resolve, 800))

    const moods = detectMoodFromText(textInput)
    setDetectedMoods(moods)
    setIsAnalyzing(false)

    if (moods.length > 0 && moods[0].confidence > 80) {
      setTimeout(() => generatePlaylist(moods[0].mood), 500)
    }
  }

  const generatePlaylist = async (mood: string) => {
    if (!accessToken) {
      alert('Please connect to Spotify first!')
      return
    }

    setSelectedMood(mood)
    setIsGenerating(true)
    setGeneratedPlaylist(null)

    try {
      const moodFeatures = moodToAudioFeatures[mood as keyof typeof moodToAudioFeatures]
      const tracks = []

      // Search based on mood terms
      for (const term of moodFeatures.searchTerms.slice(0, 3)) {
        try {
          const searchResult = await spotifyApi.searchTracks(accessToken, term, 10)
          tracks.push(...searchResult.tracks.items)
        } catch (error) {
          console.error(`Error searching for ${term}:`, error)
        }
      }

      // Search based on user's favorite artists if available
      if (userPreferences?.favoriteArtists) {
        for (const artist of userPreferences.favoriteArtists.slice(0, 3)) {
          try {
            const artistSearch = await spotifyApi.searchTracks(accessToken, `artist:${artist}`, 5)
            tracks.push(...artistSearch.tracks.items)
          } catch (error) {
            console.error(`Error searching for artist ${artist}:`, error)
          }
        }
      }

      // Get recommendations based on mood features
      try {
        const seedArtists = userPreferences?.favoriteArtists?.slice(0, 2) || []
        const seedGenres = userPreferences?.favoriteGenres?.slice(0, 2) || []
        
        const recommendationParams: any = {
          limit: 20,
          market: 'US'
        }

        // Add seed artists if available
        if (seedArtists.length > 0) {
          // First get artist IDs
          const artistIds = []
          for (const artistName of seedArtists) {
            try {
              const artistSearch = await spotifyApi.searchTracks(accessToken, `artist:${artistName}`, 1)
              if (artistSearch.tracks.items.length > 0) {
                artistIds.push(artistSearch.tracks.items[0].artists[0].id)
              }
            } catch (error) {
              console.error(`Error finding artist ID for ${artistName}:`, error)
            }
          }
          if (artistIds.length > 0) {
            recommendationParams.seed_artists = artistIds.slice(0, 2).join(',')
          }
        }

        // Add seed genres if available
        if (seedGenres.length > 0) {
          recommendationParams.seed_genres = seedGenres.slice(0, 2).join(',')
        }

        // Add mood-based audio features
        if (moodFeatures.valence) {
          recommendationParams.target_valence = (moodFeatures.valence.min + moodFeatures.valence.max) / 2
        }
        if (moodFeatures.energy) {
          recommendationParams.target_energy = (moodFeatures.energy.min + moodFeatures.energy.max) / 2
        }
        if (moodFeatures.danceability) {
          recommendationParams.target_danceability = (moodFeatures.danceability.min + moodFeatures.danceability.max) / 2
        }

        const recommendations = await spotifyApi.getRecommendations(accessToken, recommendationParams)
        tracks.push(...recommendations.tracks)
      } catch (error) {
        console.error('Error getting recommendations:', error)
      }

      // Remove duplicates and limit to 25 tracks
      const uniqueTracks = tracks
        .filter((track, index, self) => index === self.findIndex(t => t.id === track.id))
        .slice(0, 25)

      const playlist = {
        mood,
        name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes - ${new Date().toLocaleDateString()}`,
        description: `AI-generated ${mood} playlist based on your preferences and mood`,
        tracks: uniqueTracks.map((track: any) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist: any) => artist.name).join(", "),
          duration: Math.floor(track.duration_ms / 1000),
          preview_url: track.preview_url,
          uri: track.uri,
        })),
        color: getMoodColor(mood),
      }

      setGeneratedPlaylist(playlist)
      setIsGenerating(false)
    } catch (error) {
      console.error("Error generating playlist:", error)
      setIsGenerating(false)
      alert('Error generating playlist. Please try again.')
    }
  }

  const getMoodColor = (mood: string) => {
    const colors = {
      happy: "from-yellow-400 to-orange-500",
      sad: "from-blue-600 to-purple-700",
      energetic: "from-red-500 to-pink-600",
      calm: "from-teal-400 to-blue-500",
      romantic: "from-pink-400 to-rose-500",
      confident: "from-purple-500 to-indigo-600",
      nostalgic: "from-amber-400 to-orange-600",
      angry: "from-red-600 to-red-800",
    }
    return colors[mood as keyof typeof colors] || colors.happy
  }

  const selectEmojiMood = (mood: string) => {
    setDetectedMoods([{ mood, confidence: 95, keywords: [] }])
    generatePlaylist(mood)
  }

  const createSpotifyPlaylist = async () => {
    if (!spotifyUser || !generatedPlaylist || !accessToken) {
      alert("Please connect to Spotify first!")
      return
    }

    setIsCreatingPlaylist(true)

    try {
      // Create playlist on Spotify
      const playlist = await spotifyApi.createPlaylist(
        accessToken,
        spotifyUser.id,
        generatedPlaylist.name,
        generatedPlaylist.description
      )

      // Add tracks to the playlist
      const trackUris = generatedPlaylist.tracks.map((track: any) => track.uri)
      await spotifyApi.addTracksToPlaylist(accessToken, playlist.id, trackUris)

      // Add to created playlists
      setCreatedPlaylists([
        {
          ...playlist,
          mood: generatedPlaylist.mood,
          trackCount: generatedPlaylist.tracks.length,
          createdAt: new Date().toISOString(),
        },
        ...createdPlaylists,
      ])

      // Add to mood history
      const newEntry = {
        date: new Date().toISOString().split("T")[0],
        mood: generatedPlaylist.mood,
        playlist: generatedPlaylist.name,
        tracks: generatedPlaylist.tracks.length,
      }
      setMoodHistory([newEntry, ...moodHistory.slice(0, 9)])

      setIsCreatingPlaylist(false)
      alert(`Playlist "${playlist.name}" created successfully on Spotify with ${generatedPlaylist.tracks.length} tracks!`)
    } catch (error) {
      console.error("Error creating Spotify playlist:", error)
      setIsCreatingPlaylist(false)
      alert(`Error creating playlist: ${error.message}. Please make sure you're connected to Spotify and try again.`)
    }
  }

  const saveUserPreferences = (preferences: any) => {
    setUserPreferences(preferences)
    localStorage.setItem('moodify-preferences', JSON.stringify(preferences))
    setShowPreferences(false)
  }

  const togglePlay = (index: number) => {
    setCurrentlyPlaying(currentlyPlaying === index ? null : index)
  }

  const toggleLike = (index: number) => {
    const newLiked = new Set(likedSongs)
    if (newLiked.has(index)) {
      newLiked.delete(index)
    } else {
      newLiked.add(index)
    }
    setLikedSongs(newLiked)
  }

  const clearAll = () => {
    setTextInput("")
    setDetectedMoods([])
    setSelectedMood(null)
    setGeneratedPlaylist(null)
    setCurrentlyPlaying(null)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <img 
                src="/moodify-logo.png" 
                alt="Moodify Logo" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-300 text-xl font-medium">AI-Powered Spotify Playlists That Match Your Energy ⚡</p>

            {/* Spotify Login/User Info */}
            <div className="flex items-center justify-center gap-4">
              {spotifyUser ? (
                <div className="flex items-center gap-3 bg-green-600/20 border border-green-500/50 rounded-lg px-4 py-2">
                  <img
                    src={spotifyUser.images?.[0]?.url || "/placeholder.svg?height=32&width=32&query=user+avatar"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-green-400 font-medium">Connected as {spotifyUser.display_name}</span>
                </div>
              ) : (
                <Button onClick={loginToSpotify} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                  <LogIn className="w-4 h-4 mr-2" />
                  Connect Spotify
                </Button>
              )}

              <Button
                onClick={() => setShowPreferences(!showPreferences)}
                variant="outline"
                className="border-gray-600 hover:border-purple-400 bg-transparent"
              >
                <Settings className="w-4 h-4 mr-2" />
                Preferences
                {userPreferences && <CheckCircle className="w-4 h-4 ml-2 text-green-400" />}
              </Button>

              {(detectedMoods.length > 0 || generatedPlaylist) && (
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="border-gray-600 hover:border-purple-400 bg-transparent"
                >
                  Start Fresh
                </Button>
              )}
            </div>
          </div>

          {/* User Preferences */}
          {showPreferences && (
            <UserPreferences
              onSave={saveUserPreferences}
              initialPreferences={userPreferences}
            />
          )}

          <Tabs defaultValue="detect" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-700">
              <TabsTrigger value="detect" className="data-[state=active]:bg-purple-600">
                Mood Detection
              </TabsTrigger>
              <TabsTrigger value="playlist" className="data-[state=active]:bg-purple-600">
                Generated Playlist
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
                My Playlists
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detect" className="space-y-6">
              {/* Mood Input Methods */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Text Input */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Type className="w-5 h-5 text-purple-400" />
                      Describe Your Vibe
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Tell me how you're feeling and I'll generate a personalized Spotify playlist
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="I'm feeling pumped and ready to conquer the world! 🔥"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-400"
                    />
                    <Button
                      onClick={analyzeMood}
                      disabled={!textInput.trim() || isAnalyzing || !accessToken}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analyzing Your Mood...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          {accessToken ? "Generate Playlist" : "Connect Spotify First"}
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Emoji Input */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <span className="text-2xl">🎭</span>
                      Quick Mood Select
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Pick an emoji and get an instant personalized Spotify playlist
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-3">
                      {emojiMoods.map((item) => (
                        <Button
                          key={item.mood}
                          variant="outline"
                          className={`h-20 flex flex-col gap-2 bg-gray-800 border-gray-600 text-white transition-all duration-300 ${item.color}`}
                          onClick={() => selectEmojiMood(item.mood)}
                          disabled={isGenerating || !accessToken}
                        >
                          <span className="text-3xl">{item.emoji}</span>
                          <span className="text-xs font-medium">{item.label}</span>
                        </Button>
                      ))}
                    </div>
                    {!accessToken && (
                      <p className="text-center text-gray-500 text-sm mt-3">
                        Connect to Spotify to generate playlists
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Mood Detection Results */}
              {detectedMoods.length > 0 && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">🎯 Detected Moods</CardTitle>
                    <CardDescription className="text-gray-400">
                      Click on any mood to generate a personalized Spotify playlist based on your preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {detectedMoods.map((mood, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Button
                            variant={selectedMood === mood.mood ? "default" : "outline"}
                            onClick={() => generatePlaylist(mood.mood)}
                            className={`capitalize font-semibold ${
                              selectedMood === mood.mood
                                ? "bg-gradient-to-r from-purple-600 to-blue-600"
                                : "bg-gray-800 border-gray-600 hover:border-purple-400"
                            }`}
                            disabled={isGenerating || !accessToken}
                          >
                            {isGenerating && selectedMood === mood.mood ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                              </div>
                            ) : (
                              mood.mood
                            )}
                          </Button>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">{Math.round(mood.confidence)}% match</span>
                            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                                style={{ width: `${mood.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        {mood.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {mood.keywords.map((keyword: string, i: number) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-gray-800 text-purple-300 border-purple-500/30"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="playlist">
              {generatedPlaylist ? (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle
                          className={`text-3xl font-bold bg-gradient-to-r ${generatedPlaylist.color} bg-clip-text text-transparent`}
                        >
                          {generatedPlaylist.name}
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-lg mt-2">
                          {generatedPlaylist.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-purple-600">{generatedPlaylist.tracks.length} tracks</Badge>
                          <Badge variant="outline" className="border-gray-600">
                            Personalized for you
                          </Badge>
                          {userPreferences && (
                            <Badge variant="outline" className="border-green-600 text-green-400">
                              Based on your preferences
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 hover:border-pink-400 bg-transparent"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          className="border-gray-600 hover:border-pink-400 bg-transparent"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 hover:border-blue-400 bg-transparent"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={createSpotifyPlaylist}
                          disabled={!spotifyUser || isCreatingPlaylist}
                        >
                          {isCreatingPlaylist ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Creating...
                            </div>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              {spotifyUser ? "Create on Spotify" : "Login to Create"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {generatedPlaylist.tracks.map((song: any, index: number) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                            currentlyPlaying === index
                              ? "bg-purple-600/20 border border-purple-500/50"
                              : "hover:bg-gray-800 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-10 h-10 p-0 hover:bg-purple-600/20"
                              onClick={() => togglePlay(index)}
                            >
                              <Play
                                className={`w-5 h-5 ${currentlyPlaying === index ? "text-purple-400" : "text-gray-400"}`}
                              />
                            </Button>
                            <div className="flex-1">
                              <div className="font-semibold text-white">{song.name}</div>
                              <div className="text-sm text-gray-400">{song.artists}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => toggleLike(index)}>
                              <Heart
                                className={`w-4 h-4 ${likedSongs.has(index) ? "text-red-500 fill-current" : "text-gray-400"}`}
                              />
                            </Button>
                            <div className="text-sm text-gray-500 w-12 text-right">{formatDuration(song.duration)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-6">
                      <Music className="w-20 h-20 text-gray-600" />
                      <Sparkles className="w-6 h-6 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Playlist Generated Yet</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {accessToken 
                        ? "Detect your mood first and I'll create a personalized Spotify playlist that matches your energy! ⚡"
                        : "Connect to Spotify first, then detect your mood to generate personalized playlists!"
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              <div className="grid gap-6">
                {createdPlaylists.length > 0 && (
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Music className="w-5 h-5 text-green-400" />
                        Created Spotify Playlists
                      </CardTitle>
                      <CardDescription className="text-gray-400">Playlists you've created on Spotify</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {createdPlaylists.map((playlist, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-green-500/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-4 h-4 rounded-full bg-green-500"></div>
                              <div>
                                <div className="font-semibold text-white">{playlist.name}</div>
                                <div className="text-sm text-gray-400 capitalize">
                                  {playlist.mood} • {playlist.trackCount} tracks
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-600 text-green-400 hover:bg-green-600/20 bg-transparent"
                              onClick={() => window.open(playlist.external_urls.spotify, "_blank")}
                            >
                              Open in Spotify
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      Mood History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {moodHistory.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-500/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-4 h-4 rounded-full bg-gradient-to-r ${getMoodColor(entry.mood)}`}
                            ></div>
                            <div>
                              <div className="font-semibold capitalize text-white">{entry.mood}</div>
                              <div className="text-sm text-gray-400">{entry.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-300">{entry.playlist}</div>
                            <div className="text-xs text-gray-500">{entry.tracks} tracks</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
