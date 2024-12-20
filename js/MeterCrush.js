class MeterCrush {
    constructor(generatorConfig, barConfig, gridBpm) {
        this.generator = new BarGenerator(generatorConfig);
        this.barConfig = barConfig;
        this.gridBpm = gridBpm;
        this.grid = null;
        this.spacePressed = false;

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.audioController = new AudioController(audioCtx);

        this.isRest = false; // New flag to track if the current note is a rest
        this.restTimeout = null; // To handle rest progression

        this.metronome = new Metronome(this.gridBpm, () => {
            if (this.grid) {
                this.audioController.playClick();
                this.handleMetronomeTick();
            }
        });

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
            }
        });
    }

    startGame() {
        this.generateNewBar();
    }

    stopGame() {
        this.grid = null;
        this.metronome.stop();
    }

    generateNewBar() {
        let bar = this.generator.generateBar(this.barConfig);
        // let bar = new Bar(this.barConfig);
        // bar.addQuarterNote();
        // bar.addQuarterNote();
        // bar.addQuarterRest();
        // bar.addQuarterNote();
        bar.engrave("vex");

        this.grid = new Grid(bar, this.gridBpm, this.metronome, this.audioController);
        this.grid.generateGrid();
        this.grid.started = true;
    }

    handleMetronomeTick() {
        if (!this.grid) return;

        const currentNote = this.grid.set[this.grid.place];
        if (!currentNote) return;

        this.isRest = currentNote.quiet;

        if (this.isRest) {
            this.startRestTimeout(currentNote);
        } else {
            this.clearRestTimeout();
        }
    }

    handleSpacePress() {
        const time = Date.now();
        if (!this.grid) return;

        const current = this.grid.set[this.grid.place];
        if (!current) return;

        const difference = Math.abs(current.start - time);
        if (this.isRest) {
            this.grid.mistake();
            this.clearRestTimeout();
            return;
        }

        if (difference > this.grid.buffer) {
            this.grid.mistake();
        } else {
            this.grid.next();
            if (this.grid.completed) {
                this.generateNewBar();
            }
        }
    }

    startRestTimeout(currentNote) {
        const restDuration = currentNote.duration * (60000 / this.gridBpm);
        this.restTimeout = setTimeout(() => {
            this.grid.next();
            if (this.grid.completed) {
                this.generateNewBar();
            }
        }, restDuration);
    }

    clearRestTimeout() {
        if (this.restTimeout) {
            clearTimeout(this.restTimeout);
            this.restTimeout = null;
        }
    }
}
