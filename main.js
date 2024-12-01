import * as THREE from "three";
import Character from "./src/character/Character";
import Cursor from "./src/gui/Cursor";

/* DOM Element */
const app = document.getElementById("app");

/* Scene Elements */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

/* Renderer Setup */
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

/* Plane */
const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x15803D }));

plane.rotation.x = -(Math.PI / 2);
scene.add(plane);

/* Lights */
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 10, 7.5);
scene.add(directional);

/* Camera */
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

/* Character */
const character = new Character(scene);
const cursor = new Cursor(scene, camera);

/* deltaTime */
let ti = performance.now();

function getDeltaTime() {
    const tf = performance.now();
    const dt = (tf - ti)/1000;

    ti = tf;

    return dt;
}

function animate() {
    requestAnimationFrame(animate);

    /* Character update loop */
    const deltaTime = getDeltaTime(); // TODO implement
    character.update(deltaTime);

    renderer.render(scene, camera);
}

animate();