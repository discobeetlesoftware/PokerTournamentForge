import { ActionFunction, redirect } from "react-router-dom";
import { SettingsPayload } from "./DataStoreSchemaV1";
import { DataStore } from "./DataStore";
import { Factory } from "./Factory";

export const settingsLoader = async (): Promise<SettingsPayload> => {
    const store = new DataStore();
    await store.open();
    const settings = await store.getValue('settings', 'user');
    if (!settings) {
        throw Error('Configuration load failure.');
    }
    return settings as SettingsPayload;
};

export const settingsUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as SettingsPayload;
    const store = new DataStore();
    await store.open();

    var settings = Factory.settings(data);
    await store.putValue('settings', settings);
    return redirect('/settings');
};

/*


export const chipSetUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as ChipSetPayload;
    const store = new DataStore();
    await store.open();

    var set = Factory.chipSet(data);
    await store.putValue('chipsets', set);
    return redirect(DataStore.route('chipsets', RouteAction.list));
}
export type ChipSetLoaderResult = { chipset: ChipSetPayload, tournaments: TournamentPayload[] };
export const chipSetLoader = async (args: LoaderFunctionArgs): Promise<ChipSetLoaderResult> => {
    if (args.request.method === 'DELETE') {
        throw Error(`Unknown method '${args.request.method}', expecting DELETE`);
    }
    const { id } = args.params;
    const set = await chipsetPayloadLoader(args);
    const tournaments = (await tournamentListLoader()).filter(tournament => tournament.set_id === set!.id);
    return { chipset: set as ChipSetPayload, tournaments: tournaments };
};

const chipsetPayloadLoader = async (args: LoaderFunctionArgs): Promise<ChipSetPayload> => {
    const { id } = args.params;
    if (!id) {
        throw Error('Cannot load a chip set without an id.');
    }
    if (DataStore.matchesNewRoute(id)) {
        return Factory.chipSet();
    }
    const store = new DataStore();
    await store.open();
    const set = await store.getValue('chipsets', id);
    if (!set) {
        throw Error('Chip set not found.');
    }
    return set as ChipSetPayload;
};

export type ChipSetEditPayload = { chipset: ChipSetPayload };
export const chipSetEditLoader = async (args: LoaderFunctionArgs): Promise<ChipSetEditPayload> => {
    const { id } = args.params;
    const set = await chipsetPayloadLoader(args);
    return { chipset: set as ChipSetPayload };
};*/