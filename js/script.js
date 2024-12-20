let generatorConfig = {
    durations: [1, 2, 4, 8, 16],
    dots: true,
    rests: true,
    triplets: true,
};

let barConfig = [4, 4];
let bpm = 100;

let meterCrush = new MeterCrush(generatorConfig, barConfig, bpm);

function startGame() {
    meterCrush.startGame();
}

function stopGame() {
    meterCrush.stopGame();
}