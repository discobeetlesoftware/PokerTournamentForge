export default class Time {
    day: number;
    hour: number;
    minute: number;

    constructor(minute: number = 0, hour: number = 0, day: number = 0) {
        this.day = day;
        this.hour = hour;
        this.minute = minute;
    }

    append(minutes: number) {
        let minute = this.minute + minutes;
        this.minute = minute % 60;
        let hour = this.hour + Math.floor(minute / 60);
        this.hour = hour % 24;
        this.day = this.day + Math.floor(hour / 24);
    }

    toString(): string {
        let hour = this.hour < 10 ? `0${this.hour}` : this.hour;
        let minute = this.minute < 10 ? `0${this.minute}` : this.minute;
        return `${hour}:${minute}`;
    }
}
