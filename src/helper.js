import { scrollToEvent, moveTimeline } from './modules/timeline.js'
import { animateGraphics } from './modules/graphics.js'

let inInfos = false

const displayEvent = async (year = null) => {
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

    if (!newSection) {
        const first = document
            .querySelector('#timeline a')
            .getAttribute('href')
            .split('#')
            .at(-1)
        window.location.hash = `event-${first}`
        return
    }

    oldSection?.classList?.remove('active')
    newSection?.classList?.add('active')

    const timeline = document.querySelector('#timeline')
    timeline.querySelector('.active')?.classList.remove('active')
    timeline.querySelector(`[href="#${year}"]`).classList.add('active')

    const last = document
        .querySelector('event-item:last-of-type')
        .getAttribute('year')
    const first = document
        .querySelector('event-item:first-of-type')
        .getAttribute('year')
    year === last
        ? document.querySelector('#next span').classList.add('go-down')
        : document.querySelector('#next span').classList.remove('go-down')
    year === first
        ? document.querySelector('#prev span').classList.add('go-up')
        : document.querySelector('#prev span').classList.remove('go-up')

    document
        .querySelector('#infos-display')
        .addEventListener('element_in_viewport', () => {
            inInfos = true
            moveTimeline(timeline.querySelector(`.active`))
            moveTimeline(timeline.querySelector(`.active`))
            scrollToEvent(year)
            setTimeout(() => {
                animateGraphics(year)
            }, 450)
        })

    if (inInfos) {
        // moveTimeline(timeline.querySelector(`.active`))
        setTimeout(() => {
            moveTimeline(timeline.querySelector(`.active`))
            scrollToEvent(year)
            setTimeout(() => {
                animateGraphics(year)
            }, 450)
        }, 200)
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
