import * as THREE from "three";
import Controller from "./Controller";

export default class Character {

    constructor(scene) {
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x7F1D1D });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = 1;

        scene.add(this.mesh);

        this.controller = new Controller(this.mesh);
    }

    update(deltaTime) {
        this.controller.update(deltaTime);
    }
}