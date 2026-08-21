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
  [255, 255, 255], [214, 232, 247], [184, 212, 238], [234, 244, 251],
  [200, 220, 245], [248, 252, 255], [91, 141, 191],
];
const DETECT_RADIUS = 210;
const MIN_DIST = 95;

export default function PhysicsOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId = 0;
    let running = false;
    let visible = true;
    let lastFrame = 0;
    let t = 0;
    let orbs: Orb[] = [];
    const mouse = { x: -2000, y: -2000, active: false };
    const frameInterval = isTouchDevice ? 1000 / 24 : 1000 / 40;

    const initOrbs = (w: number, h: number) => {
      const count = reducedMotion ? 5 : isTouchDevice ? 6 : 14;
      orbs = Array.from({ length: count }, (_, i) => {
        const color = COLORS[i % COLORS.length];
        const bx = w * 0.06 + Math.random() * w * 0.88;
        const by = h * 0.06 + Math.random() * h * 0.88;
        return {
          x: bx, y: by, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: 28 + Math.random() * 62, baseX: bx, baseY: by,
          opacity: 0.2 + Math.random() * 0.26,
          colorR: color[0], colorG: color[1], colorB: color[2],
          freq: 0.18 + Math.random() * 0.45, phase: Math.random() * Math.PI * 2,
          pulsePhase: Math.random() * Math.PI * 2, followStrength: 0,
        };
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const scale = isTouchDevice ? 0.7 : 0.85;
      canvas.width = Math.max(1, Math.round(parent.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(parent.clientHeight * scale));
      initOrbs(canvas.width, canvas.height);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
      mouse.active = true;
    };
    const onMouseLeave = () => { mouse.active = false; };

    const render = (timestamp: number) => {
      if (!running) return;
      animId = requestAnimationFrame(render);
      if (timestamp - lastFrame < frameInterval) return;
      lastFrame = timestamp;
      t += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        const mdx = orb.x - mouse.x;
        const mdy = orb.y - mouse.y;
        const dist = Math.hypot(mdx, mdy);
        if (!reducedMotion) {
          if (mouse.active && dist < DETECT_RADIUS) orb.followStrength = Math.min(1, orb.followStrength + 0.05);
          else orb.followStrength = Math.max(0, orb.followStrength - 0.025);

          if (orb.followStrength > 0 && mouse.active && dist > 0) {
            if (dist > MIN_DIST) {
              const pull = orb.followStrength * ((DETECT_RADIUS - dist) / DETECT_RADIUS) * 0.8;
              orb.vx -= (mdx / dist) * pull;
              orb.vy -= (mdy / dist) * pull;
            } else {
              const push = ((MIN_DIST - dist) / MIN_DIST) * 2.2 * orb.followStrength;
              orb.vx += (mdx / dist) * push;
              orb.vy += (mdy / dist) * push;
            }
          }
          orb.vx += Math.sin(t * orb.freq + orb.phase) * 0.022;
          orb.vy += Math.cos(t * orb.freq * 0.72 + orb.phase + 1.1) * 0.02;
          const spring = 0.0032 * (1 - orb.followStrength * 0.75);
          orb.vx += (orb.baseX - orb.x) * spring;
          orb.vy += (orb.baseY - orb.y) * spring;
          orb.vx *= 0.87;
          orb.vy *= 0.87;
          orb.x += orb.vx;
          orb.y += orb.vy;
        }

        const r = orb.r * (reducedMotion ? 1 : 1 + 0.035 * Math.sin(t * 1.1 + orb.pulsePhase));
        const grad = ctx.createRadialGradient(orb.x - r * 0.2, orb.y - r * 0.25, 0, orb.x, orb.y, r * 1.25);
        grad.addColorStop(0, `rgba(255,255,255,${orb.opacity})`);
        grad.addColorStop(0.35, `rgba(${orb.colorR},${orb.colorG},${orb.colorB},${orb.opacity * 0.62})`);
        grad.addColorStop(1, `rgba(${orb.colorR},${orb.colorG},${orb.colorB},0)`);
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r * 1.25, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      lastFrame = 0;
      animId = requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animId);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.01 });
    observer.observe(canvas);

    const onVisibilityChange = () => { if (document.hidden) stop(); else start(); };
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (!isTouchDevice && !reducedMotion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }
    start();

    return () => {
      stop();
      ro.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}
