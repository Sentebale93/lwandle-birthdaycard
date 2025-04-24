"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Cake, Heart, Star, Music, Gift, Play, Pause } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import Confetti from "./confetti"
import { Slider } from "@/components/ui/slider"

export default function BirthdayCard() {
  const [currentMonth, setCurrentMonth] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const [babyName, setBabyName] = useState("Little One")
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [autoPlayInterval, setAutoPlayInterval] = useState(4000) // 4 seconds per slide

  useEffect(() => {
    // Show confetti when reaching month 12
    if (currentMonth === 12) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [currentMonth])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentMonth((prev) => (prev === 12 ? 1 : prev + 1))
      }, autoPlayInterval)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isAutoPlaying, autoPlayInterval])

  // Now we have all 12 months!
  const availableMonths = 12
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-500 mb-2">{babyName}&apos;s 1st Birthday!</h1>
          <p className="text-xl text-gray-600">A year of wonderful memories</p>
        </div>

        <Card className="border-4 border-blue-300 rounded-3xl shadow-xl overflow-hidden bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cake className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-blue-500">Month {currentMonth}</h2>
              </div>
              <div className="flex items-center gap-1">
                {months.map((month) => (
                  <div
                    key={month}
                    className={cn(
                      "w-2 h-2 rounded-full cursor-pointer transition-all",
                      month === currentMonth ? "bg-blue-500 scale-150" : "bg-gray-300 hover:bg-blue-300",
                    )}
                    onClick={() => setCurrentMonth(month)}
                  />
                ))}
              </div>
            </div>

            <Carousel
              className="w-full"
              opts={{
                loop: true,
                startIndex: currentMonth - 1,
              }}
              onSelect={(index) => {
                setCurrentMonth(Number(index) + 1)
                if (isAutoPlaying) setIsAutoPlaying(false)
              }}
            >
              <CarouselContent>
                {months.map((month) => (
                  <CarouselItem key={month}>
                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-blue-200">
                      {month <= availableMonths ? (
                        <Image
                          src={`/images/month${month}.jpg`}
                          alt={`Baby at ${month} month${month > 1 ? "s" : ""}`}
                          width={800}
                          height={600}
                          className="w-full h-full object-contain bg-gray-50"
                          priority={month === 1 || month === currentMonth}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
                          <div className="text-center">
                            <div className="text-6xl font-bold text-blue-300 mb-2">{month}</div>
                            <p className="text-gray-500">Month {month} photo coming soon!</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-medium text-lg">{getMonthCaption(month)}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {month}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-blue-300 hover:bg-blue-100 hover:text-blue-600"
                  onClick={() => {
                    setCurrentMonth(currentMonth === 1 ? 12 : currentMonth - 1)
                    if (isAutoPlaying) setIsAutoPlaying(false)
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex gap-2">
                  <Heart className="h-6 w-6 text-blue-400 animate-pulse" />
                  <Star className="h-6 w-6 text-yellow-400 animate-bounce" />
                  <Heart className="h-6 w-6 text-blue-400 animate-pulse" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-blue-300 hover:bg-blue-100 hover:text-blue-600"
                  onClick={() => {
                    setCurrentMonth(currentMonth === 12 ? 1 : currentMonth + 1)
                    if (isAutoPlaying) setIsAutoPlaying(false)
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </Carousel>

            <div className="mt-6 text-center">
              <p className="text-lg text-gray-700 italic">
                &quot;From tiny fingers to first steps, what an amazing journey it&apos;s been!&quot;
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    setShowConfetti(true)
                    // Also play music when celebrating
                    const event = new CustomEvent("toggleBirthdayMusic")
                    window.dispatchEvent(event)
                  }}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Celebrate!
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-100"
                  onClick={() => {
                    // This will trigger the audio player in the parent component
                    const event = new CustomEvent("toggleBirthdayMusic")
                    window.dispatchEvent(event)
                  }}
                >
                  <Music className="mr-2 h-4 w-4" />
                  Play Music
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "border-blue-300 hover:bg-blue-100",
                    isAutoPlaying ? "bg-blue-100 text-blue-700" : "text-blue-600",
                  )}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Slideshow
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Auto Play
                    </>
                  )}
                </Button>
                {isAutoPlaying && (
                  <div className="mt-4 flex items-center gap-2 justify-center">
                    <span className="text-sm text-gray-500">Speed:</span>
                    <Slider
                      value={[autoPlayInterval]}
                      min={2000}
                      max={8000}
                      step={1000}
                      onValueChange={(value) => setAutoPlayInterval(value[0])}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-500">{autoPlayInterval / 1000}s</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function getMonthCaption(month: number) {
  const captions = [
    "Welcome to the world, little one! Wrapped in blue and surrounded by flowers.",
    "Cozy in a teddy bear outfit - those eyes are taking in the world!",
    "Looking so handsome in mint green - growing more alert each day!",
    "Discovering those tiny hands and enjoying special moments.",
    "Snuggled in a bunny outfit with a carrot - so adorable!",
    "Half a year already! Celebrating with a yellow duck outfit and cake.",
    "Looking nautical in blue and white stripes - sitting up so well!",
    "Holiday cheer in festive red and white - that smile is contagious!",
    "Tropical vibes with a shark cake - enjoying the outdoors!",
    "Looking stylish in stripes - growing more confident every day!",
    "That beautiful smile shows off your personality - almost a year old!",
    "My First Easter! Celebrating your first birthday with bunny ears and treats!",
  ]

  return captions[month - 1]
}
