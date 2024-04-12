import { scrollToEvent, moveTimeline } from './modules/timeline.js'
import { select } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'

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

const generateBarGraph = (target, data) => {
    console.log(data)

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 90 },
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom

    // append the svg object to the body of the page
    const svg = select(target)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Parse the Data

    const x = scaleLinear().domain([0, data[0][1]]).range([0, width])
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')

    // Y axis
    const y = scaleBand()
        .range([0, height])
        .domain(data.map((d) => d[0]))
        .padding(0.1)
    svg.append('g').call(axisLeft(y))

    //Bars
    svg.selectAll('myRect')
        .data(data)
        .join('rect')
        .attr('x', x(0))
        .attr('y', (d) => y(d[0]))
        .attr('width', (d) => x(d[1]))
        .attr('height', y.bandwidth())
        .attr('fill', '#be865b')
}

export {
    displayEvent,
    isElementInViewport,
    showCard,
    hideCard,
    generateBarGraph,
}
