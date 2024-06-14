function playBar(bar, bpm) {
    alert("no");
}


let generator = new BarGenerator({
    durations: [1, 2, 4, 8, 16],
    dots: true,
    rests: true,
    triplets: true,
});

// let bar = generator.generateBar([4, 4]);
let bar = new Bar([4, 4]);
bar.addQuarterNote();
bar.addQuarterNote();
bar.addQuarterNote();
bar.addQuarterNote();
bar.engrave("vex");

let grid = new Grid(bar, 120);

let spacePressed = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !spacePressed) {
        spacePressed = true;
        const time = Date.now();
        console.log(grid);
        if (!grid.started && grid.place === 0) {
            console.log("STARTING");
            grid.generateGrid();
            grid.started = true;
        }
        const current = grid.set[grid.place];
        const difference = Math.abs(current.start - time);
        console.log(`You hit at ${time} when grid was expecting ${current.start}`);
        console.log(`This is a difference of ${difference}`);
        if (difference > grid.buffer) {
            grid.mistake();
            console.log("MISTAKE");
        }
        else {
            grid.next();
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        spacePressed = false;
        console.log('Space key released');
    }
});
