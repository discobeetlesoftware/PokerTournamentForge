import { ChipPayload } from "../pipes/DataStoreSchemaV1";

export class FormatterController {
    static time(minutes?: number, forceFull: boolean = false): string {
        if (!minutes || minutes === 0) {
            return "";
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
        return output.join(" ");
    }

    static percentage(fraction: number): string {
        const value = Math.round(fraction * 100).toFixed(0);
        return `${value}%`;
    }

    static chip(payload?: ChipPayload): string {
        const value = payload?.value || 0;
        return this.tournamentDenomination(value);
    }

    static tournamentDenomination(input?: number): string {
        return input ? `T${this.shortNumberToString(input)}` : "";
    }

    static shortNumberToString(input: number | undefined | null): string {
        if (input === undefined || input === null) {
            return "";
        }
        if (input >= 1_000_000) {
            return `${input / 1_000_000}m`;
        } else if (input >= 5_000) {
            return `${input / 1_000}k`;
        } else {
            return input.toString();
        }
    }

    static stringToShortNumber(input: string | undefined | null): number {
        let multiplier = 1;
        if (input === undefined || input === null) {
            input = "0";
        } else if (input.endsWith("m")) {
            multiplier = 1_000_000;
            input = input.slice(0, -1);
        } else if (input.endsWith("k")) {
            multiplier = 1_000;
            input = input.slice(0, -1);
        }
        return parseFloat(input) * multiplier;
    }
}
