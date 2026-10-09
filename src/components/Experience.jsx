import { OrbitControls, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { MeshBasicNodeMaterial } from "three/webgpu";

const modelPath = "/models/pulsethreeJSExportBaked.gltf";

const useBakedScene = (scene) =>
  useMemo(() => {
    scene.traverse((child) => {
      if (!child.isMesh || child.material.isMeshBasicNodeMaterial) return;

      const source = child.material;
      child.material = new MeshBasicNodeMaterial({
        name: source.name,
        map: source.map,
        color: source.map ? 0xffffff : source.color,
        side: source.side,
        transparent: source.transparent,
        alphaTest: source.alphaTest,
        toneMapped: false,
      });
      source.dispose();
    });

    return scene;
  }, [scene]);

export const Experience = () => {
  const { scene } = useGLTF(modelPath);
  const bakedScene = useBakedScene(scene);

  return (
    <>
      <OrbitControls target={[-1.4, 4.5, 3.5]} />
      <primitive object={bakedScene} />
    </>
  );
};

useGLTF.preload(modelPath);
