import { displayEvent, isElementInViewport } from "./helper.js";
import EventManager from "./modules/EventManager.js";

import "./elements/event-item.js";
import "./elements/game-item.js";

import "./pixieScript.js";
import "./modules/timeline.js";
import "./modules/section.js";
import { select } from "d3-selection";

new EventManager();

const router = () => {
    const hash = window.location.hash || "#start";
    const hashs = hash.split("-");

    switch (hashs.at(0)) {
        case "#start":
            break;

        case "#event":
            if (hashs.at(1)) {
                displayEvent(hashs.at(1));
            } else {
                displayEvent();
            }
            break;

        case "#start_journey":
            const next = document.querySelector("#start").nextElementSibling;
            window.location.hash = `${next.id}`;
            break;
    }
};

window.addEventListener("hashchange", router);
document.addEventListener("events_ready", () => router()); // Wait for the events to be ready before routing

// DEBUG

// select the div with the id "events" with d3
const events = select("#events");
// translate to the next event-item with d3 when scrolling
events.on("wheel", function (e) {
    const active = document.querySelector("event-item .active");
    if (!active) return;
    const delta = e.deltaY;
    const next = active.parentElement.nextElementSibling;
    const prev = active.parentElement.previousElementSibling;
    if (delta > 0 && next) {
        window.location.hash = `event-${next.getAttribute("year")}`;
    } else if (delta < 0 && prev) {
        window.location.hash = `event-${prev.getAttribute("year")}`;
    }
});
