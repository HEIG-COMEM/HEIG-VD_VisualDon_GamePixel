const timeline = document.querySelector('#timeline')
const events = document.querySelector('#events')

// Click event on timeline
timeline.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target === timeline) return
    const year = e.target.href.split('#').at(-1)
    window.location.hash = `event-${year}`
})

// Carousel arrows
const prev = () => {
    const active = document.querySelector('#timeline .active')
    const prev = active.previousElementSibling?.getAttribute('href')
    if (!prev) {
        document.querySelector('#start')?.scrollIntoView({ behavior: 'smooth' })
        return
    }

    window.location.hash = `event-${prev.split('#').at(-1)}`
}

const next = () => {
    const active = document.querySelector('#timeline .active')
    const next = active.nextElementSibling?.getAttribute('href')
    if (!next) {
        document
            .querySelector('#summary')
            ?.scrollIntoView({ behavior: 'smooth' })
        return
    }

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
})

document
    .querySelector('#infos-display')
    .addEventListener('wheel', (e) => e.preventDefault())

let wait = false
let lastCall = null
// User scroll
events.addEventListener('wheel', function (e) {
    e.preventDefault()

    if (lastCall && Date.now() - lastCall < 1000) return // Prevent multiple scrolls (1000ms delay)
    lastCall = Date.now()

    // Prevent multiple scrolls
    if (wait) return

    wait = true
    setTimeout(() => {
        wait = false
    }, 500)

    const active = document.querySelector('event-item .active')
    if (!active) return

    const delta = e.deltaY

    if (delta > 0) {
        next()
        return
    } else if (delta < 0) {
        prev()
        return
    }
})

const scrollToEvent = (year) => {
    const event = document.querySelector(
        `event-item div[data-id="event-${year}"]`
    ).parentElement
    const events = document.querySelector('#events')
    // event?.scrollIntoView({ behavior: 'smooth' })

    // make the event visible in the viewport with a trasnlate in the horizontal axis
    const eventRect = event.getBoundingClientRect()
    const eventsRect = events.getBoundingClientRect()
    const scrollLeft = events.scrollLeft
    const eventLeft = eventRect.left - eventsRect.left + scrollLeft
    const eventWidth = eventRect.width
    const eventsWidth = eventsRect.width
    const eventCenter = eventLeft + eventWidth / 2
    const eventsCenter = eventsWidth / 2
    const translate = eventCenter - eventsCenter
    events.scrollTo({
        left: translate,
        behavior: 'smooth',
    })
}

const moveTimeline = (year) => {
    const timelineWidth = timeline.offsetWidth
    const timelineCenter = timelineWidth / 2

    const activeYearWidth = year.offsetWidth
    const activeYearOffset = year.offsetLeft
    const activeYearCenter = activeYearWidth / 2
    const translate = timelineCenter - activeYearOffset - activeYearCenter
    timeline.style.transform = `translateX(${translate}px)`
    // make the behavior smooth
    timeline.style.transition = 'transform 0.9s'
}

export { scrollToEvent, moveTimeline }
