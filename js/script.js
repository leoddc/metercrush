function playBar(bar, bpm) {
    alert("no");
}


let generator = new BarGenerator({
    durations: [1, 2, 4, 8, 16],
    dots: true,
    rests: true,
    triplets: true,
});

let bar = generator.generateBar([4, 4]);
bar.engrave("vex");

let grid = new Grid(bar, 120);

let spacePressed = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !spacePressed) {
        const time = Date.now();
        spacePressed = true;
        console.log('Space key pressed');
        grid.generateGrid();
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        spacePressed = false;
        console.log('Space key released');
    }
});
