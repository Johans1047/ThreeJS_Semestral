import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import FullScene from "./src/scenes/FullScene";

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

/* Camera */
camera.position.set(0, 5, 0);
camera.lookAt(0, 0, 0);

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
    if(character.mesh){
        const position = [
            character.mesh.position.x, 
            character.mesh.position.y + 5, 
            character.mesh.position.z + 10
        ];
        if(camera) {
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