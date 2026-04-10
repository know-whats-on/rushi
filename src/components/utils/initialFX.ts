import { SplitText } from "gsap/SplitText";
import gsap from "gsap";

export function initialFX() {
  document.body.style.overflowY = "auto";
  document.getElementsByTagName("main")[0]?.classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  const landingTargets = [
    ".landing-info h3",
    ".landing-intro h2",
    ".landing-intro h1",
  ].filter((selector) => document.querySelector(selector));

  if (landingTargets.length) {
    const landingText = new SplitText(landingTargets, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    gsap.fromTo(
      landingText.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    );
  }

  const supportingTargets = [".landing-info-h2", ".landing-supporting span"].filter(
    (selector) => document.querySelector(selector)
  );

  if (supportingTargets.length) {
    gsap.fromTo(
      supportingTargets,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        y: 0,
        stagger: 0.1,
        delay: 0.8,
      }
    );
  }

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );
}
