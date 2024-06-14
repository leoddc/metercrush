class Bar {
    constructor(timeSignature) {
        this.timeSignature = new Fraction(timeSignature[0], timeSignature[1]);
        this.notes = [];
        this.now = 0;
    }

    getNow() {
        return this.notes[this.now];
    }

    addNote(note) {
        this.notes.push(note);
    }

    addQuarterNote() {
        this.addNote(new Note(1, 4));
    }

    sumNotes() {
        let sum = new Fraction(0, 1);
        for (let note of this.notes) {
            sum = sum.add(note.getEffectiveDuration());
        }
        return sum;
    }

    toString() {
        let output = "";
        for (let note of this.notes) {
            output += note.toString() + " ";
        }
        return output;
    }

    clear() {
        this.notes = [];
    }

    engrave(divId) {
        const VF = Vex.Flow;
        const div = document.getElementById(divId);
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        renderer.resize(500, 200);
        const context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        const stave = new VF.Stave(10, 40, 400);
        stave.addClef("treble").setContext(context).draw();

        const vexNotes = this.notes.map(note => {
            const duration = note.unDot().den + "";
            console.log("dur", duration);
            const keys = ["b/4"];
            const isDotted = note.dotted ? "d" : "";
            if (note.isRest) {
                return new VF.StaveNote({
                    keys: ["b/4"],
                    duration: duration + "r" + isDotted
                });
            } else {
                return new VF.StaveNote({
                    keys: ["b/4"],
                    duration: duration + isDotted
                });
            }
        });

        VF.Formatter.FormatAndDraw(context, stave, vexNotes);
    }
}