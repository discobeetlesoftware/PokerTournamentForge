import { redirect } from "react-router-dom"
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { DataStore, RouteAction } from "./DataStore";
import { ChipSetPayload, TournamentPayload } from "./DataStoreSchemaV1";
import { deleteAction, getAction, listAction, putAction } from "./DataPipes";

export const chipListLoader = async () => {
    return listAction('chipsets');
}

export type ChipSetLoaderResult = { chipset: ChipSetPayload, tournaments: TournamentPayload[] };
export const chipSetViewLoader = async (args: LoaderFunctionArgs): Promise<ChipSetLoaderResult> => {
    const chipset = await getAction('chipsets', args.params.id);
    return {
        chipset: chipset,
        tournaments: (await listAction('tournaments')).filter(tournament => tournament.set_id === chipset.id)
    };
};

export const chipSetEditLoader = async (args: LoaderFunctionArgs): Promise<ChipSetPayload> => {
    return await getAction('chipsets', args.params.id);;
};

export const chipSetUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as ChipSetPayload;
    const result = await putAction('chipsets', data);
    if (!result) {
        throw Error('Failed to update chipset');
    }
    return redirect(DataStore.route('chipsets', RouteAction.read, result));
}

export const chipSetDeleteAction: ActionFunction = async (args) => {
    await deleteAction('chipsets', args);
    return redirect(DataStore.route('chipsets', RouteAction.list));
};

