import { ActionFunction, LoaderFunctionArgs, redirect } from "react-router-dom";
import { chipListLoader } from "./ChipSetPipes";
import { DataStore, RouteAction, store } from "./DataStore";
import { ChipSetPayload, SettingsPayload, TournamentPayload } from "./DataStoreSchemaV1";
import { StorableKind, determineStorableKind } from "./Storable";
import { settingsLoader } from "./SettingsPipes";
import { HydrationController } from "../controllers/HydrationController";

export type EnrichedTournamentPayload = { 
    kind: StorableKind,
    tournament: TournamentPayload,
    settings: SettingsPayload,
    chipsets: ChipSetPayload[],
};

export const tournamentListLoader = async () => {
    return store.tournaments.toArray();
}

export const tournamentLoader = async (args: LoaderFunctionArgs): Promise<TournamentPayload> => {
    if (!args.params.id) {
        throw Error('Missing tournament id.');
    }
    let tournament = await store.tournaments.where('id').equals(args.params.id).first();
    if (!tournament) {
        throw Error('Failed to load tournament.');
    }
    return tournament;
};

const enrichedTournamentLoader = async (args: LoaderFunctionArgs, chipsetFilter?: (tournament: TournamentPayload, candidate: ChipSetPayload) => boolean): Promise<EnrichedTournamentPayload> => {
    const tournament = await tournamentLoader(args);
    const chipsets = await chipListLoader();
    const settings = await settingsLoader();
    return {
        kind: determineStorableKind(tournament),
        tournament: tournament,
        settings: settings.settings,
        chipsets: chipsetFilter ? chipsets.filter((chipset => {
            return chipsetFilter(tournament, chipset);
        })) : chipsets,
    };
}

export const sharedTournamentLoader = async (args: LoaderFunctionArgs) => {
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

export const tournamentViewLoader = async (args: LoaderFunctionArgs): Promise<EnrichedTournamentPayload> => {
    return enrichedTournamentLoader(args, ((tournament, chipset) => chipset.id === tournament.set_id));
};

export const tournamentEditLoader = async (args: LoaderFunctionArgs) => {
    return enrichedTournamentLoader(args);
};

export const tournamentUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as TournamentPayload;
    let result = await store.tournaments.put(data);
    if (!result) {
        throw Error('Failed to update tournament');
    }
    return redirect(DataStore.route('tournaments', RouteAction.read, data));
};

export const tournamentDeleteAction: ActionFunction = async (args) => {
    if (!args.params.id) {
        throw Error('Missing tournament id.');
    }
    await store.tournaments.delete(args.params.id);
    return redirect(DataStore.route('tournaments', RouteAction.list));
};
