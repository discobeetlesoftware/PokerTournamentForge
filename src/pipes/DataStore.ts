import {
    ChipSetPayload,
    SettingsPayload,
    TournamentPayload,
} from "./DataStoreSchemaV1";
import { HydrationController } from "../controllers/HydrationController";
import Dexie, { Table } from "dexie";
import { Storable } from "./Storable";
import { generatePresets } from "./PresetPipes";

export const DataStoreVersion = 1;
const DEBUG = false;
const DataStoreName = "poker_tournament_forge";

type DataStoreTableNameV1 = "chipsets" | "tournaments" | "settings";
export type DataStoreTableName = DataStoreTableNameV1;

export enum RouteAction {
    list,
    forge,
    read,
    delete,
    share,
}

export class DataStore extends Dexie {
    chipsets!: Table<ChipSetPayload, string>;
    tournaments!: Table<TournamentPayload, string>;
    settings!: Table<SettingsPayload, string>;

    static NEW_ID = "new";

    constructor() {
        super(DataStoreName);
        this.version(DataStoreVersion).stores({
            chipsets: "++id",
            tournaments: "++id, set_id",
            settings: "++id",
        });
    }

    reset() {
        return this.transaction('rw', this.chipsets, this.tournaments, this.settings, async () => {
            await Promise.all(this.tables.map(table => table.clear()));
            await populateAction(['tournaments', 'chipsets', 'settings']);
        });
    }

    private static actionPath(action: RouteAction, element?: Storable): string {
        switch (action) {
            case RouteAction.list:
                return "";

            case RouteAction.delete:
                if (element) {
                    return element.id;
                }
                return "";

            case RouteAction.read:
                return element?.id || this.NEW_ID;

            case RouteAction.forge:
                return `${element?.id || this.NEW_ID}/forge`;

            case RouteAction.share:
                return `share?p=${HydrationController.encode(element)}`;

            default:
                throw Error(
                    `Unknown action[${action}] for element:[${element}]`
                );
        }
    }

    static matchesNewRoute(candidate?: string): boolean {
        if (!candidate) {
            return false;
        }
        const components = candidate.split("/");
        return components[components.length - 1] === this.NEW_ID;
    }

    static route(
        tableName: DataStoreTableName,
        action: RouteAction,
        element?: Storable
    ): string {
        return `/${tableName}/${DataStore.actionPath(action, element)}`;
    }
}

export const populateAction = async (tableNames: Array<DataStoreTableName>) => {
    return Promise.all(
        tableNames.map(async (name) => {
            let table = store.table(name);
            let count = await table.count();
            if (count === 0) {
                return table.bulkPut(generatePresets(name));
            } else {
                return Promise.resolve(true);
            }
        })
    );
};

export const store = new DataStore();
store.on("populate", async () => {
    await populateAction(['tournaments', 'chipsets', 'settings']);
});
