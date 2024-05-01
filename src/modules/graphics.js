import { csv } from 'd3-fetch'
import moment from 'moment'
import { select, selectAll } from 'd3-selection'
import { easeElasticOut } from 'd3-ease'
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import { transition } from 'd3-transition'
import { extent } from 'd3-array'
import { area, stackOffsetSilhouette, stack } from 'd3-shape'
import { schemeDark2 } from 'd3-scale-chromatic'
import { max } from 'd3-array'

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

function generateStreamChart(targetId, data) {
    const target = select(`#${targetId}`)

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 30, left: 60 },
        // width = 460 - margin.left - margin.right,
        // height = 400 - margin.top - margin.bottom
        width =
            select(`#${targetId}`).node().getBoundingClientRect().width -
            margin.left -
            margin.right,
        height =
            select(`#${targetId}`).node().getBoundingClientRect().height -
            margin.top -
            margin.bottom

    // append the svg object to the body of the page
    const svg = target
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // List of groups = header of the csv files
    const keys = Object.keys(data[0]).slice(1)

    // Calculate the tick Values
    const tick = Math.floor(data.length / 4)
    const tickValues = [
        data[0].year,
        data[tick * 2].year,
        data[tick * 3].year,
        data.at(-1).year,
    ]

    // Add X axis
    const x = scaleLinear()
        .domain(
            extent(data, function (d) {
                return d.year
            })
        )
        .range([0, width])
    svg.append('g')
        .attr('transform', `translate(0, ${height * 0.8})`)
        .call(
            axisBottom(x)
                .tickSize(-height * 0.7)
                .tickValues(tickValues)
                .tickFormat((d) => d)
        )
        .select('.domain')
        .remove()
    // Customization
    svg.selectAll('.tick line').attr('stroke', '#f5f5f5')

    // Add X axis label:
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', width)
        .attr('y', height - 30)
        .text('Time (year)')
        .style('fill', '#f5f5f5')

    // calculate the max value of all plateform
    const stackedData = stack().offset(stackOffsetSilhouette).keys(keys)(data)

    const maxi = stackedData.reduce((acc, d) => {
        const thisMax = max(d, (e) => e[1])
        return thisMax > acc ? thisMax : acc
    }, 0)

    // Add Y axis
    const y = scaleLinear().domain([-maxi, maxi]).range([height, 0])

    // color palette
    const color = scaleOrdinal().domain(keys).range(schemeDark2)

    // create a tooltip
    const Tooltip = svg
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .style('opacity', 0)
        .style('font-size', 17)
        .style('fill', '#be865b')

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
        Tooltip.style('opacity', 1)
        selectAll('.myArea').style('opacity', 0.2)
        select(this).style('stroke', '#f5f5f5').style('opacity', 1)
    }
    const mousemove = function (event, d, i) {
        const grp = d.key
        Tooltip.text(grp)
    }
    const mouseleave = function (event, d) {
        Tooltip.style('opacity', 0)
        selectAll('.myArea').style('opacity', 1).style('stroke', 'none')
    }

    // Area generator
    const theArea = area()
        .x(function (d) {
            return x(d.data.year)
        })
        .y0(function (d) {
            return y(d[0])
        })
        .y1(function (d) {
            return y(d[1])
        })

    // Show the areas
    svg.selectAll('mylayers')
        .data(stackedData)
        .join('path')
        .attr('class', 'myArea')
        .style('fill', function (d) {
            return color(d.key)
        })
        .attr('d', theArea)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)

    // target
    //     .select('svg')
    //     .selectAll('mylayers')
    //     .data(stackedData)
    //     .join(
    //         (enter) => {
    //             return enter
    //                 .append('path')
    //                 .attr('class', 'myArea')
    //                 .style('fill', function (d) {
    //                     return color(d.key)
    //                 })
    //                 .attr('d', theArea)
    //                 .attr('transform', `translate(${margin.left}, 0)`)
    //         },
    //         (update) => {
    //             return update
    //                 .transition()
    //                 .ease(easeElasticOut)
    //                 .delay((d, i) => i * 150)
    //                 .duration(800)
    //                 .attr('d', theArea)
    //         },
    //         (exit) => exit.remove()
    //     )
    //     .on('mouseover', mouseover)
    //     .on('mousemove', mousemove)
    //     .on('mouseleave', mouseleave)
}

async function renderStreamChart(graph) {
    const rawData = await DATA

    switch (graph) {
        case 'platforms':
            const platformsKeys = [
                ...new Set(
                    rawData.flatMap((d) => {
                        d.platforms = d.platforms
                            .split(',')
                            .map((p) => p.trim())
                        d.platforms = d.platforms.map((p) =>
                            p.replace(/[\[\]']+/g, '')
                        )
                        return d.platforms.filter((p) => p)
                    })
                ),
            ]

            const missingYearDataPlatform = rawData.reduce((acc, d) => {
                const year = moment(d.date).format('YYYY')
                if (year === 'Invalid date') return acc

                const obj = acc.find((o) => o.year === year)
                if (!obj) {
                    const newObj = { year }

                    // Initialize all platforms with a value of 0
                    platformsKeys.forEach((platform) => {
                        newObj[platform] = 0
                    })

                    d.platforms.forEach((platform) => {
                        newObj[platform]++
                    })
                    acc.push(newObj)
                } else {
                    d.platforms.forEach((platform) => {
                        obj[platform]++
                    })
                }
                return acc
            }, [])

            // Fill in missing years
            const dataPlatform = missingYearDataPlatform.sort(
                (a, b) => a.year - b.year
            )
            for (let i = 1; i < missingYearDataPlatform.length; i++) {
                const currentYear = missingYearDataPlatform[i].year.toString()
                const previousYear =
                    missingYearDataPlatform[i - 1].year.toString()
                if (parseInt(currentYear) - parseInt(previousYear) > 1) {
                    for (
                        let j = parseInt(previousYear) + 1;
                        j < parseInt(currentYear);
                        j++
                    ) {
                        const newObj = { year: j.toString() }
                        platformsKeys.forEach((platform) => {
                            newObj[platform] = 0
                        })
                        missingYearDataPlatform.splice(i, 0, newObj)
                        i++
                    }
                }
            }

            generateStreamChart('streamgraph', dataPlatform)
            break

        case 'genres':
            const genresKeys = [
                ...new Set(
                    rawData.flatMap((d) => {
                        d.genres = d.genres.split(',').map((p) => p.trim())
                        d.genres = d.genres.map((p) =>
                            p.replace(/[\[\]']+/g, '')
                        )
                        return d.genres.filter((g) => g)
                    })
                ),
            ]

            const missingYearDataGenre = rawData.reduce((acc, d) => {
                const year = moment(d.date).format('YYYY')
                if (year === 'Invalid date') return acc

                const obj = acc.find((o) => o.year === year)
                if (!obj) {
                    const newObj = { year }

                    // Initialize all genres with a value of 0
                    genresKeys.forEach((genre) => {
                        newObj[genre] = 0
                    })

                    d.genres.forEach((genre) => {
                        newObj[genre]++
                    })
                    acc.push(newObj)
                } else {
                    d.genres.forEach((genre) => {
                        obj[genre]++
                    })
                }
                return acc
            }, [])

            const dataGenre = missingYearDataGenre.sort(
                (a, b) => a.year - b.year
            )
            for (let i = 1; i < missingYearDataGenre.length; i++) {
                const currentYear = missingYearDataGenre[i].year.toString()
                const previousYear = missingYearDataGenre[i - 1].year.toString()
                if (parseInt(currentYear) - parseInt(previousYear) > 1) {
                    for (
                        let j = parseInt(previousYear) + 1;
                        j < parseInt(currentYear);
                        j++
                    ) {
                        const newObj = { year: j.toString() }
                        genresKeys.forEach((platform) => {
                            newObj[platform] = 0
                        })
                        missingYearDataGenre.splice(i, 0, newObj)
                        i++
                    }
                }
            }

            generateStreamChart('streamgraph', dataGenre)
            break

        default:
            break
    }
}

export { loadData, renderGraphics, animateGraphics, renderStreamChart }
