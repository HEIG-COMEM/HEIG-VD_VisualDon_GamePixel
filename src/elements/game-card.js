class GameCard extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title')
        const BASE_URL = '/src/assets/posters/'
        const imgURL = `${BASE_URL}${this.getAttribute('image')}`
        const genres = JSON.parse(this.getAttribute('genres'))
        const descr = this.getAttribute('descr')
        this.innerHTML = `<div class="game-card" style="--background-image: url('${imgURL}')">
                            <div class="genres">
                                ${genres.map((g) => `<span>${g}</span>`).join('')}
                            </div>
                            <span class="title">${title}</span>
                            <p>${descr}</p>
                        </div>
        `
    }
}
customElements.define('game-card', GameCard)
