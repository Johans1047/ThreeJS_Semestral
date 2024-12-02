export default class FloatingContent {
    /* public: */
    top;
    left;

    constructor(top, left, innerHTML) {
        this.top = top;
        this.left = left;

        let div = document.createElement("div");
        div.style.position = "fixed";
        div.style.top = this.top;
        div.style.left = this.left;
        div.style.zIndex = 500;

        div.innerHTML = innerHTML;

        document.body.appendChild(div);
    }
}
