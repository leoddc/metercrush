class BarGenerator {
    constructor(options) {
        this.options = options;
    }

    generateBar(timeSignature) {
        const bar = new Bar(timeSignature);
        const targetSum = new Fraction(timeSignature[0], timeSignature[1]);
        let currentSum = new Fraction(0, 1);

        let firstNote = true;

        let count = 0;

        while (!currentSum.equals(targetSum)) {
            const note = this.generateRandomNote(firstNote);
            console.log(note.toString());

            const newSum = currentSum.add(note);

            if (newSum.num * targetSum.den <= targetSum.num * newSum.den) {
                bar.addNote(note);
                currentSum = newSum;
            }

            count++;

            if (count > 50) {
                bar.clear();
                currentSum = new Fraction(0, 1);
                firstNote = true;
                count = 0;
            }

            firstNote = false;
        }

        return bar;
    }

    generateRandomNote(firstNote) {
        const duration = this.getRandomDuration();
        const dotted = this.options.dots && Math.random() < 0.5 && duration.num !== 1;

        if (dotted) {
            duration.num = duration.num * 3;
            duration.den = duration.den * 2;
        }

        const isRest = this.options.rests && Math.random() < 0.3 && !firstNote;

        if (isRest) {
            return new Rest(duration.num, duration.den, dotted);
        } else {
            return new Note(duration.num, duration.den, dotted);
        }
    }

    getRandomDuration() {
        const durations = this.options.durations.slice();

        if (!this.options.triplets) {
            const tripletDurations = durations.filter(d => d % 3 === 0);
            for (let triplet of tripletDurations) {
                const index = durations.indexOf(triplet);
                if (index > -1) durations.splice(index, 1);
            }
        }

        const duration = durations[Math.floor(Math.random() * durations.length)];
        return new Fraction(1, duration);
    }
}