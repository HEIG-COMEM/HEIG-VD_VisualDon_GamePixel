import { scrollToEvent } from '../helper'

const timeline = document.querySelector('#timeline')
const events = document.querySelector('#events')

// Click event on timeline
timeline.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target === timeline) return
    const year = e.target.href.split('#').at(-1)
    window.location.hash = `event-${year}`
    scrollToEvent(year)
})

// Carousel arrows
const prev = () => {
    const active = document.querySelector('#timeline .active')
    const prev = active.previousElementSibling?.getAttribute('href')
    if (!prev) return

    window.location.hash = `event-${prev.split('#').at(-1)}`
}

const next = () => {
    const active = document.querySelector('#timeline .active')
    const next = active.nextElementSibling?.getAttribute('href')
    if (!next) return

    window.location.hash = `event-${next.split('#').at(-1)}`
}

document.querySelector('#events-carousel').addEventListener('click', (e) => {
    if (e.target.closest('div').classList.contains('event')) return
    const id = e.target.closest('div').id
    switch (id) {
        case 'prev':
            prev()
            break

        case 'next':
            next()
            break
    }
    const eventYear = window.location.hash.split('-').at(-1)
    scrollToEvent(eventYear)
})

// User scroll
events.addEventListener('wheel', function (e) {
    e.preventDefault()

    const active = document.querySelector('event-item .active')
    if (!active) return

    const delta = e.deltaY
    const next = active.parentElement.nextElementSibling
    const prev = active.parentElement.previousElementSibling

    if (delta > 0 && next) {
        window.location.hash = `event-${next.getAttribute('year')}`
        next.scrollIntoView({ behavior: 'smooth' })
    } else if (delta < 0 && prev) {
        window.location.hash = `event-${prev.getAttribute('year')}`
prev.scrollIntoView({ behavior: 'smooth' })
    }
})
