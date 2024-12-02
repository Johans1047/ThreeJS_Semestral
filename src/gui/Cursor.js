export default class Cursor {
    /* private: */
    #style = {
        borderRadius: "100%",
        backgroundColor: "#FDE047",
        boxShadow: "0px 0px 8px 8px #FDE047",
        position: "fixed",
        opacity: "0.4",
        width: "4rem",
        height: "4rem"
    }

    /* public: */
    div;

    constructor() {
        this.div = document.createElement("div");

        for (let prop in this.#style) {
            this.div.style[prop] = this.#style[prop];
        }

        document.body.appendChild(this.div);

        window.addEventListener("mousemove", (event) => {
            this.div.style.top = (event.clientY - 32) + "px";
            this.div.style.left = (event.clientX - 32) + "px";
        });

    }
}