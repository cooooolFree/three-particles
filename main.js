import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 3);

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("textures/circle_01.png");
const particleGeo = new THREE.BufferGeometry();
const particlesMat = new THREE.PointsMaterial({
  size: 0.04,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: texture,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});
particlesMat.color = new THREE.Color("#ff88cc");
const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const particle = new THREE.Points(particleGeo, particlesMat);
scene.add(particle);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const x = particleGeo.attributes.position.array[i3];
    particleGeo.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
  }
  particleGeo.attributes.position.needsUpdate = true;

  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};

tick();
