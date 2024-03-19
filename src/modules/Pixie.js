export default class Pixie {
    #defaultSize = 10;
    #idleSize = 30;
    #textSpeed = 20;

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
        this.#elt.innerHTML = '';

        const speech = document.createElement('div');
        speech.id = "speech";

        const p = document.createElement('p');
        speech.appendChild(p);

        const hint = document.createElement('span');
        hint.classList.add("hint");
        hint.innerHTML = 'Clique pour continuer';
        speech.appendChild(hint);

        let i = 0;
        const typeWriter = () => {
            if (i < toSay.length) {
                p.innerHTML += toSay.charAt(i);
                i++;
                setTimeout(typeWriter, this.#textSpeed);
            }
        }
        this.#elt.appendChild(speech);

        typeWriter(toSay, speech);
    }

    mute() {
        this.#elt.innerHTML = '';
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

    #updatePosition(x, y, unit = 'px') {
        if (unit === 'viewport') {
            x = (window.innerWidth * x) / 100;
            y = (window.innerHeight * y) / 100;
            unit = 'px';
        }

        this.#elt.style.top = `${y}${unit}`;
        this.#elt.style.left = `${x}${unit}`;

        this.#position.x = x;
        this.#position.y = y;
    }

    move(x, y, unit) {
        this.#isIdle = false;
        this.#toggleIdleSize();
        this.#updatePosition(x, y, unit);
    }

    moveToIdle() {
        this.#isIdle = true;
        this.mute();
        this.#toggleIdleSize();
        this.#updatePosition((window.innerWidth / 2) - (this.#idleSize / 2), 4);
    }

    hide() {
        this.#updatePosition(-100, this.#position.y);
    }

    show() {
        this.#updatePosition(this.#position.x, this.#position.y);
    }

    async wait() {
        return new Promise(resolve => {
            document.addEventListener('click', () => {
                resolve();
            }, { once: true });
        });
    }
}