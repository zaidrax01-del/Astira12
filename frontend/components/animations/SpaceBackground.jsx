'use client'
import { useEffect, useRef } from 'react'

export default function SpaceBackground() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h, stars = [], mouse = { x: 0, y: 0 }

    const init = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        depth: Math.random() * 0.8 + 0.2,
      }))
    }
    init()
    window.addEventListener('resize', init)
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / w - 0.5) * 20
      mouse.y = (e.clientY / h - 0.5) * 20
    })

    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      stars.forEach(s => {
        const parallaxX = mouse.x * s.depth * 0.02
        const parallaxY = mouse.y * s.depth * 0.02
        ctx.beginPath()
        ctx.arc(s.x + parallaxX, s.y + parallaxY, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.depth * 0.7})`
        ctx.fill()
      })
      requestAnimationFrame(animate)
    }
    animate()
    return () => window.removeEventListener('resize', init)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-[#0a0015]" />
}
