class GameItem extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title')
        const BASE_URL = '/posters/'
        const imgURL = `${BASE_URL}${this.getAttribute('image')}`
        const genres = this.getAttribute('genres').split(',')
        const platforms = this.getAttribute('platforms').split(',')

        const TAG_LIMIT = 1
        let count = 0
        let genresHtmlReady = ''
        for (const genre of genres) {
            if (count < TAG_LIMIT) {
                genresHtmlReady += `<span class="tag">${genre}</span>`
                count++
            } else {
                genresHtmlReady += `<span>...</span>`
                break
            }
        }

        let platformsHtmlReady = ''
        count = 0
        for (const platform of platforms) {
            if (count < TAG_LIMIT) {
                platformsHtmlReady += `<span class="tag">${platform}</span>`
                count++
            } else {
                platformsHtmlReady += `<span>...</span>`
                break
            }
        }

        this.innerHTML = `<div class="game-item" style="--background-image: url('${imgURL}')">
                            <div class="tags">
                                <div>${genresHtmlReady}</div>
                                <div>${platformsHtmlReady}</div>
                            </div>
                            <span class="title">${title}</span>
                        </div>
        `

        this.addEventListener('click', () => {
            window.location.hash = `game-${encodeURIComponent(title.split('-').join('_'))}`
        })
    }
}
customElements.define('game-item', GameItem)
