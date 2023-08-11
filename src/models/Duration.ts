export default class Duration {
    minutes: number;

    constructor(minutes = 0, hours = 0) {
        this.minutes = minutes + (60 * hours);
    }
    
    static hydrate(obj: Record<string ,any>): Duration | undefined {
        if (obj === undefined) {
            return undefined;
        }
        let minutes = obj['minutes'];
        return minutes === undefined ? undefined : new Duration(minutes);
    }

    toString(force_full: boolean = false): string {
        if (this.minutes === 0) {
            return '';
        }
        let hasHours = this.minutes >= 60;
        let minutes = hasHours ? this.minutes % 60 : this.minutes;
        var output: string[] = [];
        if (hasHours || force_full) {
            let hours = Math.floor(this.minutes / 60);
            output.push(`${hours}h`);
        }
        if (minutes > 0 || force_full) {
            output.push(`${minutes}m`);
        }
        return output.join(' ');
    }
}
