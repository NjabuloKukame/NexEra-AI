'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { ASSET_MAP } from '@/app/lib/assets';

// Preload common models for faster loading
Object.values(ASSET_MAP).forEach(asset => {
  if (asset && asset.url) useGLTF.preload(asset.url);
});

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const ModelViewer = forwardRef(function ModelViewer({ modelUrl }, ref) {
  const controlsRef = useRef();

  useImperativeHandle(ref, () => ({
    rotate: () => {
      if (!controlsRef.current) return;
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
    },

    stopRotate: () => {
      if (!controlsRef.current) return;
      controlsRef.current.autoRotate = false;
    },

    zoomIn: () => {
      if (!controlsRef.current) return;
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    },

    zoomOut: () => {
      if (!controlsRef.current) return;
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    },

    reset: () => {
      if (!controlsRef.current) return;
      controlsRef.current.reset();
    },
  }));

  if (!modelUrl) return null;

  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Model url={modelUrl} />
      <OrbitControls ref={controlsRef} enablePan={false} minDistance={1} maxDistance={8}/>
    </Canvas>
  );
});

export default ModelViewer;
