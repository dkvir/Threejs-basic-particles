/* Demo JS */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { gsap } from 'gsap';
import { DoubleSide, EquirectangularRefractionMapping } from 'three';
import { AnimationUtils } from 'three';

const canvas = document.querySelector('.canvas');
const textureLoader = new THREE.TextureLoader();

const particleTexture =  textureLoader.load('/textures/4.png');

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0, 0, 6);
orbit.autoRotate = true;

const particlesGeometry = new THREE.BufferGeometry();
let count = 80000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++){
  positions[i] = (Math.random() - 0.5) * 50;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  'position', 
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute(
  'color', 
  new THREE.BufferAttribute(colors, 3)
);

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.2
particlesMaterial.sizeAttenuation = true;
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture

// some ways to make particle transparent
// particlesMaterial.alphaTest = 0.001;
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

// apply color on particles
particlesMaterial.vertexColors = true

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial()
)

cube.material.color.setHex(0x000fff);

scene.add(cube);


function animate() {
  renderer.render(scene, camera);
  orbit.update();
  renderer.setAnimationLoop(animate);
}

animate();

window.addEventListener('resize', resizeEvent);

function resizeEvent() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
