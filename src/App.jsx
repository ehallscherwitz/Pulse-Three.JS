import { Canvas, extend } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { useRef } from "react";
import { Experience } from "./components/Experience";
import * as THREE from "three/webgpu";

const showDebugPanel = window.location.hash === "#debug";

function App() {
  const scrollSection = useRef(null);
  const { pages } = useControls("Camera path", {
    pages: { value: 21.7, min: 1, max: 60, step: 0.1 },
  });

  return (
    <>
      <Leva hidden={!showDebugPanel} />
      <section
        ref={scrollSection}
        className="scroll-section"
        style={{ "--pages": pages }}
      >
        <div className="scroll-sticky">
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
            <Experience scrollSection={scrollSection} />
          </Canvas>
        </div>
      </section>
    </>
  );
}

export default App;
