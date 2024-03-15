const timeline = document.querySelector('#timeline');

timeline.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target === timeline) return;
    const year = e.target.href.split('#').at(-1);
    window.location.hash = `event-${year}`;
});

// Carousel arrows
const prev = () => {
    const active = document.querySelector("#timeline .active");
    const prev = active.previousElementSibling?.getAttribute("href");
    if (!prev) return;

    window.location.hash = `event-${prev.split("#").at(-1)}`;
}

const next = () => {
    const active = document.querySelector("#timeline .active");
    const next = active.nextElementSibling?.getAttribute("href");
    if (!next) return;

    window.location.hash = `event-${next.split("#").at(-1)}`;
}

document.querySelector("#events-carousel").addEventListener('click', (e) => {
    if (e.target.closest("div").classList.contains("event")) return;
    const id = e.target.closest("div").id;
    switch (id) {
        case "prev":
            prev();
            break;

        case "next":
            next();
            break;
    }
});

// Redirect horizontal scroll to timeline
const scrollContainer = document.querySelector("#events");

scrollContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    scrollContainer.scrollLeft += e.deltaY;
});