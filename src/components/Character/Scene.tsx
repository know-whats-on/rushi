import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/loadingContext";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleHeadRotation,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { completeLoading, setLoading } = useLoading();
  useEffect(() => {
    const mountNode = canvasDiv.current;

    if (mountNode) {
      mountNode
        .querySelectorAll("canvas")
        .forEach((canvas) => canvas.remove());

      const rect = mountNode.getBoundingClientRect();
      const container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = new THREE.Scene();
      let isDisposed = false;
      let frameId = 0;
      let introTimeout: ReturnType<typeof setTimeout> | undefined;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      mountNode.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let loadedCharacter: THREE.Object3D | null = null;
      let screenLight: THREE.Mesh | null = null;
      let mixer: THREE.AnimationMixer;
      let removeHoverListeners: (() => void) | undefined;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf && !isDisposed) {
          const animations = setAnimations(gltf);
          if (hoverDivRef.current) {
            removeHoverListeners = animations.hover(gltf, hoverDivRef.current);
          }
          mixer = animations.mixer;
          const character = gltf.scene;
          loadedCharacter = character;
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") as THREE.Mesh | null;
          setLoading(100);
          completeLoading();
          introTimeout = setTimeout(() => {
            if (isDisposed) return;
            light.turnOnLights();
            animations.startIntro();
          }, 1400);
        }
      });

      let mouse = { x: 0, y: 0 };
      const interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      const onResize = () => {
        if (loadedCharacter) {
          handleResize(renderer, camera, canvasDiv, loadedCharacter);
        }
      };

      if (window.innerWidth > 1024) {
        document.addEventListener("mousemove", onMouseMove);
      }
      window.addEventListener("resize", onResize);

      const animate = () => {
        if (isDisposed) return;
        frameId = requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        isDisposed = true;
        if (introTimeout) {
          clearTimeout(introTimeout);
        }
        cancelAnimationFrame(frameId);
        removeHoverListeners?.();
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", onResize);
        document.removeEventListener("mousemove", onMouseMove);
        if (mountNode.contains(renderer.domElement)) {
          mountNode.removeChild(renderer.domElement);
        }
      };
    }
  }, [completeLoading, setLoading]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-aura" aria-hidden="true"></div>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
