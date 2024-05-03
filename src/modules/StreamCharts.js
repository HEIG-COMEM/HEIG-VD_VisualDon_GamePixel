import moment from 'moment'
import { select, selectAll } from 'd3-selection'
import { easeCubicIn } from 'd3-ease'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { axisBottom } from 'd3-axis'
import { transition } from 'd3-transition'
import { extent } from 'd3-array'
import { area, stackOffsetSilhouette, stack } from 'd3-shape'
import { max } from 'd3-array'
import { loadData } from './graphics.js'

export default class StreamCharts {
    constructor() {
        this.target = select('#streamgraph')

        this.margin = { top: 20, right: 30, bottom: 30, left: 60 }
        this.width =
            this.target.node().getBoundingClientRect().width -
            this.margin.left -
            this.margin.right
        this.height =
            this.target.node().getBoundingClientRect().height -
            this.margin.top -
            this.margin.bottom

        this.svg = this.target
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr(
                'transform',
                `translate(${this.margin.left}, ${this.margin.top})`
            )

        this.svg
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('id', 'streamChartTooltip')
            .style('opacity', 0)
            .style('font-size', '1.5rem')
            .style('fill', '#be865b')

        loadData()
            .then((data) => {
                this.rawData = data

                this.dataPlatform = this.#parseDataPlatforms()
                this.keysPlatform = Object.keys(this.dataPlatform[0]).slice(1)
                this.stackedDataPlatform = stack()
                    .offset(stackOffsetSilhouette)
                    .keys(this.keysPlatform)(this.dataPlatform)

                this.dataGenre = this.#parseDataGenres()
                this.keysGenre = Object.keys(this.dataGenre[0]).slice(1)
                this.stackedDataGenre = stack()
                    .offset(stackOffsetSilhouette)
                    .keys(this.keysGenre)(this.dataGenre)

                this.#generateStreamCharts()
            })
            .finally(() => {
                this.animate('genres')
            })
    }

    #parseDataPlatforms() {
        const platformsKeys = [
            ...new Set(
                this.rawData.flatMap((d) => {
                    d.platforms = d.platforms.split(',').map((p) => p.trim())
                    d.platforms = d.platforms.map((p) =>
                        p.replace(/[\[\]']+/g, '')
                    )
                    return d.platforms.filter((p) => p)
                })
            ),
        ]

        const missingYearDataPlatform = this.rawData.reduce((acc, d) => {
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

        const dataPlatform = missingYearDataPlatform.sort(
            (a, b) => a.year - b.year
        )
        for (let i = 1; i < missingYearDataPlatform.length; i++) {
            const currentYear = missingYearDataPlatform[i].year.toString()
            const previousYear = missingYearDataPlatform[i - 1].year.toString()
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
        return dataPlatform
    }

    #parseDataGenres() {
        const genresKeys = [
            ...new Set(
                this.rawData.flatMap((d) => {
                    d.genres = d.genres.split(',').map((p) => p.trim())
                    d.genres = d.genres.map((p) => p.replace(/[\[\]']+/g, ''))
                    return d.genres.filter((g) => g)
                })
            ),
        ]

        const missingYearDataGenre = this.rawData.reduce((acc, d) => {
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
                    if (genre !== '') {
                        newObj[genre]++
                    }
                })
                acc.push(newObj)
            } else {
                d.genres.forEach((genre) => {
                    if (genre !== '') {
                        obj[genre]++
                    }
                })
            }
            return acc
        }, [])

        const dataGenre = missingYearDataGenre.sort((a, b) => a.year - b.year)
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
                    genresKeys.forEach((genre) => {
                        newObj[genre] = 0
                    })
                    missingYearDataGenre.splice(i, 0, newObj)
                    i++
                }
            }
        }
        return dataGenre
    }

    #generateStreamCharts() {
        // Calculate the tick Values
        const tick = Math.floor(this.dataGenre.length / 4)
        const tickValues = [
            this.dataGenre[0].year,
            this.dataGenre[tick * 2].year,
            this.dataGenre[tick * 3].year,
            this.dataGenre.at(-1).year,
        ]

        // Add X axis
        const x = this.#x(this.dataGenre)
        this.svg
            .append('g')
            .attr('transform', `translate(0, ${this.height * 0.8})`)
            .call(
                axisBottom(x)
                    .tickSize(-this.height * 0.7)
                    .tickValues(tickValues)
                    .tickFormat((d) => d)
            )
            .select('.domain')
            .remove()

        // Customization
        this.svg.selectAll('.tick line').attr('stroke', '#f5f5f5')

        this.svg
            .append('text')
            .attr('text-anchor', 'end')
            .attr('x', this.width)
            .attr('y', this.height - 30)
            .text('Time (year)')
            .style('fill', '#f5f5f5')

        this.#generateStreamChart(this.stackedDataPlatform, 'platforms')

        this.#generateStreamChart(this.stackedDataGenre, 'genres')

        this.svg
            .selectAll('path')
            .on('mouseover', this.#mouseover)
            .on('mousemove', this.#mousemove)
            .on('mouseleave', this.#mouseleave)
    }

    #x(data) {
        return scaleLinear()
            .domain(
                extent(data, function (d) {
                    return +d.year
                })
            )
            .range([0, this.width])
    }

    #y(data) {
        const maxi = data.reduce((acc, d) => {
            const thisMax = max(d, (e) => e[1])
            return thisMax > acc ? thisMax : acc
        }, 0)

        return scaleLinear().domain([-maxi, maxi]).range([this.height, 0])
    }

    #color() {
        return scaleOrdinal().range([
            '#BE865B',
            '#FFD7A8',
            '#86542C',
            '#3E1500',
        ])
    }

    #generateStreamChart(data, group) {
        let x
        switch (group) {
            case 'genres':
                x = this.#x(this.dataGenre)
                break
            case 'platforms':
                x = this.#x(this.dataGenre)
                break

            default:
                break
        }

        const y = this.#y(data)

        const theLine = area()
            .x(function (d) {
                return x(d.data.year)
            })
            .y0(function (d) {
                return y(0)
            })
            .y1(function (d) {
                return y(0)
            })

        // Show the areas
        const color = this.#color() // Declare a variable to access the private field '#color'
        this.svg
            .append('g')
            .attr('class', group)
            .selectAll('mylayers')
            .data(data)
            .join('path')
            .attr('class', 'myArea')
            .style('fill', function (d) {
                return color(d.key) // Use the variable to access the private field '#color'
            })
            .attr('d', theLine)
    }

    #mouseover(event, d) {
        select('#streamChartTooltip').style('opacity', 1)
        selectAll('.myArea').style('opacity', 0.2)
        select(this).style('stroke', '#f5f5f5').style('opacity', 1)
    }
    #mousemove(event, d, i) {
        const grp = d.key
        select('#streamChartTooltip').text(grp)
    }
    #mouseleave(event, d) {
        select('#streamChartTooltip').style('opacity', 0)
        selectAll('.myArea').style('opacity', 1).style('stroke', 'none')
    }

    animate(group) {
        let x, y
        switch (group) {
            case 'genres':
                x = this.#x(this.dataGenre)
                y = this.#y(this.stackedDataGenre)
                break
            case 'platforms':
                x = this.#x(this.dataGenre)
                y = this.#y(this.stackedDataPlatform)
                break

            default:
                break
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

        const theLine = area()
            .x(function (d) {
                return x(d.data.year)
            })
            .y0(function (d) {
                return y(0)
            })
            .y1(function (d) {
                return y(0)
            })

        this.svg
            .select(`.${group === 'genres' ? 'platforms' : 'genres'}`)
            .transition()
            .duration(1000)
            .ease(easeCubicIn)
            .selectAll('path')
            .attr('d', theLine)

        this.svg
            .select(`.${group}`)
            .selectAll('path')
            .attr('d', theLine)
            .transition()
            .delay(1000)
            .duration(1000)
            .ease(easeCubicIn)
            .attr('d', theArea)
    }
}
