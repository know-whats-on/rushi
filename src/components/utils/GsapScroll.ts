import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type MeshWithStandardMaterial = THREE.Mesh<
  THREE.BufferGeometry,
  THREE.MeshStandardMaterial
>;

const isMeshWithMaterial = (
  object: THREE.Object3D
): object is MeshWithStandardMaterial =>
  object instanceof THREE.Mesh && !Array.isArray(object.material);

const getScrollViewState = () => {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isSmallDevice =
    isTouch && Math.max(window.innerWidth, window.innerHeight) <= 1180;
  const isLandscapeDesktopMode = isSmallDevice && isLandscape;

  return {
    isDesktopLike: window.innerWidth > 1024 || isLandscapeDesktopMode,
  };
};

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  let intensity: number = 0;
  setInterval(() => {
    intensity = Math.random();
  }, 200);
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  camera.position.set(0, 13.1, 24.7);
  camera.zoom = 1.1;
  camera.updateProjectionMatrix();

  if (character) {
    character.rotation.x = 0;
    character.rotation.y = 0;
  }

  let screenLight: MeshWithStandardMaterial | null = null;
  let monitor: MeshWithStandardMaterial | null = null;
  character?.children.forEach((object) => {
    if (object.name === "Plane004") {
      object.children.forEach((child) => {
        if (isMeshWithMaterial(child)) {
          child.material.transparent = true;
          child.material.opacity = 0;
          if (child.material.name === "Material.018") {
            monitor = child;
            child.material.color.set("#FFFFFF");
          }
        }
      });
    }
    if (object.name === "screenlight" && isMeshWithMaterial(object)) {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#B0F5EA");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = object;
    }
  });
  const neckBone = character?.getObjectByName("spine005");

  gsap.set(".landing-container", { clearProps: "opacity,transform,y" });
  gsap.set(".about-section", { clearProps: "opacity,transform,y" });
  gsap.set(".about-me", { clearProps: "opacity,transform,y" });
  gsap.set(".whatIDO", { clearProps: "opacity,transform,y" });
  gsap.set(".character-model", {
    clearProps: "transform,x,y,opacity,position,top,right,bottom,left,zIndex",
  });
  gsap.set(".character-rim", { clearProps: "opacity,transform,y,scale,scaleX" });

  if (neckBone) {
    neckBone.rotation.x = 0;
  }

  const initialMonitor = monitor as MeshWithStandardMaterial | null;
  if (initialMonitor) {
    initialMonitor.material.opacity = 0;
    initialMonitor.position.y = -10;
    initialMonitor.position.z = 2;
  }

  const initialScreenLight = screenLight as MeshWithStandardMaterial | null;
  if (initialScreenLight) {
    initialScreenLight.material.opacity = 0;
  }

  const { isDesktopLike } = getScrollViewState();

  if (isDesktopLike) {
    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      tl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
        .fromTo(
          ".what-box-in",
          { display: "none" },
          { display: "flex", duration: 0.1, delay: 6 },
          0
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
          0.3
        );

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);

      if (neckBone) {
        tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
      }

      const activeMonitor = monitor as MeshWithStandardMaterial | null;
      if (activeMonitor) {
        tl2.to(
          activeMonitor.material,
          { opacity: 1, duration: 0.8, delay: 3.2 },
          0
        );
        tl2.fromTo(
          activeMonitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, delay: 1.5, duration: 3 },
          0
        );
      }

      const activeScreenLight = screenLight as MeshWithStandardMaterial | null;
      if (activeScreenLight) {
        tl2.to(
          activeScreenLight.material,
          { opacity: 1, duration: 0.8, delay: 4.5 },
          0
        );
      }
    }
  } else {
    if (character) {
      gsap.set(".character-model", {
        position: "fixed",
        left: "50%",
        bottom: 0,
        zIndex: 0,
        opacity: 1,
      });

      const tM1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".landing-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 88%",
          end: "bottom 12%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const tM3 = gsap.timeline({
        scrollTrigger: {
          trigger: ".whatIDO",
          start: "top 88%",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tM1
        .fromTo(character.rotation, { y: 0 }, { y: 0.34, duration: 1 }, 0)
        .to(camera.position, { z: 31.5, y: 12.5, duration: 1 }, 0)
        .to(
          ".landing-intro, .landing-info",
          { opacity: 0.18, y: "12%", duration: 1 },
          0
        )
        .to(
          ".landing-mobile-topic-marquees, .landing-scroll-indicator",
          { opacity: 0.16, y: "18%", duration: 1 },
          0
        );

      tM2
        .to(
          camera.position,
          { z: 59, y: 9.6, duration: 1.2, ease: "none" },
          0
        )
        .to(character.rotation, { y: 0.78, x: 0.09, duration: 1 }, 0)
        .to(".character-model", { x: "-4%", opacity: 0.08, duration: 0.9 }, 0)
        .fromTo(
          ".whatIDO",
          { y: "10%", opacity: 0.28 },
          { y: "0%", opacity: 1, duration: 0.8 },
          0.38
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.05 },
          { opacity: 0, scale: 0, y: "-56%", duration: 0.9 },
          0.12
        );

      tM3
        .to(
          ".character-model",
          { y: "-96%", x: "-2%", opacity: 0.14, duration: 1, ease: "none" },
          0
        )
        .to(".whatIDO", { y: "7%", duration: 0.45 }, 0)
        .to(character.rotation, { x: -0.02, duration: 0.55 }, 0.14);

      if (neckBone) {
        tM2.to(neckBone.rotation, { x: 0.48, duration: 0.82 }, 0.15);
      }

      const activeMonitor = monitor as MeshWithStandardMaterial | null;
      if (activeMonitor) {
        tM2.to(
          activeMonitor.material,
          { opacity: 1, duration: 0.42 },
          0.3
        );
        tM2.fromTo(
          activeMonitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, duration: 0.78 },
          0.08
        );
      }

      const activeScreenLight = screenLight as MeshWithStandardMaterial | null;
      if (activeScreenLight) {
        tM2.to(
          activeScreenLight.material,
          { opacity: 1, duration: 0.32 },
          0.42
        );
      }
    }
  }
}

export function setAllTimeline() {
  ScrollTrigger.getAll().forEach((trigger) => {
    const triggerId = trigger.vars.id;

    if (typeof triggerId === "string" && triggerId.startsWith("career-")) {
      trigger.kill();
    }
  });

  const rows = gsap.utils.toArray<HTMLElement>(".career-info-box");

  gsap.set(".career-section", { clearProps: "transform" });
  gsap.set(".career-timeline", { maxHeight: "0%", opacity: 0 });
  gsap.set(".career-left, .career-right", {
    clearProps: "opacity,transform",
  });
  gsap.set(".career-marker-dot", { clearProps: "opacity,transform" });

  gsap.to(".career-timeline", {
    maxHeight: "100%",
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      id: "career-line",
      trigger: ".career-section",
      start: "top 72%",
      end: "bottom 68%",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  rows.forEach((row, index) => {
    const left = row.querySelector(".career-left");
    const right = row.querySelector(".career-right");
    const marker = row.querySelector(".career-marker-dot");

    if (left) {
      gsap.set(left, { autoAlpha: 0, y: 42 });
    }

    if (right) {
      gsap.set(right, { autoAlpha: 0, y: 42 });
    }

    if (marker) {
      gsap.set(marker, { autoAlpha: 0, scale: 0.55 });
    }

    const reveal = gsap.timeline({
      scrollTrigger: {
        id: `career-row-${index}`,
        trigger: row,
        start: "top 82%",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
    });

    if (left) {
      reveal.to(
        left,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        0
      );
    }

    if (right) {
      reveal.to(
        right,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.08
      );
    }

    if (marker) {
      reveal.to(
        marker,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.7)",
        },
        0.06
      );
    }
  });
}
