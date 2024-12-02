import { Vector3, MathUtils } from "three";
import Animator from "./Animator";

export default class Controller {
    // private:
    #moveSpeed = 10.0;
    #jumpHeight = 2.0;
    #g = 9.81 * 2;

    // public:
    character;
    animator;
    center = 0.0;
    VectorY = 0.0;

    grounded = true;

    constructor(character) {
        this.character = character;
        this.animator = new Animator(this.character);
        this.center = 0.5;

        this.VectorY = 0.0;

        this.grounded = true;

        this.lastMoveDirection = new Vector3(0, 0, 0);

        this.input = {
            "w": false,
            "a": false,
            "s": false,
            "d": false,
            " ": false
        };

        document.addEventListener("keydown", this.startAction);
        document.addEventListener("keyup", this.stopAction);
    }

    startAction = (event) => {
        if (event.key in this.input) {
            this.input[event.key] = true;
        }
    }

    stopAction = (event) => {
        if (event.key in this.input) {
            this.input[event.key] = false;
        }
    }

    update = (deltaTime) => {
        const distance = this.#moveSpeed * deltaTime;

        let vectorX = 0.0;
        let vectorZ = 0.0;

        if (this.grounded) {
            if (this.input["w"]) {
                vectorZ -= distance;
            }
            if (this.input["a"]) {
                vectorX -= distance;
            }
            if (this.input["s"]) {
                vectorZ += distance;
            }
            if (this.input["d"]) {
                vectorX += distance;
            }

            if (this.input[" "]) {
                this.grounded = false;
                this.VectorY = Math.sqrt(2 * this.#g * this.#jumpHeight);
                this.lastMoveDirection.set(vectorX, 0, vectorZ).normalize();
            }
        } else {
            vectorX = this.lastMoveDirection.x * this.#moveSpeed * deltaTime;
            vectorZ = this.lastMoveDirection.z * this.#moveSpeed * deltaTime;
        }

        if (!this.grounded) {
            this.VectorY -= this.#g * deltaTime;
            this.animator.play(Animator.JUMP);
        }

        if (this.character.position.y <= this.center - 0.001) {
            this.character.position.y = this.center;
            this.grounded = true;
            this.VectorY = 0.0;
        }

        const direction = new Vector3(vectorX, this.VectorY, vectorZ);

        const horizontalDirection = new Vector3(direction.x, 0, direction.z).normalize();

        this.character.position.x += horizontalDirection.x * this.#moveSpeed * deltaTime;
        this.character.position.y += direction.y * deltaTime;
        this.character.position.z += horizontalDirection.z * this.#moveSpeed * deltaTime;

        if (vectorX !== 0 || vectorZ !== 0) {
            const lookAngle = Math.atan2(-horizontalDirection.z, horizontalDirection.x);
            this.character.rotation.y = MathUtils.lerp(this.character.rotation.y, lookAngle, 0.1);

            this.animator.play(Animator.WALK);
        } else if (this.grounded) {
            this.animator.play(Animator.IDLE);
        }

        this.animator.update(deltaTime);
    };

}
