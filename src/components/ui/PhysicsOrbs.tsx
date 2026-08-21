'use client';

import { useEffect, useRef } from 'react';

type RGB = [number, number, number];

interface Orb {
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
  hero: boolean;
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

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  width: number;
  phase: number;
  palette: number;
  opacity: number;
}

const PALETTES: RGB[] = [
  [70, 126, 255],
  [95, 210, 255],
  [155, 105, 255],
  [42, 218, 205],
  [255, 157, 100],
  [255, 94, 168],
];

const SPRITE_SIZE = 320;
const POINTER_RADIUS = 260;

function rgba([r, g, b]: RGB, alpha: number) {
  return `rgba(${r},${g},${b},${alpha})`;
}

function makeOrbSprite(color: RGB) {
  const sprite = document.createElement('canvas');
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;

  const c = SPRITE_SIZE / 2;

  const aura = ctx.createRadialGradient(c, c, 4, c, c, c);
  aura.addColorStop(0, rgba(color, 0.34));
  aura.addColorStop(0.34, rgba(color, 0.2));
  aura.addColorStop(0.68, rgba(color, 0.075));
  aura.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  const body = ctx.createRadialGradient(c * 0.68, c * 0.59, 3, c, c, c * 0.68);
  body.addColorStop(0, 'rgba(255,255,255,1)');
  body.addColorStop(0.055, 'rgba(255,255,255,0.98)');
  body.addColorStop(0.16, rgba(color, 0.9));
  body.addColorStop(0.39, rgba(color, 0.55));
  body.addColorStop(0.68, rgba(color, 0.22));
  body.addColorStop(0.9, rgba(color, 0.05));
  body.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.69, 0, Math.PI * 2);
  ctx.fill();

  const rim = ctx.createRadialGradient(c, c, c * 0.48, c, c, c * 0.7);
  rim.addColorStop(0, 'rgba(255,255,255,0)');
  rim.addColorStop(0.62, rgba(color, 0.08));
  rim.addColorStop(0.79, 'rgba(255,255,255,0.6)');
  rim.addColorStop(0.9, rgba(color, 0.24));
  rim.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.71, 0, Math.PI * 2);
  ctx.fill();

  const prism = ctx.createLinearGradient(c * 0.42, c * 0.38, c * 1.35, c * 1.4);
  prism.addColorStop(0, 'rgba(103,210,255,0.42)');
  prism.addColorStop(0.33, 'rgba(255,255,255,0.05)');
  prism.addColorStop(0.62, 'rgba(184,112,255,0.28)');
  prism.addColorStop(1, 'rgba(255,121,176,0.08)');
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = prism;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.58, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  const highlight = ctx.createRadialGradient(c * 0.64, c * 0.54, 0, c * 0.64, c * 0.54, c * 0.24);
  highlight.addColorStop(0, 'rgba(255,255,255,1)');
  highlight.addColorStop(0.22, 'rgba(255,255,255,0.7)');
  highlight.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  highlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  return sprite;
}

function makeHaloSprite() {
  const sprite = document.createElement('canvas');
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;

  const c = SPRITE_SIZE / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  gradient.addColorStop(0, 'rgba(255,255,255,0.42)');
  gradient.addColorStop(0.12, 'rgba(73,180,255,0.24)');
  gradient.addColorStop(0.32, 'rgba(153,101,255,0.14)');
  gradient.addColorStop(0.56, 'rgba(255,101,174,0.07)');
  gradient.addColorStop(1, 'rgba(70,126,255,0)');
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
    const orbSprites = PALETTES.map(makeOrbSprite);
    const haloSprite = makeHaloSprite();

    let orbs: Orb[] = [];
    let dust: Dust[] = [];
    let comets: Comet[] = [];
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

    const frameInterval = reducedMotion ? 1000 / 10 : touch ? 1000 / 30 : 1000 / 44;

    const resetComet = (comet: Comet, w: number, h: number, stagger = false) => {
      const fromLeft = Math.random() > 0.35;
      comet.x = fromLeft ? -w * (0.08 + Math.random() * 0.25) : w * (1.08 + Math.random() * 0.25);
      comet.y = h * (0.08 + Math.random() * 0.7);
      const speed = w * (0.00009 + Math.random() * 0.00007);
      comet.vx = (fromLeft ? 1 : -1) * speed;
      comet.vy = speed * (0.14 + Math.random() * 0.25);
      comet.length = w * (0.06 + Math.random() * 0.08);
      comet.width = 0.7 + Math.random() * 1.15;
      comet.phase = Math.random() * Math.PI * 2 + (stagger ? Math.random() * 8 : 0);
      comet.palette = Math.floor(Math.random() * PALETTES.length);
      comet.opacity = 0.4 + Math.random() * 0.5;
    };

    const initScene = (w: number, h: number) => {
      const orbCount = reducedMotion ? 7 : touch ? 11 : 18;
      const dustCount = reducedMotion ? 18 : touch ? 38 : 72;
      const cometCount = reducedMotion ? 0 : touch ? 2 : 4;

      orbs = Array.from({ length: orbCount }, (_, i) => {
        const hero = i < (touch ? 3 : 5);
        const depth = hero ? 1.15 + Math.random() * 0.45 : 0.55 + Math.random() * 0.8;
        const radius = hero
          ? 52 + Math.random() * 46
          : 18 + Math.random() * 46;

        const edgeBias = hero && i % 2 === 0;
        const baseX = edgeBias
          ? w * (i % 4 === 0 ? 0.08 + Math.random() * 0.13 : 0.79 + Math.random() * 0.13)
          : w * (0.04 + Math.random() * 0.92);
        const baseY = h * (0.06 + Math.random() * 0.86);

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
          drift: 0.18 + Math.random() * 0.34,
          opacity: hero ? 0.82 + Math.random() * 0.16 : 0.58 + Math.random() * 0.34,
          palette: i % PALETTES.length,
          ring: hero || (!touch && i < 9),
          hero,
        };
      });

      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 0.7 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.28 + Math.random() * 1.15,
        opacity: 0.18 + Math.random() * 0.62,
        depth: 0.35 + Math.random() * 1.15,
      }));

      comets = Array.from({ length: cometCount }, () => ({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        length: 0,
        width: 1,
        phase: 0,
        palette: 0,
        opacity: 0.7,
      }));
      comets.forEach((comet) => resetComet(comet, w, h, true));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      scale = touch ? 0.7 : 0.82;
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

    const drawAurora = () => {
      if (reducedMotion) return;

      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineCap = 'round';

      const ribbons: Array<{ color: string; y: number; amp: number; width: number; speed: number }> = [
        { color: 'rgba(74,153,255,0.13)', y: 0.29, amp: 0.055, width: 36, speed: 0.18 },
        { color: 'rgba(158,105,255,0.105)', y: 0.55, amp: 0.07, width: 30, speed: 0.14 },
        { color: 'rgba(37,218,205,0.085)', y: 0.74, amp: 0.05, width: 22, speed: 0.22 },
      ];

      for (let pass = 0; pass < 2; pass++) {
        for (let r = 0; r < ribbons.length; r++) {
          const ribbon = ribbons[r];
          ctx.beginPath();
          const segments = 18;
          for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * canvas.width;
            const phase = elapsed * ribbon.speed + r * 1.9;
            const y = canvas.height * ribbon.y
              + Math.sin((i / segments) * Math.PI * 2.2 + phase) * canvas.height * ribbon.amp
              + Math.cos((i / segments) * Math.PI * 4.3 - phase * 0.7) * canvas.height * ribbon.amp * 0.35;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = ribbon.color;
          ctx.lineWidth = ribbon.width * scale * (pass === 0 ? 1.5 : 0.42);
          ctx.shadowColor = ribbon.color.replace(/0\.\d+\)/, '0.55)');
          ctx.shadowBlur = pass === 0 ? 28 * scale : 8 * scale;
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const drawDust = () => {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (const mote of dust) {
        const twinkle = reducedMotion ? 0.55 : 0.52 + Math.sin(elapsed * mote.speed + mote.phase) * 0.48;
        const px = pointer.active ? (pointer.x - canvas.width / 2) * 0.012 * mote.depth : 0;
        const py = pointer.active ? (pointer.y - canvas.height / 2) * 0.008 * mote.depth : 0;
        const x = mote.x + px;
        const y = mote.y + py;
        const alpha = Math.max(0.04, mote.opacity * twinkle);
        const radius = mote.radius * (0.75 + mote.depth * 0.3);

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (radius > 1.55 && alpha > 0.3) {
          const arm = 3.5 + radius * 1.7;
          ctx.strokeStyle = `rgba(92,171,255,${alpha * 0.55})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(x - arm, y);
          ctx.lineTo(x + arm, y);
          ctx.moveTo(x, y - arm);
          ctx.lineTo(x, y + arm);
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const drawComets = (delta: number) => {
      if (!comets.length) return;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      for (const comet of comets) {
        comet.x += comet.vx * delta * 1000;
        comet.y += comet.vy * delta * 1000;

        if (
          comet.x < -comet.length * 2 ||
          comet.x > canvas.width + comet.length * 2 ||
          comet.y > canvas.height + comet.length
        ) {
          resetComet(comet, canvas.width, canvas.height);
        }

        const speed = Math.hypot(comet.vx, comet.vy) || 1;
        const nx = comet.vx / speed;
        const ny = comet.vy / speed;
        const tailX = comet.x - nx * comet.length;
        const tailY = comet.y - ny * comet.length;
        const color = PALETTES[comet.palette];
        const gradient = ctx.createLinearGradient(tailX, tailY, comet.x, comet.y);
        gradient.addColorStop(0, rgba(color, 0));
        gradient.addColorStop(0.56, rgba(color, comet.opacity * 0.2));
        gradient.addColorStop(0.88, rgba(color, comet.opacity * 0.78));
        gradient.addColorStop(1, 'rgba(255,255,255,1)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = comet.width * scale;
        ctx.shadowColor = rgba(color, 0.9);
        ctx.shadowBlur = 12 * scale;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(comet.x, comet.y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 1.8 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawConnections = () => {
      if (touch || reducedMotion) return;
      const maxDistance = 185 * scale;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = Math.max(0.5, 0.8 * scale);

      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const a = orbs[i];
          const b = orbs[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance >= maxDistance) continue;
          const alpha = (1 - distance / maxDistance) * 0.24 * Math.min(a.depth, b.depth);
          ctx.strokeStyle = `rgba(83,156,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const drawOrb = (orb: Orb) => {
      const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed * (orb.hero ? 0.85 : 1.25) + orb.phase) * (orb.hero ? 0.055 : 0.035);
      const size = orb.radius * (orb.hero ? 4.25 : 3.65) * pulse;
      const sprite = orbSprites[orb.palette];

      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = orb.opacity;
      ctx.drawImage(sprite, orb.x - size / 2, orb.y - size / 2, size, size);
      ctx.globalAlpha = 1;

      if (orb.ring) {
        ctx.translate(orb.x, orb.y);
        ctx.rotate(orb.phase * 0.36 + elapsed * (orb.hero ? 0.11 : 0.055) * orb.depth);
        ctx.scale(1, 0.3 + orb.depth * 0.045);
        const ringRadius = orb.radius * (orb.hero ? 1.35 : 1.05);

        ctx.lineWidth = Math.max(0.7, (orb.hero ? 1.3 : 0.8) * scale);
        ctx.shadowBlur = orb.hero ? 12 * scale : 5 * scale;
        ctx.shadowColor = 'rgba(87,173,255,0.8)';
        ctx.strokeStyle = `rgba(255,255,255,${orb.hero ? 0.62 : 0.32})`;
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0.12, Math.PI * 1.52);
        ctx.stroke();

        ctx.shadowColor = 'rgba(170,101,255,0.65)';
        ctx.strokeStyle = `rgba(142,103,255,${orb.hero ? 0.42 : 0.2})`;
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius * 1.13, Math.PI * 1.04, Math.PI * 1.92);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawPointerVortex = () => {
      if (pointer.strength < 0.02 || touch || reducedMotion) return;

      const haloSize = 390 * scale;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = pointer.strength * 0.96;
      ctx.drawImage(haloSprite, pointer.x - haloSize / 2, pointer.y - haloSize / 2, haloSize, haloSize);
      ctx.globalAlpha = 1;

      for (let ring = 0; ring < 3; ring++) {
        const radius = (48 + ring * 28 + Math.sin(elapsed * 1.5 + ring) * 5) * scale;
        ctx.strokeStyle = ring === 0
          ? `rgba(255,255,255,${0.3 * pointer.strength})`
          : ring === 1
            ? `rgba(85,187,255,${0.24 * pointer.strength})`
            : `rgba(168,105,255,${0.18 * pointer.strength})`;
        ctx.lineWidth = Math.max(0.6, (1.15 - ring * 0.2) * scale);
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, radius, elapsed * (0.18 + ring * 0.04), Math.PI * (1.15 + ring * 0.2));
        ctx.stroke();
      }

      ctx.restore();
    };

    const render = (timestamp: number) => {
      if (!running) return;
      animId = requestAnimationFrame(render);
      if (timestamp - lastFrame < frameInterval) return;

      const delta = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.05) : 0.016;
      lastFrame = timestamp;
      elapsed += delta;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.09;
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.18;
        pointer.y += (pointer.targetY - pointer.y) * 0.18;
      }

      drawAurora();
      drawDust();
      drawComets(delta);
      drawPointerVortex();

      for (const orb of orbs) {
        if (reducedMotion) continue;

        const driftX = Math.sin(elapsed * orb.drift + orb.phase) * (orb.hero ? 18 : 12) * orb.depth;
        const driftY = Math.cos(elapsed * orb.drift * 0.76 + orb.phase * 1.2) * (orb.hero ? 14 : 9) * orb.depth;
        const targetX = orb.baseX + driftX;
        const targetY = orb.baseY + driftY;

        orb.vx += (targetX - orb.x) * (orb.hero ? 0.0022 : 0.003);
        orb.vy += (targetY - orb.y) * (orb.hero ? 0.0022 : 0.003);

        if (pointer.active) {
          const dx = orb.x - pointer.x;
          const dy = orb.y - pointer.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const radius = POINTER_RADIUS * scale * (orb.hero ? 1.25 : 1);

          if (distance < radius) {
            const proximity = 1 - distance / radius;
            const force = proximity * proximity * (orb.hero ? 0.31 : 0.2) * orb.depth;
            const direction = orb.hero ? -1 : 1;
            orb.vx += (dx / distance) * force * direction;
            orb.vy += (dy / distance) * force * direction;

            const tangent = force * 0.72;
            orb.vx += (-dy / distance) * tangent;
            orb.vy += (dx / distance) * tangent;
          }

          orb.vx += (pointer.x - canvas.width / 2) * 0.00017 * orb.depth;
          orb.vy += (pointer.y - canvas.height / 2) * 0.00012 * orb.depth;
        }

        orb.vx *= orb.hero ? 0.94 : 0.925;
        orb.vy *= orb.hero ? 0.94 : 0.925;
        orb.x += orb.vx;
        orb.y += orb.vy;
      }

      drawConnections();

      const ordered = [...orbs].sort((a, b) => a.depth - b.depth);
      for (const orb of ordered) drawOrb(orb);
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
