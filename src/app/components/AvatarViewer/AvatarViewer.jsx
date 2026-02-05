"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  Suspense,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

/* -------------------- AVATAR MODEL -------------------- */

function AvatarModel({ currentAction }) {
  const modelRef = useRef();
  const previousAction = useRef(null);

  const { scene, animations } = useGLTF("/animation-models/base-avatar.glb");

  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (!animations) return;

    animations.forEach((clip) => {
      clip.tracks = clip.tracks.filter((track) => {
        const isPositionTrack = track.name.endsWith(".position");

        return !isPositionTrack;
      });
    });
  }, [animations]);

  useEffect(() => {
    if (!actions || !currentAction) return;

    if (previousAction.current && actions[previousAction.current]) {
      actions[previousAction.current].fadeOut(0.2);
    }

    const action = actions[currentAction];

    if (!action) {
      console.warn("Missing animation:", currentAction);
      return;
    }

    action.reset();
    action.fadeIn(0.2);

    const oneShotActions = ["Jumping", "Salute", "DropKick"];

    if (oneShotActions.includes(currentAction)) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();

      const mixer = action.getMixer();
      const onFinished = () => {
        action.fadeOut(0.2);
        mixer.removeEventListener("finished", onFinished);
      };

      mixer.addEventListener("finished", onFinished);
    } else {
      action.setLoop(THREE.LoopRepeat);
      action.play();
    }

    previousAction.current = currentAction;
  }, [actions, currentAction]);

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
  const [currentAction, setCurrentAction] = useState("Waving");
  const [isRotating, setIsRotating] = useState(false);

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
      setCurrentAction(actionMap[action] || "Waving");
    },

    toggleRotate() {
      if (!controlsRef.current) return;
      const next = !isRotating;
      controlsRef.current.autoRotate = next;
      controlsRef.current.autoRotateSpeed = 2;
      setIsRotating(next);
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
      setCurrentAction("Waving");
      setIsRotating(false);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }
    },
  }));

  return (
    <Canvas camera={{ position: [0, 1.6, 4], fov: 45 }} dpr={[1, 1.5]} shadows>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, 5]} intensity={0.8} />

      <Suspense fallback={null}>
        <AvatarModel currentAction={currentAction} />
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
  );
});

export default AvatarViewer;
