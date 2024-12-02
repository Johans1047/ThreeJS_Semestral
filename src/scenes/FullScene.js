import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class FullScene {
    constructor(scene) {
        const loader = new GLTFLoader();
        loader.load(
            "/scenes/SceneFull.glb",
            (gltf) => {
                scene.add(gltf.scene);
                gltf.scene.position.set(0, 0, 0);
                gltf.scene.scale.set(2, 2, 2);
                gltf.scene.rotation.y =  - Math.PI / 2;
            },
            undefined,
            (error) => { console.error(error) }
        );
    }
}