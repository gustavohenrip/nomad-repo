'use client';

import { Canvas } from '@react-three/fiber';
import FloatingShapes from './FloatingShapes';

export default function GlassScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      <FloatingShapes />
    </Canvas>
  );
}
