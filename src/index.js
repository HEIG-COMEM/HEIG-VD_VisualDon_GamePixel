import { displayEvent, isElementInViewport } from './helper.js';
import EventManager from './modules/EventManager.js';

import './elements/event-item.js';
import './elements/game-item.js';

import './pixieScript.js';
import './modules/timeline.js';

new EventManager();

const router = () => {
    const hash = window.location.hash || '#start'
    const hashs = hash.split('-')

    switch (hashs.at(0)) {
        case '#start':
            break;

        case '#event':
            if (hashs.at(1)) {
                displayEvent(hashs.at(1));
            }
            else {
                displayEvent();
            }
            break;
    }
}

window.addEventListener('hashchange', router);
document.addEventListener('events_ready', () => router()); // Wait for the events to be ready before routing

// DEBUG

// PIXIE TESTS
// const pixie = new Pixie();

// setTimeout(() => {
//     pixie.render();

//     const h4 = document.querySelector('#start h4').getBoundingClientRect();

//     pixie.move(h4.right + 5, h4.bottom - 16);
// }, 200);

// window.addEventListener('resize', () => {
//     const h4 = document.querySelector('#start h4').getBoundingClientRect();

//     pixie.move(h4.right + 5, h4.bottom - 16);
// });

// SCROLL TESTS
// const main = document.querySelector("main");

// main.addEventListener('scroll', () => {
//     const range = 15;
//     if (window.innerHeight - main.scrollTop < range) {
//         // console.log('bottom');
//         const active = document.querySelector("#timeline .active");
//         if (!active) {
//             const first = document.querySelector("#timeline a").getAttribute("href").split("#").at(-1);
//             window.location.hash = `event-${first}`;
//         }
//         pixie.moveToIdle();
//     } else {
//         // console.log('not bottom');
//         pixie.move(0, 0);
//     }
// });

const scrollContainer = document.querySelector("#events");

const delay = 0;
let countPos = 0;
let countNeg = 0;

// scrollContainer.addEventListener("wheel", (e) => {
//     e.preventDefault();

//     const delta = e.deltaY;
//     const active = document.querySelector(".event.active");
//     if (!active) return;

//     if (delta > 0) {
//         const next = active.parentElement.nextElementSibling;
//         if (!isElementInViewport(active) && next) {
//             if (countPos < delay) {
//                 countPos++;
//                 return;
//             }
//             window.location.hash = `event-${next.getAttribute("year")}`;
//             countPos = 0;
//         }
//     } else {
//         const prev = active.parentElement.previousElementSibling;
//         if (!isElementInViewport(active) && prev) {
//             if (countNeg < delay) {
//                 countNeg++;
//                 return;
//             }
//             window.location.hash = `event-${prev.getAttribute("year")}`;
//             countNeg = 0;
//         }
//     }

// });
// DEBUG END