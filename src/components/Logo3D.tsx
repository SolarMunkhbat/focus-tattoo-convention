"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/logo.glb";

function RotatingLogo() {
  const spinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    // Spin is on the outer group so it turns around the true world Y (vertical)
    // axis; the inner group's tilt just orients the model face-on before that
    // spin is applied — if the tilt were outermost, "rotation.y" would spin
    // around the model's own tilted axis instead of a true vertical one.
    <group ref={spinRef}>
      <group rotation={[Math.PI / 2 - 0.15, 0, (20 * Math.PI) / 180]}>
        <Center>
          <primitive object={scene} scale={1.1} />
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export default function Logo3D() {
  return (
    <div className="h-64 sm:h-72 lg:h-80 w-full">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 110 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 2]} intensity={1.6} color="#fff4da" />
        <directionalLight position={[-3, -1, -2]} intensity={0.5} color="#8a6cff" />
        <pointLight position={[0, 2, 3]} intensity={0.6} color="#e8b04b" />
        <Suspense fallback={null}>
          <RotatingLogo />
        </Suspense>
      </Canvas>
    </div>
  );
}
