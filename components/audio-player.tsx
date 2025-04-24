"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume

      const handleEnded = () => setIsPlaying(false)
      audioRef.current.addEventListener("ended", handleEnded)

      // Loop the audio
      audioRef.current.loop = true

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleEnded)
        }
      }
    }
  }, [])

  // Listen for the custom event from the birthday card
  useEffect(() => {
    const handleToggleMusic = () => {
      togglePlay()
    }

    window.addEventListener("toggleBirthdayMusic", handleToggleMusic)

    return () => {
      window.removeEventListener("toggleBirthdayMusic", handleToggleMusic)
    }
  }, [isPlaying])

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 bg-white rounded-full shadow-lg transition-all duration-300 z-50",
        isExpanded ? "w-64 p-4" : "w-12 h-12",
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <audio ref={audioRef} src="/happy-birthday.mp3" />

      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className={cn(
            "flex items-center justify-center rounded-full bg-blue-500 text-white w-10 h-10 hover:bg-blue-600 transition-colors",
            !isExpanded && "absolute inset-0 m-auto",
          )}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {isExpanded && (
          <div className="flex-1 ml-1">
            <div className="text-xs font-medium text-gray-800 mb-1">Happy Birthday Song</div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-600 hover:text-blue-500"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
