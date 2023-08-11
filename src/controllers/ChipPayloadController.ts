import { ChipPayload } from "../pipes/DataStoreSchemaV1";

export class ChipPayloadController {
    static format(payload?: ChipPayload): string | null {
        const value = payload?.value || 0;
        return this.tournamentDenomination(value);
    }

    static tournamentDenomination(input?: number): string | null {
        return input ? `T${this.shortNumberToString(input)}` : null;
    }

    static shortNumberToString(input: number | undefined | null): string {
        if (input === undefined || input === null) {
            return '';
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
        if (input === undefined || input === null) {
            return 0;
        }
        let multiplier = 1;
        if (input.endsWith('m')) {
            multiplier = 1_000_000;
            input = input.slice(0, -1);
        } else if (input.endsWith('k')) {
            multiplier = 1_000;
            input = input.slice(0, -1);
        }
        return parseFloat(input) * multiplier;
    }
}