class Fraction {
    constructor(num, den, isRest, isNote,dotted = false) {
        if (den === 0) {
            throw new Error("Denominator cannot be zero");
        }
        this.num = num;
        this.den = den;
        this.dotted = dotted;
        this.isRest = isRest;
        this.isNote = isNote;
        this.reduce();
    }

    gcd(a, b) {
        if (!b) {
            return a;
        }
        return this.gcd(b, a % b);
    }

    lcm(a, b) {
        return (a * b) / this.gcd(a, b);
    }

    reduce() {
        const gcd = this.gcd(this.num, this.den);
        this.num /= gcd;
        this.den /= gcd;
    }

    add(other) {
        const lcm = this.lcm(this.den, other.den);
        const thisNum = this.num * (lcm / this.den);
        const otherNum = other.num * (lcm / other.den);
        return new Fraction(thisNum + otherNum, lcm);
    }

    toFloat() {
        return this.num / this.den;
    }

    equals(other) {
        this.reduce();
        other.reduce();
        return this.num === other.num && this.den === other.den;
    }

    toString() {
        return `${this.isRest ? "R" : ""}${this.unDot().num}/${this.unDot().den}${this.dotted ? "'" : ""}`;
    }

    unDot() {
        if (this.dotted) {
            return new Fraction(this.num / 3, this.den / 2);
        }
        return this;
    }
}
