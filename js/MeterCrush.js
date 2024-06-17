class MeterCrush {
    constructor(generatorConfig, barConfig, gridBpm) {
        this.generator = new BarGenerator(generatorConfig);
        this.barConfig = barConfig;
        this.gridBpm = gridBpm;
        this.grid = null;
        this.spacePressed = false;
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && !this.spacePressed) {
                this.spacePressed = true;
                this.handleSpacePress();
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.code === 'Space') {
                this.spacePressed = false;
                console.log('Space key released');
            }
        });
    }

    startGame() {
        console.log("STARTING GAME");
        this.generateNewBar();
    }

    stopGame() {
        console.log("STOPPING GAME");
        this.grid = null;
    }

    generateNewBar() {
        // let bar = this.generator.generateBar(this.barConfig);
        let bar = new Bar(this.barConfig);
        bar.addQuarterNote();
        bar.addQuarterNote();
        bar.addQuarterRest();
        bar.addQuarterNote();
        bar.engrave("vex");

        this.grid = new Grid(bar, this.gridBpm);
        this.grid.generateGrid();
        this.grid.started = true;
        console.log("NEW BAR GENERATED");
    }

    handleSpacePress() {
        const time = Date.now();
        console.log(this.grid);
        if (!this.grid.started && this.grid.place === 0) {
            this.grid.generateGrid();
            this.grid.started = true;
        }

        const current = this.grid.set[this.grid.place];
        const difference = Math.abs(current.start - time);
        console.log(`You hit at ${time} when grid was expecting ${current.start}`);
        console.log(`This is a difference of ${difference}`);
        if (difference > this.grid.buffer) {
            this.grid.mistake();
            console.log("MISTAKE");
        } else {
            this.grid.next();
            if (this.grid.place >= this.grid.set.length) {
                this.generateNewBar();
            }
        }
    }
}