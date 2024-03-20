const eventsReady = new CustomEvent('events_ready')

export default class EventManager {
    #events

    constructor() {
        this.#loadData()
    }

    async #loadData() {
        await fetch('/src/data/events.json')
            .then((response) => response.json())
            .then((data) => {
                this.#events = data.events
            })
            .then(() => {
                this.#events.sort((a, b) => a.date - b.date)
            })
            .then(() => {
                this.#renderEvents()
                this.#renderTimeline()
            })
            .then(() => {
                document.dispatchEvent(eventsReady)
            })
    }

    #renderEvents() {
        this.#events.forEach((event) => {
            const eventItem = document.createElement('event-item')

            eventItem.setAttribute('year', event.date)
            eventItem.setAttribute('title', event.name)
            eventItem.setAttribute('description', event.description)
            eventItem.setAttribute('games', JSON.stringify(event.games))

            this.#renderCards(event.games)

            document
                .querySelector('#infos-display #events')
                .appendChild(eventItem)
        })
    }

    #renderTimeline() {
        const time = []
        this.#events.forEach((event) => time.push(event.date))
        const html = time.reduce(
            (acc, year) => acc + `<a href="#${year}">${year}</a>`,
            ''
        )
        const timeline = document.querySelector('#timeline')
        timeline.innerHTML = html
    }

    #renderCards(cards) {
        cards.forEach((card) => {
            const gameCard = document.createElement('game-card')
            gameCard.setAttribute('title', card.name)
            gameCard.setAttribute('image', card.poster)
            gameCard.setAttribute('genres', JSON.stringify(card.genres))
            gameCard.setAttribute('descr', card.description)
            document
                .querySelector('#infos-display #game-cards')
                .appendChild(gameCard)
        })
    }
}
