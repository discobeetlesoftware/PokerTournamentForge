import { ActionFunction, redirect } from "react-router-dom";
import { SettingsPayload } from "./DataStoreSchemaV1";
import { generate, listAction, putAction } from "./DataPipes";

export const settingsLoader = async (): Promise<SettingsPayload> => {
    const settings = await listAction('settings');
    if (settings.length === 0) {
        return generate('settings');
    }
    if (settings.length > 1) {
        console.error('Loaded more than one settings object.', settings);
    }
    return settings[0];
};

export const settingsUpdateAction: ActionFunction = async ({ request }) => {
    const data = await request.json() as SettingsPayload;
    const result = await putAction('settings', data);
    if (!result) {
        throw Error('Failed to update settings');
    }
    return redirect('/settings');
};
