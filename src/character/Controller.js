import { Vector3, MathUtils, Box3 } from "three";

export default class Controller {
    // private:
    #moveSpeed = 15.0;
    #jumpHeight = 2.0;
    #g = 9.81 * 2;

    // public:
    character;
    center = 0.0;
    VectorY = 0.0;

    grounded = true;

    lastMoveDirection = new Vector3(0, 0, 0);

    input = {
        "w": false,
        "a": false,
        "s": false,
        "d": false,
        " ": false
    };

    constructor(character) {
        this.character = character;

        this.boundingBox = new Box3().setFromObject(this.character);
        this.VectorY = 0.0;

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

        this.boundingBox.setFromObject(this.character);

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
        }

        const bottomY = this.boundingBox.min.y;
        const groundThreshold = 0.01;
        if (bottomY <= groundThreshold) {
            this.character.position.y = bottomY;
            this.grounded = true;
            this.VectorY = 0.0;
        }

        const direction = new Vector3(vectorX, this.VectorY, vectorZ);
        const horizontalDirection = new Vector3(direction.x, 0, direction.z).normalize();

        this.character.position.x += horizontalDirection.x * this.#moveSpeed * deltaTime;
        this.character.position.y += direction.y * deltaTime;
        this.character.position.z += horizontalDirection.z * this.#moveSpeed * deltaTime;

        if (vectorX !== 0 || vectorZ !== 0) {
            const lookAngle = -Math.atan2(horizontalDirection.z, horizontalDirection.x);
            this.character.rotation.y = MathUtils.lerp(this.character.rotation.y, lookAngle, 0.1);
        }
    }
}
