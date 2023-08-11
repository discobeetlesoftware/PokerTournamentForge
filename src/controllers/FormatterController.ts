export class FormatterController {
    static time(minutes?: number, forceFull: boolean = false): string {
        if (!minutes || minutes === 0) {
            return '';
        }
        const hours = Math.floor(minutes / 60);
        minutes = hours > 0 ? minutes % 60 : minutes;
        var output: string[] = [];
        if (hours > 0 || forceFull) {
            output.push(`${hours}h`);
        }
        if (minutes > 0 || forceFull) {
            output.push(`${minutes}m`);
        }
        return output.join(' ');
    }
}
