class EventItem extends HTMLElement {
    connectedCallback() {
        const year = this.getAttribute("year");
        const title = this.getAttribute("title");
        const description = this.getAttribute("description");
        const games = JSON.parse(this.getAttribute("games"));
        const gamesHTML = games
            .map((game) => `<game-item title="${game.name}" image="${game.poster}"></game-item>`)
            .join("");
        this.innerHTML = `<div class="event" id="event-${year}">
                            <h2>${title}</h2>
                            <p>${description}</p>
                            <h3>Jeux populaires</h3>
                            <div class="games">
                                ${gamesHTML}
                            </div>
        `;
    }
}
customElements.define("event-item", EventItem);
