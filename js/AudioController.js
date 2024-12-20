class AudioController {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.metronomeSound = new Howl({
            src: ['audio/met-tik.wav']
        });
    }

    playClick() {
        this.metronomeSound.play();
    }
}

class Metronome {
    constructor(bpm, hitCallback) {
        this.bpm = bpm;
        this.quarterNoteTime = 60 / this.bpm;
        this.hitCallback = hitCallback;
        this.visualizer = document.getElementById("metronome-visualizer");
        this.on = false;
        this.lastHit = null;
        this.interval = setInterval(() => this.onHit(), this.quarterNoteTime * 1000);
    }

    onHit() {
        if (this.on) {
            this.hitCallback();
            if (this.visualizer) {
                this.visualizer.style.backgroundColor = "red";
                setTimeout(() => this.visualizer.style.backgroundColor = "white", 50);
            }
        }
        this.lastHit = Date.now();
    }

    start() {
        this.on = true;
        this.lastHit = Date.now();
    }

    stop() {
        this.on = false;
    }
}

class Grid {
    constructor(bar, bpm, metronome, audioController) {
        this.bar = bar;
        this.notes = this.bar.notes;
        this.set = [];
        this.buffer = 5000; // milliseconds
        this.completed = false;
        this.started = false;
        this.place = 0;
        this.hitting = false;
        this.wholeFactor = (240 / bpm) * 1000; // length of a whole note in ms
        this.audioController = audioController;
        this.metronome = metronome;
    }

    next() {
        this.place++;
        if (this.place === this.set.length) {
            this.completed = true;
        }
    }

    mistake() {
        this.place = 0;
        this.started = false;
        this.set = [];
    }

    noteDifferential(note) {
        return this.wholeFactor * note.toFloat();
    }

    generateGrid() {
        this.completed = false;
        if (!this.metronome.on) {
            this.metronome.start();
        }
        const metStart = this.metronome.lastHit;
        let lastTime = metStart;

        this.notes.forEach(note => {
            const block = {
                start: lastTime,
                end: lastTime + this.noteDifferential(note),
                quiet: note.isRest
            };
            this.set.push(block);
            lastTime = block.end;
        });
    }

    hitOn() {
        this.hitting = true;
    }

    hitOff() {
        this.hitting = false;
    }
}