import { isElementInViewport } from '../helper.js'

const sectionVisible = new CustomEvent('section_visible')

document.querySelectorAll('section').forEach((section) => {
    isElementInViewport(section)
    section.addEventListener('element_in_viewport', () => {
        console.log('section in view')
        section.dispatchEvent(sectionVisible)
    })
})
