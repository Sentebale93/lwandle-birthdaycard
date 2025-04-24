"use client"

import { useEffect, useRef } from "react"

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 200
    const colors = ["#4299e1", "#38b2ac", "#68d391", "#90cdf4", "#81e6d9", "#9ae6b4", "#3182ce"]

    class Particle {
      x: number
      y: number
      size: number
      color: string
      speedX: number
      speedY: number
      gravity: number
      rotation: number
      rotationSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.size = Math.random() * 15 + 5
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.speedX = Math.random() * 6 - 3
        this.speedY = Math.random() * 2 + 2
        this.gravity = 0.1
        this.rotation = Math.random() * 360
        this.rotationSpeed = Math.random() * 10 - 5
      }

      update() {
        this.y += this.speedY
        this.x += this.speedX
        this.speedY += this.gravity
        this.rotation += this.rotationSpeed

        if (this.y > canvas.height) {
          this.y = -this.size
          this.speedY = Math.random() * 2 + 2
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)

        // Draw a confetti piece (rectangle)
        ctx.fillStyle = this.color
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2)

        ctx.restore()
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />
}
