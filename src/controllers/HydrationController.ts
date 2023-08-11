import { TournamentPayload } from "../pipes/DataStoreSchemaV1";
import { Factory } from "../pipes/Factory";
import { Uniquable } from "../pipes/Storable";
import { Buffer } from 'buffer';

export class HydrationController {
    static encode(candidate?: Uniquable): string {
        const obj = {
            ...candidate,
            id: 'new'
        };
        let jsonString = JSON.stringify(obj);
        let result = Buffer.from(jsonString, 'utf8').toString('base64');
        return result;
    }

    private static decode(str: string): Record<string, any> {
        let jsonString = Buffer.from(str, 'base64').toString('utf8');
        let result = JSON.parse(jsonString);
        return result;
    }

    static decodeTournament(str: string): TournamentPayload {
        const hydratedValue = this.decode(str);
        return Factory.tournament({
            ...hydratedValue,
            id: 'new',
            set_id: ''
        });
    }
}
