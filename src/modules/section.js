import { isElementInViewport } from '../helper.js';

const sectionVisible = new CustomEvent('section_visible');

document.querySelectorAll('section').forEach(section => {
    document.querySelector("main").addEventListener('scroll', () => {
        if (!isElementInViewport(section)) return;

        section.dispatchEvent(sectionVisible);
    });
});