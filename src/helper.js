import { scrollToEvent, moveTimeline } from './modules/timeline.js'

let inInfos = false

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

    document
        .querySelector('#infos-display')
        .addEventListener('element_in_viewport', () => {
            inInfos = true
            moveTimeline(timeline.querySelector(`.active`))
            moveTimeline(timeline.querySelector(`.active`))
            scrollToEvent(year)
        })

    if (inInfos) {
        // moveTimeline(timeline.querySelector(`.active`))
        setTimeout(() => {
            moveTimeline(timeline.querySelector(`.active`))
            scrollToEvent(year)
        }, 100)
    }
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

export { displayEvent, isElementInViewport, showCard, hideCard }
