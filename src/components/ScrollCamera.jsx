import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AnimationMixer, MathUtils } from "three/webgpu";
import { scrollToFrame } from "./cameraPath";

export const ScrollCamera = ({ root, path, fps, smoothing, scrub, scrubFrame }) => {
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
  });

  return null;
};
