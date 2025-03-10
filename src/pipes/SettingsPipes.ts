import { ActionFunction, redirect } from "react-router-dom";
import { SettingsPayload } from "./DataStoreSchemaV1";
import { populateAction, store } from "./DataStore";

export type SettingsLoaderResult = { settings: SettingsPayload, isPersistent: boolean };
export const settingsLoader = async (): Promise<SettingsLoaderResult> => {
    const isPersistent = navigator.storage && await navigator.storage.persisted();

    const settings = await store.settings.toArray();
    if (settings.length === 0) {
        await populateAction(['settings']);
        return { settings: settings[0], isPersistent };
    }
    if (settings.length > 1) {
        console.error('Loaded more than one settings object.', settings);
    }

    return { settings: settings[0], isPersistent };
};

export const settingsUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as SettingsPayload;
    const result = await store.settings.put(data);
    if (!result) {
        throw Error('Failed to update settings');
    }
    return redirect('/settings');
};
