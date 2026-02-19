'use client';

import { useRef, useEffect } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseX: number;
  baseY: number;
  opacity: number;
  colorR: number;
  colorG: number;
  colorB: number;
  freq: number;
  phase: number;
  pulsePhase: number;
  followStrength: number;
}

const COLORS: [number, number, number][] = [
  [255, 255, 255],
  [214, 232, 247],
  [184, 212, 238],
  [234, 244, 251],
  [200, 220, 245],
  [248, 252, 255],
  [91, 141, 191],
];

const DETECT_RADIUS = 210;
const MIN_DIST = 95;

export default function PhysicsOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const mouse = { x: -2000, y: -2000, active: false };
    let orbs: Orb[] = [];
    let t = 0;

    const initOrbs = (w: number, h: number) => {
      orbs = [];
      const count = 22;
      for (let i = 0; i < count; i++) {
        const color = COLORS[i % COLORS.length];
        const bx = w * 0.06 + Math.random() * w * 0.88;
        const by = h * 0.06 + Math.random() * h * 0.88;
        orbs.push({
          x: bx,
          y: by,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 28 + Math.random() * 72,
          baseX: bx,
          baseY: by,
          opacity: 0.22 + Math.random() * 0.32,
          colorR: color[0],
          colorG: color[1],
          colorB: color[2],
          freq: 0.18 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          pulsePhase: Math.random() * Math.PI * 2,
          followStrength: 0,
        });
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initOrbs(canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const draw = () => {
      if (!canvas || !ctx) return;
      t += 0.007;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        const mdx = orb.x - mouse.x;
        const mdy = orb.y - mouse.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mouse.active && dist < DETECT_RADIUS) {
          orb.followStrength = Math.min(1, orb.followStrength + 0.035);
        } else {
          orb.followStrength = Math.max(0, orb.followStrength - 0.018);
        }

        if (orb.followStrength > 0 && mouse.active && dist > 0) {
          if (dist > MIN_DIST) {
            const proximity = (DETECT_RADIUS - dist) / DETECT_RADIUS;
            const pull = orb.followStrength * proximity * 0.9;
            orb.vx -= (mdx / dist) * pull;
            orb.vy -= (mdy / dist) * pull;
          } else {
            const push = ((MIN_DIST - dist) / MIN_DIST) * 2.8 * orb.followStrength;
            orb.vx += (mdx / dist) * push;
            orb.vy += (mdy / dist) * push;
          }
        }

        orb.vx += Math.sin(t * orb.freq + orb.phase) * 0.028;
        orb.vy += Math.cos(t * orb.freq * 0.72 + orb.phase + 1.1) * 0.025;

        const spring = 0.0032 * (1 - orb.followStrength * 0.75);
        orb.vx += (orb.baseX - orb.x) * spring;
        orb.vy += (orb.baseY - orb.y) * spring;

        orb.vx *= 0.87;
        orb.vy *= 0.87;

        orb.x += orb.vx;
        orb.y += orb.vy;

        const pulse = 1 + 0.04 * Math.sin(t * 1.1 + orb.pulsePhase);
        const r = orb.r * pulse;

        const grad = ctx.createRadialGradient(
          orb.x - r * 0.28, orb.y - r * 0.32, r * 0.03,
          orb.x, orb.y, r
        );
        grad.addColorStop(0, `rgba(255,255,255,${orb.opacity * 0.98})`);
        grad.addColorStop(0.22, `rgba(${orb.colorR},${orb.colorG},${orb.colorB},${orb.opacity * 0.72})`);
        grad.addColorStop(0.55, `rgba(${orb.colorR},${orb.colorG},${orb.colorB},${orb.opacity * 0.32})`);
        grad.addColorStop(1, `rgba(${orb.colorR},${orb.colorG},${orb.colorB},0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        const glow = ctx.createRadialGradient(orb.x, orb.y, r * 0.65, orb.x, orb.y, r * 1.55);
        glow.addColorStop(0, `rgba(91,141,191,${orb.opacity * 0.1})`);
        glow.addColorStop(1, 'rgba(91,141,191,0)');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r * 1.55, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
