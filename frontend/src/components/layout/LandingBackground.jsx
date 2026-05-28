import { useEffect, useRef } from 'react'

import cfg from '../../config/particles-config.json'

// Dependency-free canvas particle layer (mirrors the tsparticles config).
// Disables itself below `minDesktopWidth` and under prefers-reduced-motion.
function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {return}

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia(`(min-width: ${cfg.minDesktopWidth}px)`)

    let ctx, particles, raf, w, h, dpr
    const rand = (min, max) => Math.random() * (max - min) + min

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: cfg.count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(cfg.size.min, cfg.size.max),
        o: rand(cfg.opacity.min, cfg.opacity.max),
        vx: rand(-cfg.speed.max, cfg.speed.max),
        vy: rand(-cfg.speed.max, cfg.speed.max),
        c: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) {p.x = w}
        else if (p.x > w) {p.x = 0}
        if (p.y < 0) {p.y = h}
        else if (p.y > h) {p.y = 0}
        ctx.globalAlpha = p.o
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (cfg.links?.enable) {
        const d2 = cfg.links.distance * cfg.links.distance
        ctx.strokeStyle = cfg.links.color
        ctx.lineWidth = cfg.links.width
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = dx * dx + dy * dy
            if (dist < d2) {
              ctx.globalAlpha = cfg.links.opacity * (1 - dist / d2)
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    function start() {
      stop()
      if (!desktop.matches || reduceMotion.matches) {return}
      build()
      raf = requestAnimationFrame(draw)
    }
    function stop() {
      if (raf) {cancelAnimationFrame(raf)}
      raf = null
    }

    start()
    const onResize = () => start()
    window.addEventListener('resize', onResize)
    desktop.addEventListener('change', start)
    reduceMotion.addEventListener('change', start)
    return () => {
      stop()
      window.removeEventListener('resize', onResize)
      desktop.removeEventListener('change', start)
      reduceMotion.removeEventListener('change', start)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

export default function LandingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0A0A0B]">
      {/* Layer 1: blurred blobs (also the no-JS fallback) */}
      <img
        src="/bg/bg-blobs.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      {/* Layer 2: drifting particles */}
      <Particles />
      {/* Layer 3: grain */}
      <div className="noise-overlay absolute inset-0" />
    </div>
  )
}
