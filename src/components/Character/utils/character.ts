import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { portfolioContent } from "../../../data/portfolioContent";

const shirtNodes = new Set(["cube006", "cube006_1"]);
const pantsNodes = new Set(["pant"]);
const shoeNodes = new Set(["shoe", "sole"]);
const eyeNodes = new Set(["eyes001"]);
const capNodes = new Set(["cap001", "cap002"]);
const hairNodes = new Set(["hair", "eyebrow"]);
const faceNodes = new Set(["face002"]);
const computerMaterialNames = new Set([
  "material.016",
  "material.018",
  "material.020",
  "material.021",
  "stand",
]);

type PaintTexture = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => void;

const getTextureDimensions = (texture: THREE.Texture) => {
  const image = texture.image as {
    naturalWidth?: number;
    naturalHeight?: number;
    width?: number;
    height?: number;
  };

  return {
    width: image?.naturalWidth ?? image?.width ?? 0,
    height: image?.naturalHeight ?? image?.height ?? 0,
  };
};

const cloneTextureWithPaint = (
  texture: THREE.Texture,
  painter: PaintTexture
) => {
  if (typeof document === "undefined" || !texture.image) {
    return texture;
  }

  const { width, height } = getTextureDimensions(texture);
  if (!width || !height) {
    return texture;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return texture;
  }

  ctx.drawImage(texture.image as CanvasImageSource, 0, 0, width, height);
  painter(ctx, width, height);

  const nextTexture = new THREE.CanvasTexture(canvas);
  nextTexture.colorSpace = texture.colorSpace;
  nextTexture.flipY = texture.flipY;
  nextTexture.wrapS = texture.wrapS;
  nextTexture.wrapT = texture.wrapT;
  nextTexture.repeat.copy(texture.repeat);
  nextTexture.offset.copy(texture.offset);
  nextTexture.center.copy(texture.center);
  nextTexture.rotation = texture.rotation;
  nextTexture.minFilter = texture.minFilter;
  nextTexture.magFilter = texture.magFilter;
  nextTexture.generateMipmaps = texture.generateMipmaps;
  nextTexture.needsUpdate = true;
  return nextTexture;
};

const createEyeTexture = (texture: THREE.Texture, eyeColor: string) =>
  cloneTextureWithPaint(texture, (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const sourceColor = new THREE.Color();
    const nextColor = new THREE.Color();
    const targetColor = new THREE.Color(eyeColor);
    const sourceHsl = { h: 0, s: 0, l: 0 };
    const targetHsl = { h: 0, s: 0, l: 0 };

    targetColor.getHSL(targetHsl);

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3] / 255;
      if (alpha < 0.05) continue;

      sourceColor.setRGB(
        data[index] / 255,
        data[index + 1] / 255,
        data[index + 2] / 255
      );
      sourceColor.getHSL(sourceHsl);

      const hue = sourceHsl.h * 360;
      const isPurpleIris =
        hue >= 245 &&
        hue <= 315 &&
        sourceHsl.s > 0.18 &&
        sourceHsl.l > 0.08 &&
        sourceHsl.l < 0.72;

      if (!isPurpleIris) continue;

      nextColor.setHSL(
        targetHsl.h,
        Math.max(0.42, Math.min(0.72, sourceHsl.s * 0.78 + 0.08)),
        Math.max(0.12, Math.min(0.42, sourceHsl.l * 0.66))
      );

      data[index] = Math.round(nextColor.r * 255);
      data[index + 1] = Math.round(nextColor.g * 255);
      data[index + 2] = Math.round(nextColor.b * 255);
    }

    ctx.putImageData(imageData, 0, 0);
  });

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async () => {
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc?v=2",
        "MyCharacter12"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      return await new Promise<GLTF | null>((resolve, reject) => {
        loader.load(
          blobUrl,
          async (gltf) => {
            const { heroAvatarStyle } = portfolioContent;
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
                const mesh = child;
                const meshName = mesh.name.toLowerCase();
                const normalizedMeshName = meshName.replace(/[^a-z0-9]/g, "");
                const materials = Array.isArray(mesh.material)
                  ? mesh.material
                  : [mesh.material];
                const materialName = materials
                  .map((material) =>
                    typeof material?.name === "string"
                      ? material.name.toLowerCase()
                      : ""
                  )
                  .join(" ");
                const parentName = mesh.parent?.name?.toLowerCase() ?? "";
                const normalizedParentName = parentName.replace(
                  /[^a-z0-9]/g,
                  ""
                );

                const applyColor = (
                  color: string,
                  options?: {
                    roughness?: number;
                    emissive?: string;
                    emissiveIntensity?: number;
                    metalness?: number;
                  }
                ) => {
                  const nextMaterial = materials.map((material) => {
                    const clone = material.clone() as THREE.MeshStandardMaterial;
                    clone.color = new THREE.Color(color);
                    if (typeof options?.roughness === "number") {
                      clone.roughness = options.roughness;
                    }
                    if (typeof options?.metalness === "number") {
                      clone.metalness = options.metalness;
                    }
                    if (options?.emissive) {
                      clone.emissive = new THREE.Color(options.emissive);
                    }
                    if (typeof options?.emissiveIntensity === "number") {
                      clone.emissiveIntensity = options.emissiveIntensity;
                    }
                    return clone;
                  });

                  mesh.material = Array.isArray(mesh.material)
                    ? nextMaterial
                    : nextMaterial[0];
                };

                const applyMaterial = (
                  updater: (material: THREE.MeshStandardMaterial) => void
                ) => {
                  const nextMaterial = materials.map((material) => {
                    const clone = material.clone() as THREE.MeshStandardMaterial;
                    updater(clone);
                    return clone;
                  });

                  mesh.material = Array.isArray(mesh.material)
                    ? nextMaterial
                    : nextMaterial[0];
                };

                if (
                  heroAvatarStyle.hideNodePatterns.some(
                    (pattern) =>
                      meshName.includes(pattern) || materialName.includes(pattern)
                  )
                ) {
                  mesh.visible = false;
                  return;
                }

                if (mesh.material) {
                  if (
                    shirtNodes.has(normalizedMeshName) ||
                    normalizedParentName.includes("bodyshirt")
                  ) {
                    applyColor(heroAvatarStyle.hoodieColor, {
                      roughness: 0.93,
                      metalness: 0,
                    });
                  } else if (pantsNodes.has(normalizedMeshName)) {
                    applyColor(heroAvatarStyle.pantsColor, {
                      roughness: 1,
                      metalness: 0,
                    });
                  } else if (shoeNodes.has(normalizedMeshName)) {
                    applyColor("#0f1115", {
                      roughness: 0.88,
                      metalness: 0.04,
                    });
                  } else if (eyeNodes.has(normalizedMeshName)) {
                    applyMaterial((material) => {
                      material.color = new THREE.Color("#ffffff");
                      material.roughness = 0.38;
                      material.metalness = 0;
                      if (material.map) {
                        material.map = createEyeTexture(
                          material.map,
                          heroAvatarStyle.eyeColor
                        );
                      }
                    });
                  } else if (faceNodes.has(normalizedMeshName)) {
                    applyMaterial((material) => {
                      material.roughness = 0.84;
                      material.metalness = 0;
                    });
                  } else if (capNodes.has(normalizedMeshName)) {
                    applyColor(heroAvatarStyle.capColor, {
                      roughness: 0.9,
                      metalness: 0,
                    });
                  } else if (hairNodes.has(normalizedMeshName)) {
                    applyColor(heroAvatarStyle.darkFeatureColor, {
                      roughness: 0.98,
                      metalness: 0,
                    });
                  } else if (computerMaterialNames.has(materialName)) {
                    applyColor(heroAvatarStyle.computerColor, {
                      roughness: 0.58,
                      metalness: 0.08,
                    });
                  } else if (
                    heroAvatarStyle.darkNodePatterns.some((pattern) =>
                      normalizedMeshName.includes(pattern)
                    ) ||
                    heroAvatarStyle.darkMaterialPatterns.some((pattern) =>
                      materialName.includes(pattern)
                    )
                  ) {
                    applyColor(heroAvatarStyle.darkFeatureColor, {
                      roughness: 0.95,
                      metalness: 0,
                    });
                  }
                }

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character.getObjectByName("footR")!.position.y = 3.36;
            character.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
