import chalk from 'chalk';

class ProgressBar {
    total: number;
    current: number;
    barLength: number;

    constructor() {
        this.total = 0;
        this.current = 0;
        // @ts-ignore
        this.barLength = process.stdout.columns - 30;
    }

    init(total: number) {
        this.total = total;
        this.update(this.current);
    }

    update(current: number) {
        this.current = current;
        this.draw(this.current / this.total);
    }

    draw(currentProgress: number) {
        const filledBarLength = Math.floor(currentProgress * this.barLength);
        const emptyBarLength = this.barLength - filledBarLength;

        const filledBar = this.getBar(filledBarLength, ' ', chalk.bgWhite);
        const emptyBar = this.getBar(emptyBarLength, '-');
        const percentageProgress = (currentProgress * 100).toFixed(2);

        // @ts-ignore
        process.stdout.clearLine();
        // @ts-ignore
        process.stdout.cursorTo(0);
        process.stdout.write(`Progress: [${filledBar}${emptyBar}] | ${percentageProgress}%`);
    }

    getBar(length: number, char: string, color = (a: any) => a) {
        let str = '';
        for (let i = 0; i < length; i++) {
            str += char;
        }
        return color(str);
    }
}

export default ProgressBar;
