'use client';

import { Suspense } from 'react';
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';

interface ShapeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  speed?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
}

function GlassSphere({ position, rotation, speed = 1, floatIntensity = 0.8, rotationIntensity = 0.3 }: ShapeProps) {
  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <mesh position={position} rotation={rotation}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.5}
          roughness={0.02}
          chromaticAberration={0.04}
          distortion={0.2}
          temporalDistortion={0.1}
          resolution={512}
          backside
          backsideThickness={0.3}
          color="#EAF2FB"
          ior={1.5}
          reflectivity={0.2}
        />
      </mesh>
    </Float>
  );
}

function GlassTorus({ position, rotation, speed = 1, floatIntensity = 0.8, rotationIntensity = 0.3 }: ShapeProps) {
  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <mesh position={position} rotation={rotation}>
        <torusGeometry args={[0.65, 0.22, 32, 64]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.4}
          roughness={0.01}
          chromaticAberration={0.03}
          distortion={0.15}
          temporalDistortion={0.08}
          resolution={512}
          backside
          backsideThickness={0.25}
          color="#D6E8F7"
          ior={1.5}
          reflectivity={0.2}
        />
      </mesh>
    </Float>
  );
}

function GlassBox({ position, rotation, speed = 1, floatIntensity = 0.8, rotationIntensity = 0.3 }: ShapeProps) {
  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[0.85, 1.2, 0.65]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.5}
          roughness={0.03}
          chromaticAberration={0.05}
          distortion={0.18}
          temporalDistortion={0.09}
          resolution={256}
          backside
          backsideThickness={0.3}
          color="#F0F6FC"
          ior={1.5}
          reflectivity={0.15}
        />
      </mesh>
    </Float>
  );
}

function GlassSmallSphere({ position, rotation, speed = 1, floatIntensity = 0.8, rotationIntensity = 0.3 }: ShapeProps) {
  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <mesh position={position} rotation={rotation}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.3}
          roughness={0.01}
          chromaticAberration={0.06}
          distortion={0.25}
          temporalDistortion={0.12}
          resolution={256}
          backside
          backsideThickness={0.2}
          color="#DCEEFA"
          ior={1.6}
          reflectivity={0.25}
        />
      </mesh>
    </Float>
  );
}

function GlassIco({ position, rotation, speed = 1, floatIntensity = 0.8, rotationIntensity = 0.3 }: ShapeProps) {
  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <mesh position={position} rotation={rotation}>
        <icosahedronGeometry args={[0.55, 1]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.45}
          roughness={0.0}
          chromaticAberration={0.04}
          distortion={0.22}
          temporalDistortion={0.1}
          resolution={256}
          backside
          backsideThickness={0.28}
          color="#E6F0FA"
          ior={1.5}
          reflectivity={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingShapes() {
  return (
    <Suspense fallback={null}>
      <Environment preset="city" />
      <ambientLight intensity={0.6} color="#EAF2FB" />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#5B8DBF" />
      <pointLight position={[3, 3, 3]} intensity={0.5} color="#E8F1F8" />

      <GlassSphere
        position={[-2.8, 0.9, -1.2]}
        rotation={[0.2, 0.4, 0.1]}
        speed={1.1}
        floatIntensity={0.7}
        rotationIntensity={0.2}
      />
      <GlassTorus
        position={[2.5, -0.6, -0.8]}
        rotation={[0.5, 0.2, 0.4]}
        speed={0.8}
        floatIntensity={0.9}
        rotationIntensity={0.4}
      />
      <GlassBox
        position={[-1.0, -1.9, -2.2]}
        rotation={[0.15, 0.5, 0.2]}
        speed={1.4}
        floatIntensity={0.6}
        rotationIntensity={0.3}
      />
      <GlassSmallSphere
        position={[2.0, 1.8, -1.1]}
        rotation={[0, 0, 0]}
        speed={1.8}
        floatIntensity={1.2}
        rotationIntensity={0.5}
      />
      <GlassIco
        position={[0.4, -0.7, -1.6]}
        rotation={[0.3, 0.5, 0.1]}
        speed={1.0}
        floatIntensity={0.8}
        rotationIntensity={0.35}
      />
    </Suspense>
  );
}
