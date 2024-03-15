class GameItem extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title');
        const imgURL = (this.getAttribute('image') === "...") ? "https://via.placeholder.com/300" : this.getAttribute('image');
        this.innerHTML = `<div class="game-card" style="--background-image: url('${imgURL}')">
                            <span>${title}</span>
                        </div>
        `;
    }
}
customElements.define('game-item', GameItem)
