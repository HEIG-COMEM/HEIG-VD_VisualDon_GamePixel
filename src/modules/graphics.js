import { csv } from 'd3-fetch'
import { select } from 'd3-selection'
import moment from 'moment'

const dataReady = new CustomEvent('dataReady')

async function loadData() {
    const data = await csv('/src/data/backloggd.csv')
    document.dispatchEvent(dataReady)
    return data
}

async function parseData(year) {
    year = moment(year).format('YYYY')
    const data = await loadData()
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
    return games
}

async function renderGraphics(year) {
    const data = await parseData(year)

    // count the number of appearances of each platform
    const platformCount = data.reduce((acc, game) => {
        game.platforms.forEach((platform) => {
            acc[platform] = acc[platform] ? acc[platform] + 1 : 1
        })
        return acc
    }, {})

    // count the number of appearances of each genre
    const genreCount = data.reduce((acc, game) => {
        game.genres.forEach((genre) => {
            if (genre) {
                acc[genre] = acc[genre] ? acc[genre] + 1 : 1
            }
        })
        return acc
    }, {})

    // sort the counts
    const sortedPlatforms = Object.entries(platformCount).sort(
        (a, b) => b[1] - a[1]
    )
    const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1])

    // create a bar chart for the platforms using d3
    // select('div[data-id="event-1958"]')
    //     .append('div')
    //     .attr('id', 'platform-chart')
    //     .selectAll('div')
    //     .data(sortedGenres)
    //     .enter()
    //     .append('div')
    //     .style('width', (d) => `${d[1] * 2}px`) // Increase the scale to make it more visible
    //     .style('background-color', 'teal')
    //     .text((d) => `${d[0]}: ${d[1]}`)

    console.log(sortedGenres)
    console.log(sortedPlatforms)
    console.log(data)
}

renderGraphics('2000')

export { loadData }
