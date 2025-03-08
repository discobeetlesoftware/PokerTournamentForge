import { ActionFunctionArgs } from "react-router-dom";
import { DataStore, PTDSchemaCurrent } from "./DataStore";
import { StoreNames, StoreValue } from "idb";
import { Uniquable } from "./Storable";
import { Factory } from "./Factory";

export const generate = <
        StoreName extends StoreNames<PTDSchemaCurrent>,
        ValueType extends StoreValue<PTDSchemaCurrent, StoreName>
    >(tableName: StoreName, candidate?: Partial<ValueType>): NonNullable<StoreValue<PTDSchemaCurrent, StoreName>> => {
    switch (tableName) {
        case 'settings':
            return Factory.settings(candidate);
        case 'tournaments':
            return Factory.tournament(candidate);
        case 'chipsets':
            return Factory.chipSet(candidate);
    }

    throw Error(`Unknown table: ${tableName}`);
}

export const deleteAction = async (tableName: StoreNames<PTDSchemaCurrent>, args: ActionFunctionArgs) => {
    if (args.request.method !== 'DELETE') {
        throw Error(`Unknown method '${args.request.method}', expecting DELETE`);
    }

    const data = await args.request.json() as Uniquable;
    const id = data.id;
    if (id) {
        const store = new DataStore();
        await store.open();
        return store.deleteValue(tableName, id).then(() => { return true });
    }
    return Promise.resolve(false);
};

export const listAction = async <StoreName extends StoreNames<PTDSchemaCurrent>>(tableName: StoreName) => {
    const store = new DataStore();
    await store.open();
    let results = await store.getAllValue(tableName);
    return (results || []).sort((a, b) => {
        return a.created_at.getMilliseconds() - b.created_at.getMilliseconds()
    });
}

export const getAction = async <StoreName extends StoreNames<PTDSchemaCurrent>>(tableName: StoreName, query?: string | IDBKeyRange) => {
    if (!query) {
        throw Error(`Cannot load from ${tableName} without an id.`);
    }
    const store = new DataStore();
    await store.open();
    let results = await store.getValue(tableName, query);
    return results || generate(tableName);
}

export const putAction = async <StoreName extends StoreNames<PTDSchemaCurrent>, ValueType extends StoreValue<PTDSchemaCurrent, StoreName>>(tableName: StoreName, candidate: Partial<ValueType>) => {
    const store = new DataStore();
    await store.open();
    if (candidate.is_preset) {
        candidate.id = '';
    }
    const value = generate(tableName, candidate);
    return store.putValue(tableName, value).then(() => { return value }, () => { return undefined });
}
