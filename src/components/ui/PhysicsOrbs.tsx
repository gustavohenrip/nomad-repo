'use client';

import { useEffect, useRef } from 'react';

type RGB = [number, number, number];

interface Pearl {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number;
  phase: number;
  drift: number;
  opacity: number;
  palette: number;
  ring: boolean;
}

interface Dust {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  opacity: number;
  depth: number;
}

const PALETTES: RGB[] = [
  [91, 141, 191],
  [126, 174, 218],
  [165, 151, 214],
  [111, 190, 199],
  [220, 178, 139],
];

const SPRITE_SIZE = 256;
const POINTER_RADIUS = 230;

function rgba([r, g, b]: RGB, alpha: number) {
  return `rgba(${r},${g},${b},${alpha})`;
}

function makePearlSprite(color: RGB) {
  const sprite = document.createElement('canvas');
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;

  const c = SPRITE_SIZE / 2;

  const aura = ctx.createRadialGradient(c, c, 8, c, c, c);
  aura.addColorStop(0, rgba(color, 0.17));
  aura.addColorStop(0.58, rgba(color, 0.08));
  aura.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  const body = ctx.createRadialGradient(c * 0.7, c * 0.62, 4, c, c, c * 0.73);
  body.addColorStop(0, 'rgba(255,255,255,0.98)');
  body.addColorStop(0.09, 'rgba(255,255,255,0.88)');
  body.addColorStop(0.26, rgba(color, 0.56));
  body.addColorStop(0.58, rgba(color, 0.22));
  body.addColorStop(0.83, rgba(color, 0.07));
  body.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.74, 0, Math.PI * 2);
  ctx.fill();

  const rim = ctx.createRadialGradient(c, c, c * 0.51, c, c, c * 0.74);
  rim.addColorStop(0, 'rgba(255,255,255,0)');
  rim.addColorStop(0.72, rgba(color, 0.03));
  rim.addColorStop(0.88, 'rgba(255,255,255,0.34)');
  rim.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.74, 0, Math.PI * 2);
  ctx.fill();

  const highlight = ctx.createRadialGradient(c * 0.67, c * 0.58, 0, c * 0.67, c * 0.58, c * 0.26);
  highlight.addColorStop(0, 'rgba(255,255,255,0.92)');
  highlight.addColorStop(0.34, 'rgba(255,255,255,0.34)');
  highlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  return sprite;
}

function makePointerHalo() {
  const sprite = document.createElement('canvas');
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;

  const c = SPRITE_SIZE / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  gradient.addColorStop(0, 'rgba(255,255,255,0.25)');
  gradient.addColorStop(0.2, 'rgba(120,177,222,0.12)');
  gradient.addColorStop(0.55, 'rgba(154,141,211,0.055)');
  gradient.addColorStop(1, 'rgba(91,141,191,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return sprite;
}

export default function PhysicsOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    const touch = window.matchMedia('(hover: none)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pearlSprites = PALETTES.map(makePearlSprite);
    const pointerHalo = makePointerHalo();

    let pearls: Pearl[] = [];
    let dust: Dust[] = [];
    let animId = 0;
    let running = false;
    let visible = true;
    let lastFrame = 0;
    let elapsed = 0;
    let scale = 1;

    const pointer = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      active: false,
      strength: 0,
    };

    const frameInterval = reducedMotion ? 1000 / 10 : touch ? 1000 / 30 : 1000 / 45;

    const initScene = (w: number, h: number) => {
      const pearlCount = reducedMotion ? 6 : touch ? 9 : 15;
      const dustCount = reducedMotion ? 10 : touch ? 20 : 36;

      pearls = Array.from({ length: pearlCount }, (_, i) => {
        const depth = 0.58 + Math.random() * 0.9;
        const radius = (18 + Math.random() * 44) * (0.78 + depth * 0.22);
        const baseX = w * (0.05 + Math.random() * 0.9);
        const baseY = h * (0.07 + Math.random() * 0.86);
        return {
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: 0,
          vy: 0,
          radius,
          depth,
          phase: Math.random() * Math.PI * 2,
          drift: 0.22 + Math.random() * 0.4,
          opacity: 0.5 + Math.random() * 0.34,
          palette: i % PALETTES.length,
          ring: !touch && i < Math.max(2, Math.round(pearlCount * 0.25)),
        };
      });

      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 0.65 + Math.random() * 1.55,
        phase: Math.random() * Math.PI * 2,
        speed: 0.22 + Math.random() * 0.6,
        opacity: 0.12 + Math.random() * 0.35,
        depth: 0.4 + Math.random() * 0.9,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      scale = touch ? 0.72 : 0.86;
      canvas.width = Math.max(1, Math.round(parent.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(parent.clientHeight * scale));
      initScene(canvas.width, canvas.height);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) * (canvas.width / rect.width);
      pointer.targetY = (event.clientY - rect.top) * (canvas.height / rect.height);
      if (!pointer.active) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const drawConnections = () => {
      if (touch || reducedMotion) return;
      const maxDistance = 145 * scale;

      ctx.lineWidth = Math.max(0.5, 0.7 * scale);
      for (let i = 0; i < pearls.length; i++) {
        for (let j = i + 1; j < pearls.length; j++) {
          const a = pearls[i];
          const b = pearls[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance >= maxDistance) continue;
          const alpha = (1 - distance / maxDistance) * 0.12 * Math.min(a.depth, b.depth);
          ctx.strokeStyle = `rgba(91,141,191,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    };

    const drawDust = () => {
      for (const mote of dust) {
        const twinkle = reducedMotion ? 0.45 : 0.42 + Math.sin(elapsed * mote.speed + mote.phase) * 0.38;
        const parallaxX = pointer.active ? (pointer.x - canvas.width / 2) * 0.006 * mote.depth : 0;
        const parallaxY = pointer.active ? (pointer.y - canvas.height / 2) * 0.004 * mote.depth : 0;
        const x = mote.x + parallaxX;
        const y = mote.y + parallaxY;
        const alpha = Math.max(0.03, mote.opacity * twinkle);

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, mote.radius * (0.8 + mote.depth * 0.25), 0, Math.PI * 2);
        ctx.fill();

        if (mote.radius > 1.5 && alpha > 0.18) {
          ctx.strokeStyle = `rgba(91,141,191,${alpha * 0.34})`;
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();
        }
      }
    };

    const drawPearl = (pearl: Pearl) => {
      const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed * 0.7 + pearl.phase) * 0.025;
      const size = pearl.radius * 3.2 * pulse;
      const sprite = pearlSprites[pearl.palette];

      ctx.globalAlpha = pearl.opacity;
      ctx.drawImage(sprite, pearl.x - size / 2, pearl.y - size / 2, size, size);
      ctx.globalAlpha = 1;

      if (pearl.ring) {
        ctx.save();
        ctx.translate(pearl.x, pearl.y);
        ctx.rotate(pearl.phase * 0.28 + elapsed * 0.018 * pearl.depth);
        ctx.scale(1, 0.32 + pearl.depth * 0.08);
        ctx.strokeStyle = `rgba(255,255,255,${0.2 * pearl.opacity})`;
        ctx.lineWidth = Math.max(0.5, 0.7 * scale);
        ctx.beginPath();
        ctx.arc(0, 0, pearl.radius * 0.94, 0.25, Math.PI * 1.48);
        ctx.stroke();
        ctx.strokeStyle = `rgba(91,141,191,${0.11 * pearl.opacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, pearl.radius * 1.08, Math.PI * 1.12, Math.PI * 1.9);
        ctx.stroke();
        ctx.restore();
      }
    };

    const render = (timestamp: number) => {
      if (!running) return;
      animId = requestAnimationFrame(render);
      if (timestamp - lastFrame < frameInterval) return;

      const delta = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.05) : 0.016;
      lastFrame = timestamp;
      elapsed += delta;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.07;
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.14;
        pointer.y += (pointer.targetY - pointer.y) * 0.14;
      }

      if (pointer.strength > 0.02 && !touch && !reducedMotion) {
        const haloSize = 260 * scale;
        ctx.globalAlpha = pointer.strength * 0.7;
        ctx.drawImage(pointerHalo, pointer.x - haloSize / 2, pointer.y - haloSize / 2, haloSize, haloSize);
        ctx.globalAlpha = 1;
      }

      drawDust();

      for (const pearl of pearls) {
        if (!reducedMotion) {
          const driftX = Math.sin(elapsed * pearl.drift + pearl.phase) * 10 * pearl.depth;
          const driftY = Math.cos(elapsed * pearl.drift * 0.78 + pearl.phase * 1.3) * 8 * pearl.depth;
          const targetX = pearl.baseX + driftX;
          const targetY = pearl.baseY + driftY;

          pearl.vx += (targetX - pearl.x) * 0.0028;
          pearl.vy += (targetY - pearl.y) * 0.0028;

          if (pointer.active) {
            const dx = pearl.x - pointer.x;
            const dy = pearl.y - pointer.y;
            const distance = Math.max(1, Math.hypot(dx, dy));
            if (distance < POINTER_RADIUS * scale) {
              const proximity = 1 - distance / (POINTER_RADIUS * scale);
              const force = proximity * proximity * (0.11 + pearl.depth * 0.08);
              pearl.vx += (dx / distance) * force;
              pearl.vy += (dy / distance) * force;
            }

            const sceneX = (pointer.x - canvas.width / 2) * 0.00016 * pearl.depth;
            const sceneY = (pointer.y - canvas.height / 2) * 0.00012 * pearl.depth;
            pearl.vx += sceneX;
            pearl.vy += sceneY;
          }

          pearl.vx *= 0.925;
          pearl.vy *= 0.925;
          pearl.x += pearl.vx;
          pearl.y += pearl.vy;
        }
      }

      drawConnections();

      const orderedPearls = [...pearls].sort((a, b) => a.depth - b.depth);
      for (const pearl of orderedPearls) drawPearl(pearl);
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
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0.01 });
    intersectionObserver.observe(canvas);

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    if (!touch && !reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
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
