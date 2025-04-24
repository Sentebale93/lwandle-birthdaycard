import BirthdayCard from "@/components/birthday-card"
import AudioPlayer from "@/components/audio-player"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-green-50">
      <BirthdayCard />
      <AudioPlayer />
    </main>
  )
}
