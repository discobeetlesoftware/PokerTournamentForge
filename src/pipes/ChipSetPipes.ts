import { redirect } from "react-router-dom"
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { DataStore, RouteAction, store } from "./DataStore";
import { ChipSetPayload, TournamentPayload } from "./DataStoreSchemaV1";

export const chipListLoader = async () => {
    return store.chipsets.toArray();
}

export type ChipSetLoaderResult = { chipset: ChipSetPayload, tournaments: TournamentPayload[] };
export const chipSetViewLoader = async (args: LoaderFunctionArgs): Promise<ChipSetLoaderResult> => {
    if (!args.params.id) {
        throw Error('Missing chipset id.');
    }
    const chipset = await store.chipsets.where('id').equals(args.params.id).first();
    if (!chipset) {
        throw Error('Failed to load chipset.');
    }
    const tournaments = await store.tournaments.where('set_id').equals(chipset.id).toArray();
    return {
        chipset: chipset,
        tournaments: tournaments
    };
};

export const chipSetEditLoader = async (args: LoaderFunctionArgs): Promise<ChipSetPayload> => {
    const chipset = await store.chipsets.where('id').equals(args.params.id!).first();
    if (!chipset) {
        throw Error('Failed to load chipset.');
    }
    return chipset;
};

export const chipSetUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as ChipSetPayload;
    const result = await store.chipsets.put(data);
    if (!result) {
        throw Error('Failed to update chipset');
    }
    return redirect(DataStore.route('chipsets', RouteAction.read, data));
}

export const chipSetDeleteAction: ActionFunction = async (args) => {
    if (!args.params.id) {
        throw Error('Missing chipset id.');
    }
    await store.chipsets.delete(args.params.id);
    return redirect(DataStore.route('chipsets', RouteAction.list));
};

