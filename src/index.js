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
