class GameCard extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title')
        const BASE_URL = '/posters/'
        const imgURL = `${BASE_URL}${this.getAttribute('image')}`
        const genres = JSON.parse(this.getAttribute('genres'))
        const platforms = JSON.parse(this.getAttribute('platforms'))
        const descr = this.getAttribute('descr')

        const TAG_LIMIT = 3
        const platformsHtmlReady = platforms
            .splice(0, TAG_LIMIT)
            .map((p) => `<span>${p}</span>`)
            .join('')
        const genresHtmlReady = genres
            .splice(0, TAG_LIMIT)
            .map((g) => `<span>${g}</span>`)
            .join('')

        this.innerHTML = `<div class="game-card" style="--background-image: url('${imgURL}')">
                            <div class="tags">
                                <div class="genres">
                                    ${genresHtmlReady}
                                </div>
                                <div class="platforms">
                                    ${platformsHtmlReady}
                                </div>
                            </div>
                            <span class="title">${title}</span>
                            <p>${descr}</p>
                        </div>
        `
    }
}
customElements.define('game-card', GameCard)
