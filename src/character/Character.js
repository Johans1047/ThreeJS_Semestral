import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/Addons.js";

import Controller from "./Controller";
import Animator from "./Animator";

export default class Character {

    /* public: */
    mesh;
    controller;
    animator;

    constructor(scene) {
        const loader = new GLTFLoader();

        loader.load(
            "/character/Aina.glb",
            (gltf) => {
                this.mesh = gltf.scene;
                this.mesh.position.y = 1;

                this.mesh.scale.set(0.25, 0.25, 0.25);
                this.mesh.rotation.set(0, Math.PI / 2, 0);

                scene.add(this.mesh);
                this.controller = new Controller(this.mesh);
                this.animator = new Animator(this.mesh);
            },
            undefined,
            (error) => { console.error(error); }
        );
    }

    update(deltaTime) {
        this.controller?.update(deltaTime);
    }
}