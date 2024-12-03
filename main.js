import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import FullScene from "./src/scenes/FullScene";
import Character from "./src/character/Character";
import Cursor from "./src/gui/Cursor";
import FloatingContent from "./src/gui/FloatingContent"


/* DOM Element */
const app = document.getElementById("app");

/* Scene Elements */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

/* Renderer Setup */
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

/* FullScene */
const fullScene = new FullScene(scene);
void fullScene;

/* SkyBox */

const textureLoader = new THREE.TextureLoader();
const skybox = new THREE.Mesh(
    new THREE.SphereGeometry(600, 600, 600),
    new THREE.MeshBasicMaterial({ map: textureLoader.load("/hdri/hdri_red_2.jpg"), side: THREE.BackSide })
);
scene.add(skybox);

/* Lights */
const ambient = new THREE.AmbientLight(0xfecaca, 1);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xfecaca, 5);
directional.position.set(5, 10, 7.5);
scene.add(directional);

/* Leaves Particles */
let particleCount = 400; 
let range = 350; 

let positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() * range - range / 2; // Coordenada x
    positions[i * 3 + 1] = Math.random() * range - range / 2; // Coordenada y
    positions[i * 3 + 2] = Math.random() * range - range / 2; // Coordenada z
}

let particles = new THREE.BufferGeometry();
let leaves = new THREE.PointsMaterial({color: 0x246A00,size: 0.5,transparent: true,opacity: 0.85});
particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

let particleSystem = new THREE.Points(particles, leaves);
scene.add(particleSystem);

particleSystem.rotation.y = Math.PI / 2;

function animateParticles() {
    requestAnimationFrame(animateParticles);

    let positions = particles.getAttribute('position').array;

    for (let i = 0; i < particleCount; i++) {
        let y = positions[i * 3 + 1];
        
        y -= Math.random() * 0.2; 
    
        if (y < 0) {
            y = Math.random() * range - range / 2; 
        }
    
        positions[i * 3 + 1] = y; 
    }

    particles.getAttribute('position').needsUpdate = true;

    renderer.render(scene, camera);
}

animateParticles();

/* Fog */
scene.fog = new THREE.FogExp2(0xfecaca, 0.0024); 

/* Interactions */
const fog = new FloatingContent("2rem", "2rem", "<label>Niebla: </label><input type='range' id='fogSlider' min='0' max='0.1' step='0.001' value='0.05'>")
const fogSlider = document.getElementById('fogSlider');
fogSlider.addEventListener('input', (event) => {
  const newFogDensity = parseFloat(event.target.value);
  scene.fog.density = newFogDensity;
});

const lightAmbient = new FloatingContent("3.5rem", "2rem", "<label>Luz Ambiente: </label><input type='range' id='lightSlider' min='0' max='5' step='0.001' value='0.05'>")
const lightSlider = document.getElementById('lightSlider');
lightSlider.addEventListener('input', (event) => {
  ambient.intensity = parseFloat(event.target.value);
});

const lightDirectional = new FloatingContent("5rem", "2rem", "<label>Luz Direccional: </label><input type='range' id='directionalSlider' min='0' max='10' step='0.1' value='1'>")
const directionalSlider = document.getElementById('directionalSlider');
directionalSlider.addEventListener('input', (event) => {
  directional.intensity = parseFloat(event.target.value);
});

const sliderCam = new FloatingContent("6.5rem", "2rem", "<label>Rotar Cámara: </label><input type='range' id='cameraSlider' min='0' max='360' step='1' value='1'>")
let cameraAngle = 90;
const camSlider = document.getElementById('cameraSlider');
camSlider.addEventListener('input', (event) => {
    cameraAngle = parseFloat(event.target.value);
});

function hexToNormalizedRGB(hex) {
    hex = hex.replace("#", "");
    
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    
    return { r, g, b };
}



/* ColorPicker */
const picker = new FloatingContent("8rem", "2rem", '<label>Color de luz ambiental:</label><input type="color" name="picker" id="picker">');
document.getElementById("picker").addEventListener('input', (event) => {
    const rgb = hexToNormalizedRGB(event.target.value);
    ambient.color.r = rgb.r;
    ambient.color.g = rgb.g;
    ambient.color.b = rgb.b;

});

console.log(ambient.color)

/* Camera */
camera.position.set(0, 5, 0);
camera.lookAt(0, 0, 0);

/* Audio Listener */
const listener = new THREE.AudioListener();
camera.add(listener);

document.body.addEventListener("click", () => {
    setupAudio();
    document.body.removeEventListener("click", setupAudio);
});

setTimeout(() => { document.body.click(); }, 0);

const setupAudio = () => {
    const audio = new THREE.Audio(listener);
    const loader = new THREE.AudioLoader();
    loader.load("/audio/ambience.mp3", (buffer) => {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(1);
        audio.play();
    });
}


/* Character */
const character = new Character(scene);

/* Cursor */
const cursor = new Cursor();
void cursor;

/* deltaTime */
let ti = performance.now();

function getDeltaTime() {
    const tf = performance.now();
    const dt = (tf - ti) / 1000;

    ti = tf;

    return dt;
}

function cameraFollowLookAt() {
    if (character.mesh) {

        const radius = 10;
        const angleInRadians = THREE.MathUtils.degToRad(cameraAngle);
        
        const position = [
            character.mesh.position.x + radius * Math.cos(angleInRadians),  
            character.mesh.position.y + 5,
            character.mesh.position.z + radius * Math.sin(angleInRadians)   
        ];
        
        if (camera) {
            camera.position.set(...position);
            camera.lookAt(character.mesh.position);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    /* Character update loop */
    const deltaTime = getDeltaTime();
    character.update(deltaTime);
    cameraFollowLookAt();
    renderer.render(scene, camera);
}

animate();