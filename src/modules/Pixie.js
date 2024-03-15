export default class Pixie {
    #defaultSize = 10;
    #idleSize = 50;

    #elt;
    #isIdle = false;

    #position = { x: 0, y: 0 };


    constructor() {
        if (document.getElementById('pixie')) return;

        this.#elt = this.#build();
    }

    #build() {
        const pixie = document.createElement('div');
        pixie.id = 'pixie';

        return pixie;
    }
    render() {
        document.body.appendChild(this.#elt);
    }

    say(toSay) {
        console.log(toSay);
    }

    #toggleIdleSize() {
        if (this.#isIdle) {
            this.#elt.style.width = `${this.#idleSize}px`;
            this.#elt.style.height = `${this.#idleSize}px`;
        }
        else {
            this.#elt.style.width = `${this.#defaultSize}px`;
            this.#elt.style.height = `${this.#defaultSize}px`;
        }
    }

    #updatePosition(x, y) {
        this.#elt.style.top = `${y}px`;
        this.#elt.style.left = `${x}px`;

        this.#position.x = x;
        this.#position.y = y;
    }

    move(x, y) {
        this.#isIdle = false;
        this.#toggleIdleSize();
        this.#updatePosition(x, y);
    }

    moveToIdle() {
        this.#isIdle = true;
        this.#toggleIdleSize();
        this.#updatePosition((window.innerWidth / 2) - (this.#idleSize / 2), 4);
    }

    hide() {
        this.#updatePosition(-100, this.#position.y);
    }

    show() {
        this.#updatePosition(this.#position.x, this.#position.y);
    }
}