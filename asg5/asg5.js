import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

function main() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, // fov
    globalThis.innerWidth / globalThis.innerHeight, // aspect ratio
    0.1, // near
    1000 // far
  );
  camera.position.set(-2.5, 2.5, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const canvas = renderer.domElement;
  const controls = new OrbitControls(camera, canvas);

  renderer.shadowMap.enabled = true;
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  renderer.setPixelRatio(globalThis.devicePixelRatio);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(canvas);

  const loader = new THREE.TextureLoader();
  const bgTexture = loader.load(`./assets/textures/skybox.webp`);
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  scene.background = bgTexture;
  
  const danceCubes = [];
  const raveLights = [];
  const particles = [];
  const meshes = [];
  const targets = [];
  const spotLights = [];
  const beams = [];

  // kevin macleod - who likes to party
  const musicAudio = new Audio(`./assets/sound/who_likes_to_party.mp3`);
  musicAudio.volume = 0.05;
  musicAudio.loop = true;
  globalThis.addEventListener("click", () => { musicAudio.play() }, { once: true });

  {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);

    const texture = loader.load(`./assets/textures/true.webp`);
    const textureMaterial = new THREE.MeshStandardMaterial({ map: texture });
    
    const sphere = new THREE.Mesh(sphereGeometry, textureMaterial);
    sphere.castShadow = true;
    sphere.position.z = 0.5;
    sphere.rotation.y = -Math.sin(Math.PI / 2);
    scene.add(sphere);
    meshes.push(sphere);

    const black = new THREE.MeshStandardMaterial({ color: "rgb(0, 0, 0)" });
    const floor = new THREE.Mesh(boxGeometry, black);
    floor.scale.set(10, 0.1, 10);
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);

    for (let x = -3; x <= 3; x += 2) {
      for (let z = -2; z <= 4; z += 2) {
        const danceFloorColor = new THREE.MeshStandardMaterial({
          color: "rgb(" + String(Math.random() * 255) + ", " + String(Math.random() * 255) + ", " + String(Math.random() * 255) + ")"
        });
        const danceFloorCube = new THREE.Mesh(boxGeometry, danceFloorColor);
        danceFloorCube.scale.set(1.75, 0.25, 1.75);
        danceFloorCube.position.set(x, -0.35, z - 0.25);
        danceFloorCube.castShadow = true;
        scene.add(danceFloorCube);
        danceCubes.push(danceFloorCube);
      }
    }
    
    const lightBlack = new THREE.MeshStandardMaterial({ color: "rgb(54, 69, 79)" });
    const table = new THREE.Mesh(boxGeometry, lightBlack);
    table.scale.x = 2.5;
    table.position.z = -4;
    table.castShadow = true;
    scene.add(table);

    const leftSpeakerBox = new THREE.Mesh(boxGeometry, lightBlack);
    leftSpeakerBox.scale.set(1, 2, 0.75);
    leftSpeakerBox.position.set(2, 0.5, -3.85);
    scene.add(leftSpeakerBox);

    const gray = new THREE.MeshStandardMaterial({ color: "rgb(200, 200, 200)" });
    const leftTopSpeaker = new THREE.Mesh(cylinderGeometry, gray);
    leftTopSpeaker.scale.set(0.25, 0.5, 0.25);
    leftTopSpeaker.rotation.x = Math.PI / 2;
    leftTopSpeaker.position.set(2, 1, -3.5);
    scene.add(leftTopSpeaker);

    const leftBottomSpeaker = new THREE.Mesh(cylinderGeometry, gray);
    leftBottomSpeaker.scale.set(0.35, 0.5, 0.35);
    leftBottomSpeaker.rotation.x = Math.PI / 2;
    leftBottomSpeaker.position.set(2, 0.1, -3.5);
    scene.add(leftBottomSpeaker);

    const rightSpeakerBox = new THREE.Mesh(boxGeometry, lightBlack);
    rightSpeakerBox.scale.set(1, 2, 0.75);
    rightSpeakerBox.position.set(-2, 0.5, -3.85);
    scene.add(rightSpeakerBox);

    const rightTopSpeaker = new THREE.Mesh(cylinderGeometry, gray);
    rightTopSpeaker.scale.set(0.25, 0.5, 0.25);
    rightTopSpeaker.rotation.x = Math.PI / 2;
    rightTopSpeaker.position.set(-2, 1, -3.5);
    scene.add(rightTopSpeaker);

    const rightBottomSpeaker = new THREE.Mesh(cylinderGeometry, gray);
    rightBottomSpeaker.scale.set(0.35, 0.5, 0.35);
    rightBottomSpeaker.rotation.x = Math.PI / 2;
    rightBottomSpeaker.position.set(-2, 0.1, -3.5);
    scene.add(rightBottomSpeaker);
  }

  {
    const color = "rgb(255, 255, 255)";
    const density = 0.05;
    scene.fog = new THREE.FogExp2(color, density);
  }

  {
    const color = "rgb(255, 255, 255)";
    const intensity = 3;

    const dirLight = new THREE.DirectionalLight(color, intensity);
    dirLight.position.set(-1, 2, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);
    raveLights.push(dirLight);

    const spotLight = new THREE.SpotLight(color, intensity);
    spotLight.rotation.set(0, 0.25, 0.25);
    spotLight.position.set(-1, 2, 4);
    spotLight.castShadow = true;
    scene.add(spotLight);
    raveLights.push(spotLight);

    const d = 10;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 50;
  }

  for (let i = 0; i < 4; i++) {
    const spotColors = [
      "rgb(255, 0, 0)",
      "rgb(0, 255, 0)",
      "rgb(0, 0, 255)",
      "rgb(255, 0, 173)",
    ];

    const point = new THREE.PointLight(spotColors[i], 20);
    point.position.set(
      Math.cos(i * Math.PI / 2) * 6,
      6,
      Math.sin(i * Math.PI / 2) * 6
    );
    point.angle = Math.PI / 6;
    point.penumbra = 0.5;
    point.decay = 2;
    point.distance = 30;
    point.castShadow = true;

    const target = new THREE.Object3D();
    target.position.set(0, 0, 1);
    scene.add(target);

    point.target = target;
    scene.add(point);

    spotLights.push(point);
    targets.push(target);

    const coneGeometry = new THREE.ConeGeometry(1.5, 8, 32, 1, true);
    const coneMaterial = new THREE.MeshBasicMaterial({
      color: spotColors[i],
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });

    const beam = new THREE.Mesh(coneGeometry, coneMaterial);
    beam.position.copy(point.position);
    beam.rotation.x = Math.PI;
    scene.add(beam);
    beams.push(beam);
  }

  {
    // Pioneer DJ System by Tipatat Chennavasin [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/2cMmIwTHoc-)
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load(`./assets/obj/dj_set/materials.mtl`, (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      objLoader.setMaterials(mtl);
      objLoader.load(`./assets/obj/dj_set/model.obj`, (root) => {
        root.rotation.set(0.1, -0.2, 0.025);
        root.position.set(0, 0.55, -3.9);
        root.castShadow = true;
        scene.add(root);
      });
    });
  }

  const vertices = [];
  for (let i = 0; i < 50; i++) {
    vertices.push(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000
    );
  }

  {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const sprite = loader.load(`./assets/textures/particle.png`);
    const parameters = [
      ["rgb(255, 0, 0)", sprite, 20],
      ["rgb(0, 255, 0)", sprite, 15],
      ["rgb(0, 0, 255)", sprite, 10],
      ["rgb(255, 100, 100)", sprite, 8],
      ["rgb(118, 0, 0)", sprite, 5]
    ];
    const materials = [];

    for (let i = 0; i < parameters.length; i++) {
      const color = parameters[i][0];
      const sprite = parameters[i][1];
      const size = parameters[i][2];
      materials[i] = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        color: color,
        transparent: true
      });
      materials[i].opacity = 0.25;

      const particle = new THREE.Points(geometry, materials[i]);
      particle.rotation.x = Math.random() * 6;
      particle.rotation.y = Math.random() * 6;
      particle.rotation.z = Math.random() * 6;
      scene.add(particle);
      particles.push(particle);
    }
  }

  let raveLightCounter = 0;
  let danceCubeCounter = 0;
  function animate(time) {
    {
      const canvasAspect = canvas.clientWidth / canvas.clientHeight;
      const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
      const aspect = imageAspect / canvasAspect;
    
      bgTexture.offset.x = (aspect > 1) ? (1 - 1 / aspect) / 2 : 0;
      bgTexture.repeat.x = (aspect > 1) ? 1 / aspect : 1;
    
      bgTexture.offset.y = (aspect > 1) ? 0 : (1 - aspect) / 2;
      bgTexture.repeat.y = (aspect > 1) ? 1 : aspect;
    }

    meshes.forEach((mesh) => {
      mesh.position.y = 0.75 + Math.abs(Math.sin(time / 250));
      mesh.rotation.y = time / 1000;
    });

    spotLights.forEach((light, i) => {
      const speed = time * 0.001;
      const radius = 4;

      targets[i].position.x = Math.cos(speed + i) * radius;
      targets[i].position.z = Math.sin(speed + i) * radius;
      beams[i].rotation.x = Math.sin(time / 1000);
      beams[i].rotation.z = -Math.cos(time / 1000);
    });

    if (raveLightCounter >= 100) {
      raveLights.forEach((light) => {
        light.color.setRGB(
          Math.random(),
          Math.random(),
          Math.random()
        );
      });
      raveLightCounter = 0;
    }

    if (danceCubeCounter >= 75) {
      danceCubes.forEach((cube) => {
        cube.material.color.setRGB(
          Math.random(),
          Math.random(),
          Math.random()
        );
      });
      danceCubeCounter = 0;
    }

    particles.forEach((particle) => {
      particle.position.y--;
      if (particle.position.y <= -1250) particle.position.y = 1250;
    });

    raveLightCounter++;
    danceCubeCounter++;
    renderer.render(scene, camera);
  }
}

main();