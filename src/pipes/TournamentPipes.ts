import { ActionFunction, LoaderFunctionArgs, redirect } from "react-router-dom";
import { chipListLoader } from "./ChipSetPipes";
import { DataStore, RouteAction } from "./DataStore";
import { ChipSetPayload, SettingsPayload, TournamentPayload } from "./DataStoreSchemaV1";
import { Factory } from "./Factory";
import { StorableKind, determineStorableKind } from "./Storable";
import { deleteAction, getAction, listAction } from "./DataPipes";
import { settingsLoader } from "./SettingsPipes";
import { HydrationController } from "../controllers/HydrationController";

export type EnrichedTournamentPayload = { 
    tournament: TournamentPayload,
    chipsets: ChipSetPayload[],
    kind: StorableKind,
    settings: SettingsPayload
};

export const tournamentListLoader = async () => {
    return listAction('tournaments');
}

export const tournamentLoader = async (args: LoaderFunctionArgs): Promise<TournamentPayload> => {
    const { id } = args.params;
    if (!id) {
        throw Error('Cannot load a tournament without an id.');
    }
    const sets = await chipListLoader();
    if (DataStore.matchesNewRoute(id)) {
        return Factory.tournament();
    }
    const store = new DataStore();
    await store.open();
    let result = await store.getValue('tournaments', id);
    if (!result) {
        throw Error('Tournament not found.');
    }
    return result as TournamentPayload;
};

export const sharedTournamentLoader = async (args: LoaderFunctionArgs): Promise<EnrichedTournamentPayload> => {
    const queryPayload = new URL(args.request.url).searchParams.get('p');
    if (!queryPayload) {
        throw Error('Failed to hydrate tournament from URL payload.');
    }
    const tournament = HydrationController.decodeTournament(queryPayload);

    if (!tournament) {
        throw Error('Failed to load tournament.');
    }

    const settings = await settingsLoader();
    return { tournament: tournament, chipsets: [], kind: StorableKind.foreign, settings: settings };
};

export const enrichedTournamentLoader = async (args: LoaderFunctionArgs): Promise<EnrichedTournamentPayload> => {
    const tournament = await tournamentLoader(args);
    const chipsets = await chipListLoader();
    const settings = await settingsLoader();
    return { 
        tournament: tournament as TournamentPayload,
        chipsets: chipsets.filter(chipset => chipset.id === tournament.set_id), 
        kind: determineStorableKind(tournament),
        settings: settings
    };
};

export const tournamentEditLoader = async (args: LoaderFunctionArgs): Promise<EnrichedTournamentPayload> => {
    const tournament = await tournamentLoader(args);
    const chipsets = await chipListLoader();
    const settings = await settingsLoader();
    return { 
        tournament: tournament as TournamentPayload, 
        chipsets: chipsets, 
        kind: determineStorableKind(tournament),
        settings: settings
    };
};

export const saveTournament = async (candidate: TournamentPayload) => {
    const store = new DataStore();
    await store.open();
    if (!candidate.minimum_denomination || candidate.minimum_denomination === 0) {
        if (candidate.set_id) {
            const chipset = await getAction('chipsets', candidate.set_id);
            if (chipset && chipset.chips.length > 0) {
                candidate.minimum_denomination = chipset.chips[0].value;
            }
        }
    }
    var tournament = Factory.tournament(candidate);
    await store.putValue('tournaments', tournament);
    return DataStore.route('tournaments', RouteAction.read, tournament);
};

export const tournamentUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as TournamentPayload;
    const route = await saveTournament(data);
    return redirect(route);
};

export const tournamentDeleteAction: ActionFunction = async (args) => {
    await deleteAction('tournaments', args);
    return redirect(DataStore.route('tournaments', RouteAction.list));
};
