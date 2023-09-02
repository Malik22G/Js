

const btn = document.querySelector("#button");

color = () => {
    return `rgb(${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1})`;
}
btn.addEventListener("click", () => {
    let newColor = color();
    document.body.style.background = newColor;
    if (parseInt(newColor) < 9999999999) {
        heading.style.color = "white";
    }
    heading.innerText = newColor;
});

const heading = document.querySelector("#rgbColor");

