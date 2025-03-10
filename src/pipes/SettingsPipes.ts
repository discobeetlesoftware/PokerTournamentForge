import { ActionFunction, redirect } from "react-router-dom";
import { SettingsPayload } from "./DataStoreSchemaV1";
import { populateAction, store } from "./DataStore";

export const settingsLoader = async (): Promise<SettingsPayload> => {
    const settings = await store.settings.toArray();
    if (settings.length === 0) {
        await populateAction(['settings']);
        return settings[0];
    }
    if (settings.length > 1) {
        console.error('Loaded more than one settings object.', settings);
    }
    return settings[0];
};

export const settingsUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as SettingsPayload;
    const result = await store.settings.put(data);
    if (!result) {
        throw Error('Failed to update settings');
    }
    return redirect('/settings');
};
