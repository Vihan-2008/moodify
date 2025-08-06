"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Music2, Users } from 'lucide-react'

interface UserPreferencesProps {
  onSave: (preferences: any) => void
  initialPreferences?: any
}

const popularGenres = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Electronic", "Jazz", "Classical", "Country",
  "Indie", "Alternative", "Reggae", "Blues", "Folk", "Punk", "Metal", "Funk"
]

export function UserPreferences({ onSave, initialPreferences }: UserPreferencesProps) {
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>(initialPreferences?.favoriteArtists || [])
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(initialPreferences?.favoriteGenres || [])
  const [newArtist, setNewArtist] = useState("")
  const [customGenre, setCustomGenre] = useState("")

  const addArtist = () => {
    if (newArtist.trim() && !favoriteArtists.includes(newArtist.trim())) {
      setFavoriteArtists([...favoriteArtists, newArtist.trim()])
      setNewArtist("")
    }
  }

  const removeArtist = (artist: string) => {
    setFavoriteArtists(favoriteArtists.filter(a => a !== artist))
  }

  const toggleGenre = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter(g => g !== genre))
    } else {
      setFavoriteGenres([...favoriteGenres, genre])
    }
  }

  const addCustomGenre = () => {
    if (customGenre.trim() && !favoriteGenres.includes(customGenre.trim())) {
      setFavoriteGenres([...favoriteGenres, customGenre.trim()])
      setCustomGenre("")
    }
  }

  const handleSave = () => {
    onSave({
      favoriteArtists,
      favoriteGenres,
    })
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Music2 className="w-5 h-5 text-purple-400" />
          Your Music Preferences
        </CardTitle>
        <CardDescription className="text-gray-400">
          Tell us about your favorite artists and genres to get better playlist recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Favorite Artists */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4" />
            Favorite Artists
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder="Add your favorite artist..."
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addArtist()}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
            />
            <Button onClick={addArtist} size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {favoriteArtists.map((artist, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-purple-600/20 text-purple-300 border-purple-500/30 flex items-center gap-1"
              >
                {artist}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-400"
                  onClick={() => removeArtist(artist)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Favorite Genres */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Favorite Genres</h3>
          <div className="grid grid-cols-4 gap-2">
            {popularGenres.map((genre) => (
              <Button
                key={genre}
                variant={favoriteGenres.includes(genre) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleGenre(genre)}
                className={
                  favoriteGenres.includes(genre)
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-800 border-gray-600 hover:border-purple-400 text-white"
                }
              >
                {genre}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add custom genre..."
              value={customGenre}
              onChange={(e) => setCustomGenre(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomGenre()}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
            />
            <Button onClick={addCustomGenre} size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  )
}
