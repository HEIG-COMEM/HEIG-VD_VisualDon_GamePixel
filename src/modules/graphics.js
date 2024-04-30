import { csv } from 'd3-fetch'
import moment from 'moment'
import { select } from 'd3-selection'
import { easeElasticOut } from 'd3-ease'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import { transition } from 'd3-transition'

const dataReady = new CustomEvent('dataReady')

async function loadData() {
    const data = await csv('/data/backloggd.csv')
    document.dispatchEvent(dataReady)
    return data
}

const DATA = loadData()

async function parseData(year) {
    console.log('Parsing data for year:', year)
    year = moment(year).format('YYYY')
    const data = await DATA
    const games = data
        .filter((d) => moment(d.date).format('YYYY') === year)
        .map((d) => {
            // parse platforms and genres into arrays
            d.platforms = d.platforms.split(',').map((p) => p.trim())
            d.genres = d.genres.split(',').map((p) => p.trim())
            // replace ' [] with nothing for platforms and genres
            d.platforms = d.platforms.map((p) => p.replace(/[\[\]']+/g, ''))
            d.genres = d.genres.map((p) => p.replace(/[\[\]']+/g, ''))
            return {
                name: d.name,
                platforms: d.platforms,
                genres: d.genres,
            }
        })
    // count the number of appearances of each platform
    const platformCount = games.reduce((acc, game) => {
        game.platforms.forEach((platform) => {
            acc[platform] = acc[platform] ? acc[platform] + 1 : 1
        })
        return acc
    }, {})

    // count the number of appearances of each genre
    const genreCount = games.reduce((acc, game) => {
        game.genres.forEach((genre) => {
            if (genre) {
                acc[genre] = acc[genre] ? acc[genre] + 1 : 1
            }
        })
        return acc
    }, {})

    // sort the counts
    const sortedPlatforms = Object.entries(platformCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    const sortedGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)

    sessionStorage.setItem(
        `GamePixel-${year}`,
        JSON.stringify({ sortedPlatforms, sortedGenres })
    )

    return { sortedPlatforms, sortedGenres }
}

async function renderGraphics(yearNumber) {
    const year = yearNumber.toString()
    const data = sessionStorage.getItem(`GamePixel-${year}`)
        ? JSON.parse(sessionStorage.getItem(`GamePixel-${year}`))
        : await parseData(year)

    const genreTarget = `div[data-id="event-${year}"] .graph_genre`
    const plateformTarget = `div[data-id="event-${year}"] .graph_plateform`

    if (data.sortedGenres.length) {
        generateBarGraph(genreTarget, data.sortedGenres)
    } else {
        document.querySelector(genreTarget).innerHTML =
            '<p class="small no-data">No data available for this year</p>'
    }

    if (data.sortedPlatforms.length) {
        generateBarGraph(plateformTarget, data.sortedPlatforms)
    } else {
        document.querySelector(plateformTarget).innerHTML =
            '<p class="small no-data">No data available for this year</p>'
    }
}

function generateBarGraph(target, data) {
    // console.log(data)

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 150 },
        width = 500 - margin.left - margin.right,
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
    svg.append('g')
        .attr('class', 'bar-graph-group')
        .selectAll('myRect')
        .data(data)
        .join('rect')
        .attr('x', x(0))
        .attr('y', (d) => y(d[0]))
        .attr('width', (d) => x(d[1]))
        .attr('height', y.bandwidth())
        .attr('fill', '#be865b')
        .attr('class', 'bar')
        .on('mouseover', function (d) {
            select(this).attr('fill', '#c4a48b')

            select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'fixed')
                .style('background-color', '#f5f5f5')
                .style('padding', '10px')
                .style('height', 'auto')
                .style('border-radius', '5px')
                .style('box-shadow', '2px 2px 2px grey')
                .attr('z-index', '1000')
                .text(
                    d.toElement.__data__[0] +
                        ': ' +
                        d.toElement.__data__[1] +
                        ' jeux'
                )
                .style('color', '#202020')
                .style('font-family', 'League Spartan')
                .style('font-weight', '600')
        })
        .on('mouseout', function (d) {
            select(this).attr('fill', '#be865b')
            select('.tooltip').remove()
        })
        .on('mousemove', function (event) {
            select('.tooltip')
                .style('left', 10 + event.clientX + 'px')
                .style('top', 10 + event.clientY + 'px')
        })

    // add the unit to the axis x without overlapping
    select(target)
        .append('text')
        .text('Nombre de jeux')
        .style('font-size', '12px')
        .style('align-self', 'end')
        .style('margin', '0')
}

function animateGraphic(target, data) {
    if (!data.length) return

    const margin = { top: 20, right: 30, bottom: 40, left: 150 },
        width = 500 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom

    const x = scaleLinear().domain([0, data[0][1]]).range([0, width])

    select(target)
        .selectAll('rect')
        .attr('width', 0)
        .transition()
        .ease(easeElasticOut)
        .duration(800)
        .delay((d, i) => i * 150)
        .attr('width', (d) => x(d[1]))
}

async function animateGraphics(year) {
    const data = sessionStorage.getItem(`GamePixel-${year}`)
        ? JSON.parse(sessionStorage.getItem(`GamePixel-${year}`))
        : await parseData(year)

    const genreTarget = `div[data-id="event-${year}"] .graph_genre`
    const plateformTarget = `div[data-id="event-${year}"] .graph_plateform`

    animateGraphic(genreTarget, data.sortedGenres)
    animateGraphic(plateformTarget, data.sortedPlatforms)
}

export { loadData, renderGraphics, animateGraphics }
