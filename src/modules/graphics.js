import { csv } from 'd3-fetch'
import moment from 'moment'
import { generateBarGraph } from '../helper.js'

const dataReady = new CustomEvent('dataReady')

async function loadData() {
    const data = await csv('/src/data/backloggd.csv')
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

export { loadData, renderGraphics }
