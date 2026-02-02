'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function AvatarModel() {
  const { scene } = useGLTF('/animation-models/default-character.glb');

  return (
    <primitive
      object={scene}
      scale={1.2}
      position={[0, -1.5, 0]}
    />
  );
}

const AvatarViewer = forwardRef(function AvatarViewer(_, ref) {
  const controlsRef = useRef();

  useImperativeHandle(ref, () => ({
    rotate() {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 2;
      }
    },
    stopRotate: () => {
      if (!controlsRef.current) return;
      controlsRef.current.autoRotate = false;
    },
    zoomIn() {
      if (controlsRef.current?.object) {
        controlsRef.current.object.position.z -= 0.5;
      }
    },
    zoomOut() {
      if (controlsRef.current?.object) {
        controlsRef.current.object.position.z += 0.5;
      }
    },
    reset() {
      controlsRef.current?.reset();
    },
  }));

  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <AvatarModel />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableRotate
        enableZoom
      />
    </Canvas>
  );
});

export default AvatarViewer;
