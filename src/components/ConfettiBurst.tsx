import { useEffect, useRef } from 'react';

export interface BurstOrigin {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  vr: number;
  tilt: number;
  vTilt: number;
  age: number;
  maxAge: number;
  color: string;
  shape: 'dot' | 'rect';
}

const CONFETTI_COLORS = [
  '#B45309',
  '#D97706',
  '#F59E0B',
  '#FCD34D',
  '#171614',
  '#A8A29E',
];

function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  alpha: number
) {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = particle.color;

  if (particle.shape === 'dot') {
    ctx.beginPath();
    ctx.arc(0, 0, particle.width * 0.45, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const scaleY = 0.35 + 0.65 * Math.abs(Math.cos(particle.tilt));
    ctx.scale(1, scaleY);
    ctx.beginPath();
    ctx.roundRect(
      -particle.width / 2,
      -particle.height / 2,
      particle.width,
      particle.height,
      1.5
    );
    ctx.fill();
  }

  ctx.restore();
}

export function ConfettiBurst({ burst }: { burst: BurstOrigin | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!burst || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resizeCanvas = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resizeCanvas();

    for (let i = 0; i < 42; i++) {
      const spread = (Math.random() - 0.5) * Math.PI * 1.25;
      const angle = -Math.PI / 2 + spread;
      const speed = 260 + Math.random() * 460;
      const color =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

      particlesRef.current.push({
        x: burst.x + (Math.random() - 0.5) * 48,
        y: burst.y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 70,
        width: 6 + Math.random() * 5,
        height: 3.5 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 9,
        tilt: Math.random() * Math.PI,
        vTilt: 6 + Math.random() * 8,
        age: 0,
        maxAge: 0.9 + Math.random() * 0.45,
        color,
        shape: i % 4 === 0 ? 'dot' : 'rect',
      });
    }

    if (rafRef.current !== null) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    lastTimeRef.current = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      if (
        canvas.width !== Math.floor(window.innerWidth * dpr) ||
        canvas.height !== Math.floor(window.innerHeight * dpr)
      ) {
        resizeCanvas();
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const remaining: Particle[] = [];
      const drag = 0.984 ** (dt * 60);

      for (const p of particlesRef.current) {
        p.age += dt;
        if (p.age >= p.maxAge) continue;

        p.vx *= drag;
        p.vy = p.vy * drag + 860 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.vr * dt;
        p.tilt += p.vTilt * dt;

        const progress = p.age / p.maxAge;
        const alpha = progress > 0.62 ? 1 - (progress - 0.62) / 0.38 : 1;
        drawParticle(ctx, p, Math.max(0, alpha));
        remaining.push(p);
      }

      particlesRef.current = remaining;
      if (remaining.length > 0) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        rafRef.current = null;
      }
    };

    rafRef.current = window.requestAnimationFrame(step);
  }, [burst]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
}
