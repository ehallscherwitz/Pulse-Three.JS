import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AnimationMixer, MathUtils, Vector3 } from "three/webgpu";
import { PORTRAIT_END_PULLBACK, scrollToFrame } from "./cameraPath";

const backward = new Vector3();

export const ScrollCamera = ({
  root,
  path,
  fps,
  smoothing,
  scrub,
  scrubFrame,
  portraitPullback,
}) => {
  const scroll = useScroll();
  const camera = useThree((state) => state.camera);
  const { camera: blenderCamera, clip } = path;

  const mixer = useMemo(() => new AnimationMixer(root), [root]);
  const action = useMemo(() => mixer.clipAction(clip), [mixer, clip]);

  useEffect(() => {
    action.play();
    action.paused = true;
    return () => action.stop();
  }, [action]);

  useEffect(() => {
    camera.fov = blenderCamera.fov;
    camera.near = blenderCamera.near;
    camera.far = blenderCamera.far;
    camera.updateProjectionMatrix();
  }, [camera, blenderCamera]);

  useEffect(() => {
    scroll.el.classList.add("scroll-container");
  }, [scroll.el]);

  const time = useRef(0);

  useFrame((_, delta) => {
    const lastFrame = clip.duration * fps;
    const frame = scrub ? scrubFrame : scrollToFrame(scroll.offset, lastFrame);
    const target = MathUtils.clamp(frame / fps, 0, clip.duration);

    time.current = scrub
      ? target
      : MathUtils.damp(time.current, target, smoothing, delta);

    action.time = time.current;
    mixer.update(0);

    blenderCamera.updateWorldMatrix(true, false);
    blenderCamera.matrixWorld.decompose(
      camera.position,
      camera.quaternion,
      camera.scale,
    );

    if (camera.aspect < 1 && portraitPullback > 0) {
      const { fullFrame, rampFrames } = PORTRAIT_END_PULLBACK;
      const ramp = MathUtils.smoothstep(
        time.current * fps,
        fullFrame - rampFrames,
        fullFrame,
      );
      backward.set(0, 0, 1).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(backward, portraitPullback * ramp);
    }
  });

  return null;
};
