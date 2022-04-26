import seedrandom from 'seedrandom';
import colors from './Colors.json';


class Colors {

    constructor() {
        this.rng = seedrandom(0);
        this.colors = Object.entries(colors).map(([name, value]) => value);
        this.indexes = this.colors.map((v, i) => i);
        this.actual = 0;
        this.shuffleArray(this.indexes);
    }

    shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getNewColor = () => {
        const res = this.colors[this.indexes[this.actual]];
        this.actual = (this.actual + 1) % this.indexes.length;
        return res;
    }
}

export default Colors;