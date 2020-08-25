import * as React from "react";
import * as THREE from "three";

import { Overwrite, ReactThreeFiber } from "react-three-fiber";

// type for extending ReactThreeFiber Object3DNode props
type MeshShape<T extends new (...args: any) => any, P = {}> = Overwrite<
  ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>,
  {
    args?: ConstructorParameters<T>;
  } & P
>;

type PlaneProps = MeshShape<
  typeof THREE.PlaneBufferGeometry,
  {
    color?: ReactThreeFiber.Color;
  }
>;
export const Plane = ({ args, color, ...props }: PlaneProps) => {
  const ref = React.useRef();
  return (
    <mesh ref={ref} {...props}>
      <planeBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
};

type IBox = MeshShape<
  typeof THREE.BoxBufferGeometry,
  {
    color?: ReactThreeFiber.Color;
  }
>;
export const Box = ({ args, color, ...props }: IBox) => {
  return (
    <mesh {...props}>
      <boxBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={color} roughness={0.5} />
    </mesh>
  );
};

type ISphere = MeshShape<
  typeof THREE.SphereBufferGeometry,
  {
    color?: ReactThreeFiber.Color;
  }
>;
export const Sphere = ({ args, color, ...props }: ISphere) => {
  return (
    <mesh {...props}>
      <sphereBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={color} roughness={0.5} />
    </mesh>
  );
};

type ICylinder = MeshShape<
  typeof THREE.CylinderBufferGeometry,
  {
    color?: ReactThreeFiber.Color;
  }
>;
export const Cylinder = ({ args, color, ...props }: ICylinder) => {
  return (
    <mesh {...props}>
      <cylinderBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={color} roughness={0.5} />
    </mesh>
  );
};
