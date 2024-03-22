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

const eltInViewPort = new CustomEvent('element_in_viewport')

const isElementInViewport = (el) => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                el.dispatchEvent(eltInViewPort)
            }
        },
        {
            root: document.querySelector('main'),
            rootMargin: '0px',
            threshold: 0.5,
        }
    )

    observer.observe(el)
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

const stopLoading = () => {
    document.querySelector('#loading').remove()
}

export {
    displayEvent,
    isElementInViewport,
    scrollToEvent,
    showCard,
    hideCard,
    stopLoading,
}
