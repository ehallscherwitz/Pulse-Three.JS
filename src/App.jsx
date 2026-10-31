import { Canvas, extend } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import * as THREE from "three/webgpu";

const showDebugPanel = window.location.hash === "#debug";

function App() {
  return (
    <>
      <Leva hidden={!showDebugPanel} />
      <Canvas
        shadows
        camera={{ position: [34, 100, 39], fov: 30 }}
        gl={async (props) => {
          extend(THREE);
          const renderer = new THREE.WebGPURenderer(props);
          await renderer.init();
          return renderer;
        }}
      >
        <color attach="background" args={["#000000"]} />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
