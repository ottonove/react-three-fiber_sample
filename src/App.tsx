import * as React from "react";

import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton";

import { Canvas, useFrame, useThree } from "react-three-fiber";

import { Box, Cylinder, Plane, Sphere } from "./components/Shapes";

interface XRSystem {
  isSessionSupported(sessionType: string): Promise<null>;
}
declare global {
  interface Navigator {
    xr: XRSystem;
  }
}

const PI_2 = Math.PI / 2;
const Camera = () => {
  const { camera, gl } = useThree();
  const previousEvent = React.useRef<MouseEvent>();
  const dragging = React.useRef(false);
  const yawObject = React.useRef(new THREE.Object3D());
  const pitchObject = React.useRef(new THREE.Object3D());

  React.useEffect(() => {
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  React.useEffect(() => {
    yawObject.current.add(pitchObject.current);
    function mouseDown(event: MouseEvent) {
      dragging.current = true;
      previousEvent.current = event;
    }

    function mouseMove(event: MouseEvent) {
      if (dragging.current && previousEvent.current) {
        const movementX = event.screenX - previousEvent.current.screenX;
        const movementY = event.screenY - previousEvent.current.screenY;
        const direction = -1;
        yawObject.current.rotation.y += movementX * 0.002 * direction;
        pitchObject.current.rotation.x += movementY * 0.002 * direction;
        pitchObject.current.rotation.x = Math.max(
          -PI_2,
          Math.min(PI_2, pitchObject.current.rotation.x)
        );
      }

      previousEvent.current = event;
    }
    function mouseUp() {
      previousEvent.current = undefined;
      dragging.current = false;
    }
    gl.domElement.addEventListener("mousedown", mouseDown, false);
    gl.domElement.addEventListener("mousemove", mouseMove, false);
    gl.domElement.addEventListener("mouseup", mouseUp, false);

    return () => {
      gl.domElement.removeEventListener("mousedown", mouseDown);
      gl.domElement.removeEventListener("mousemove", mouseMove);
      gl.domElement.removeEventListener("mouseup", mouseUp);
    };
  }, [gl.domElement]);

  useFrame(() => {
    camera.rotation.x = pitchObject.current.rotation.x;
    camera.rotation.y = yawObject.current.rotation.y;
  });

  return <group />;
};

export default function App() {
  return (
    <Canvas
      vr
      pixelRatio={window.devicePixelRatio}
      camera={{
        fov: 80,
        position: [0, 1.6, 0],
        near: 0.005,
        far: 10000
      }}
      onCreated={(data: any) => {
        const gl: THREE.WebGLRenderer = data.gl;
        if (navigator.xr) {
          document.body.appendChild(VRButton.createButton(gl));
        }
        gl.setClearColor("#FAFAFA");
      }}
      style={{
        position: "fixed",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0
      }}
      shadowMap
    >
      <Camera />
      <ambientLight args={["#BBBBBB", 1]} />
      <directionalLight
        args={["#FFFFFF", 0.6]}
        position={[-0.5, 1, 1]}
        castShadow
      />
      <Box
        position={[-1, 0.5, -3]}
        args={[1, 1, 1]}
        rotation={[0, THREE.MathUtils.degToRad(45), 0]}
        color="#4CC3D9"
        castShadow
      />
      <Sphere
        position={[0, 1.25, -5]}
        args={[1.25, 36, 18]}
        color="#EF2D5E"
        castShadow
      />
      <Cylinder
        position={[1, 0.5, -3]}
        args={[0.5, 0.5, 1.5, 16]}
        color="#FFC65D"
        castShadow
      />
      <Plane
        args={[4, 4]}
        position={[0, 0, -4]}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
        color="#7BC8A4"
        receiveShadow
      />
    </Canvas>
  );
}
