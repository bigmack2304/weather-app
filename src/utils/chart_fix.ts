let observer: MutationObserver;

function on_added(mutations: MutationRecord[], observer: MutationObserver) {
    // console.log(mutations);
    let node = document.querySelector("#recharts_measurement_span");

    if (node) {
        node.classList.add("visually_hidden");
        observer.disconnect();
    }
}

window.addEventListener(
    "load",
    () => {
        observer = new MutationObserver(on_added);
        observer.observe(document.body, { childList: true, subtree: true });
        document.querySelector("#recharts_measurement_span")?.classList.add("visually_hidden");
    },
    { once: true }
);

export {};
