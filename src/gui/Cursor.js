import { SpotLight, SpotLightHelper, Object3D, Vector2, Vector3 } from "three";

export default class Cursor {

    // private:
    #color = 0xfef08a;
    #intensity = 500.0;
    #angle = Math.PI / 6;
    #penumbra = 0.2;
    #decay = 2;
    #distance = 10;

    // public:
    scene;
    camera;
    light;
    target;
    mouse;
    helper;

    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        this.light = new SpotLight(
            this.#color,
            this.#intensity,
            this.#distance,
            this.#angle,
            this.#penumbra,
            this.#decay
        );

        this.scene.add(this.light);

        this.target = new Object3D();
        this.scene.add(this.target);
        this.light.target = this.target;

        this.helper = new SpotLightHelper(this.light);
        this.scene.add(this.helper);

        this.mouse = new Vector2();
        
        window.addEventListener("mousemove", this.trackCursor);
        window.addEventListener("beforeunload", () => { window.removeEventListener("mousemove", this.trackCursor) })
    }

    trackCursor = (event) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        const vector = new Vector3(this.mouse.x, this.mouse.y, 0.5);
        vector.unproject(this.camera);
        vector.z = 0;

        this.light.position.copy(vector);
        this.target.position.copy(vector);

        this.helper.update();
    }
}
