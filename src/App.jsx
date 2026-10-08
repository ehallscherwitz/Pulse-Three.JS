import { Canvas, extend } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import * as THREE from "three/webgpu";

function App() {
  return (
    <Canvas
      shadows
      camera={{ position: [3, 3, 3], fov: 30 }}
      gl={async (props) => {
        extend(THREE);
        const renderer = new THREE.WebGPURenderer(props);
        await renderer.init();
        return renderer;
      }}
    >
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
