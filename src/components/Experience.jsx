import { Environment, OrbitControls } from "@react-three/drei";
import { color } from "three/tsl";

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <mesh>
        <boxGeometry />
        <meshStandardNodeMaterial colorNode={color("pink")} />
      </mesh>
    </>
  );
};
