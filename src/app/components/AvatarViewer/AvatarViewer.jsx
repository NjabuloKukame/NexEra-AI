"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
function AvatarModel({ currentAction, onAnimationFinished }) {
  const modelRef = useRef();
  const previousAction = useRef(null);

  const { scene, animations } = useGLTF("/animation-models/base-avatar.glb");
  const { actions } = useAnimations(animations, modelRef);

  // Aggressive Root Motion Fix: Removes drifting from all animations
  useEffect(() => {
    if (!animations) return;
    animations.forEach((clip) => {
      clip.tracks = clip.tracks.filter((track) => !track.name.endsWith(".position"));
    });
  }, [animations]);

  // Animation Logic
  useEffect(() => {
    
    if (!actions || !currentAction) {
      if (previousAction.current && actions[previousAction.current]) {
        actions[previousAction.current].fadeOut(0.5);
      }
      return;
    }

    if (previousAction.current && actions[previousAction.current]) {
      actions[previousAction.current].fadeOut(0.2);
    }

    const action = actions[currentAction];
    if (!action) {
      console.warn("Missing Animation:", currentAction);
      return;
    }

    action.reset().fadeIn(0.2);

    const oneShotActions = ["Jumping", "Salute", "DropKick"];

    if (oneShotActions.includes(currentAction)) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();

      const mixer = action.getMixer();
      const onFinished = () => {
        action.fadeOut(0.5);
        if (onAnimationFinished) onAnimationFinished(); 
        mixer.removeEventListener("finished", onFinished);
      };
      mixer.addEventListener("finished", onFinished);
    } else {
      action.setLoop(THREE.LoopRepeat);
      action.play();
    }

    previousAction.current = currentAction;
  }, [actions, currentAction, onAnimationFinished]);

  // Shadow and Frustum Fix
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.frustumCulled = false;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1}
      position={[0, -1.4, 0]}
    />
  );
}

const AvatarViewer = forwardRef(function AvatarViewer(_, ref) {
  const controlsRef = useRef();
  
  const [currentAction, setCurrentAction] = useState(null); 
  const [statusText, setStatusText] = useState("Waiting For Command...");

  const actionMap = {
    walkForward: "Walking",
    walkBackward: "WalkingBackwards",
    wave: "Waving",
    point: "Pointing",
    jump: "Jumping",
    dance: "Dance",
    salute: "Salute",
    dropKick: "DropKick",
    climb: "Climbing",
    jog: "Jogging",
  };

  useImperativeHandle(ref, () => ({
    playAnimation(action) {
      const target = actionMap[action];
      if (target) {
        setCurrentAction(target);
        setStatusText(`Performing: ${target}`);
      } else {
        setStatusText(`Unsupported Command. Try: Walk, Wave ...`);
        setCurrentAction(null);
      }
    },

    toggleRotate() {
      if (!controlsRef.current) return;
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
    },

    zoomIn() {
      if (!controlsRef.current) return;
      controlsRef.current.object.position.z -= 0.4;
    },

    zoomOut() {
      if (!controlsRef.current) return;
      controlsRef.current.object.position.z += 0.4;
    },

    reset() {
      controlsRef.current?.reset();
      setCurrentAction(null);
      setStatusText("Waiting For Command...");
    },
  }));

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      
      {/* UI Overlay for feedback */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        color: 'white',
        background: '#000',
        border: '1px solid rgba(52, 211, 153, 0.4)',
        backdropFilter: 'blur(12px)',
        padding: '12px 20px',
        borderRadius: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '0.5px',
        maxWidth: '300px',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#fff',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></div>
          {statusText}
        </div>
      </div>

      <Canvas camera={{ position: [0, 1.6, 4], fov: 45 }} dpr={[1, 1.5]} shadows>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.8} />

        <Suspense fallback={null}>
          <AvatarModel 
            currentAction={currentAction} 
            onAnimationFinished={() => {
              setCurrentAction(null); // Stop animating
              setStatusText("Animation Complete. Type Another Command.");
            }}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
});

export default AvatarViewer;