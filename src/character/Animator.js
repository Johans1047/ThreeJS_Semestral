import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/Addons.js";

export default class Animator {

    /* private: */
    #animations = {
        idle: "/character/AinaIdle.fbx",
        walk: "/character/AinaWalk.fbx",
        jump: "/character/AinaJump.fbx"
    }

    /* public: */
    character;
    current;
    mixer;
    actions;
    loader;

    static IDLE = 0;
    static WALK = 1;
    static JUMP = 2;

    constructor(character) {
        this.character = character;
        this.loader = new FBXLoader();
        this.mixer = new THREE.AnimationMixer(character);
        this.actions = {}

        this.loadAnimations();
    }

    loadAnimations = async () => {
        for (const [key, path] of Object.entries(this.#animations)) {
            await this.loader.loadAsync(path).then((fbx) => {
                const clip = fbx.animations[0];
                this.actions[key] = this.mixer.clipAction(clip);
            });
        }
    };

    play = (animation) => {
        let key;
        switch(animation) {
            case Animator.IDLE:
                key = "idle";
                break;
            case Animator.WALK:
                key = "walk";
                break;
            case Animator.JUMP:
                key = "jump";
                break;
        }

        if(!key || this.current === animation) {
            return;
        }

        if(this.current && this.actions[this.current]) {
            this.actions[this.current].fadeOut(0.2);
        }

        if(this.actions[key]) {
            this.actions[key].reset().fadeIn(0.2).play();
            this.current = key;
        }
    }

    update = (deltaTime) => {
        if(this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
}