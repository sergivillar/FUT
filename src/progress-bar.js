const {bgWhite} = require('chalk');

class ProgressBar {
    constructor() {
        this.total;
        this.current = 0;
        this.barLength = process.stdout.columns - 30;
    }

    init(total) {
        this.total = total;
        this.update(this.current);
    }

    update(current) {
        this.current = current;
        this.draw(this.current / this.total);
    }

    draw(currentProgress) {
        const filledBarLength = Math.floor(currentProgress * this.barLength);
        const emptyBarLength = this.barLength - filledBarLength;

        const filledBar = this.getBar(filledBarLength, ' ', bgWhite);
        const emptyBar = this.getBar(emptyBarLength, '-');
        const percentageProgress = (currentProgress * 100).toFixed(2);

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Progress: [${filledBar}${emptyBar}] | ${percentageProgress}%`);
    }

    getBar(length, char, color = a => a) {
        let str = '';
        for (let i = 0; i < length; i++) {
            str += char;
        }
        return color(str);
    }
}

module.exports = ProgressBar;
