const displayEvent = (year = null) => {
    if (!year) {
        const first = document
            .querySelector('#timeline a')
            .getAttribute('href')
            .split('#')
            .at(-1)
        window.location.hash = `event-${first}`
        return
    }

    const oldSection = document.querySelector('event-item .active')
    const newSection = document.querySelector(
        `event-item div[data-id="event-${year}"]`
    )

    oldSection?.classList?.remove('active')
    newSection?.classList?.add('active')

    const timeline = document.querySelector('#timeline')
    timeline.querySelector('.active')?.classList.remove('active')
    timeline.querySelector(`[href="#${year}"]`).classList.add('active')
}

const scrollToEvent = (year) => {
    const event = document.querySelector(
        `event-item div[data-id="event-${year}"]`
    )
    event?.scrollIntoView({ behavior: 'smooth' })
}

const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom - 1 <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    )
}

const showCard = (name) => {
    name = decodeURIComponent(name).split('_').join('-')
    document
        .querySelector(`game-card[title="${name}"]`)
        ?.firstChild.classList.add('active')
}

const hideCard = () => {
    document.querySelector('#game-cards .active')?.classList.remove('active')
}

export { displayEvent, isElementInViewport, scrollToEvent, showCard, hideCard }
