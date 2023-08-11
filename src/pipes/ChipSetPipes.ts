import { redirect } from "react-router-dom"
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { DataStore, RouteAction } from "./DataStore";
import { ChipPayload, ChipSetPayload, TournamentPayload } from "./DataStoreSchemaV1";
import { Factory } from "./Factory";
import { tournamentListLoader } from "./TournamentPipes";
import { deleteAction, listAction } from "./DataPipes";

export const chipListLoader = async () => {
    return listAction('chipsets');
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

export const chipsetPayloadLoader = async (args: LoaderFunctionArgs): Promise<ChipSetPayload> => {
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
};

export const chipSetUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as ChipSetPayload;
    const store = new DataStore();
    await store.open();

    if (data.is_preset) {
        data.id = 'new';
        data.is_preset = false;
    }
    var set = Factory.chipSet(data);
    await store.putValue('chipsets', set);
    return redirect(DataStore.route('chipsets', RouteAction.list));
}

export const chipSetDeleteAction: ActionFunction = async (args) => {
    await deleteAction('chipsets', args);
    return redirect(DataStore.route('chipsets', RouteAction.list));
};

