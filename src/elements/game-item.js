class GameItem extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute("title");
        const BASE_URL = "/src/assets/posters/";
        const imgURL = `${BASE_URL}${this.getAttribute("image")}`;
        this.innerHTML = `<div class="game-card" style="--background-image: url('${imgURL}')">
                            <span>${title}</span>
                        </div>
        `;
    }
}
customElements.define("game-item", GameItem);
