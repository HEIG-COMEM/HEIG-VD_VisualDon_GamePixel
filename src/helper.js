const displayEvent = (year = null) => {
	if (!year) {
		const first = document.querySelector("#timeline a").getAttribute("href").split("#").at(-1);
		window.location.hash = `event-${first}`;
		return;
	}

	const oldSection = document.querySelector("event-item .active");
	const newSection = document.querySelector(`event-item div[data-id="event-${year}"]`);

	oldSection?.classList?.remove("active");
	newSection?.classList?.add("active");

	const timeline = document.querySelector("#timeline");
	timeline.querySelector(".active")?.classList.remove("active");
	timeline.querySelector(`[href="#${year}"]`).classList.add("active");
};

const scrollToEvent = (year) => {
	const event = document.querySelector(`event-item div[data-id="event-${year}"]`);
	event.scrollIntoView({ behavior: "smooth" });
};

// TODO: Refactor using IntersectionObserver (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#creating_an_intersection_observer)
const isElementInViewport = (el) => {
	const rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom - 1 <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
};

export { displayEvent, isElementInViewport, scrollToEvent };
