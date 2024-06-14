class AudioController extends EventEmitter {
    constructor(audioCtx) {
        super();
        this.audioCtx = audioCtx;
    }

    playClick() {
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = 1000;
        gainNode.gain.value = 1;

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
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
        this.interval = setInterval(() => this.onHit(), (this.quarterNoteTime) * 1000);
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
    constructor(bar, bpm) {
        this.bar = bar;
        this.notes = this.bar.notes;
        this.currentNote = this.notes[0];
        this.set = [];
        this.hitting = false;
        this.wholeFactor = (240 / bpm) * 1000; // the length of a whole note in milliseconds (60 / bpm * 4)
        this.metronome = new Metronome(bpm, () => {
            console.log("metronome hit");
        });
    }

    checkDistance(start, end) {
        const duration = end - start;
    }

    noteDifferential(note) {
        return this.wholeFactor * note.toFloat()
    }

    generateGrid() {
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
            }
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