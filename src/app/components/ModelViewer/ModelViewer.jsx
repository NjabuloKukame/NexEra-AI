'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({ modelUrl }) {
  if (!modelUrl) return null;

  return (
    <Canvas
      camera={{ position: [0, 1.5, 3], fov: 50 }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Model url={modelUrl} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
