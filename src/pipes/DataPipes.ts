import { ActionFunctionArgs } from "react-router-dom";
import { DataStore, PTDSchemaCurrent } from "./DataStore";
import { StoreNames, StoreValue } from "idb";
import { Uniquable } from "./Storable";
import { Factory } from "./Factory";
import { SettingsPayload } from "./DataStoreSchemaV1";

export const deleteAction = async (tableName: StoreNames<PTDSchemaCurrent>, args: ActionFunctionArgs): Promise<boolean> => {
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

export const listAction = async <StoreName extends StoreNames<PTDSchemaCurrent>>(tableName: StoreName): Promise<StoreValue<PTDSchemaCurrent, StoreName>[]> => {
    const store = new DataStore();
    await store.open();
    let results = await store.getAllValue(tableName);
    return results || [];
}

export const getAction = async <StoreName extends StoreNames<PTDSchemaCurrent>>(tableName: StoreName, query: string | IDBKeyRange): Promise<undefined | StoreValue<PTDSchemaCurrent, StoreName>> => {
    const store = new DataStore();
    await store.open();
    let results = await store.getValue(tableName, query);
    return results;
}

// export const chipSetLoader = async <StoreName extends StoreNames<PTDSchemaCurrent>>(tableName: StoreName, args: ActionFunctionArgs): Promise<StoreValue<PTDSchemaCurrent, StoreName>> => {
//     const { id } = args.params;
//     if (!id) {
//         throw Error(`Cannot load from '${tableName}' without an id.`);
//     }
//     if (DataStore.matchesNewRoute(id)) {
//         let v = Factory.generator(tableName);
//         v()
//     }
//     const store = new DataStore();
//     await store.open();
//     const set = await store.getValue('chipsets', id);
//     if (!set) {
//         throw Error('Chip set not found.');
//     }
//     return set as ChipSetPayload;
// };


export const updateAction = async <ResultType>(tableName: StoreNames<PTDSchemaCurrent>): Promise<ResultType> => {
    throw Error();
};

// get(query: StoreKey<DBTypes, StoreName> | IDBKeyRange): Promise<StoreValue<DBTypes, StoreName> | undefined>;

// export const updateAction_ = async (tableName: StoreNames<PTDSchemaCurrent>, args: ActionFunctionArgs) => {
//     const data = await request.formData();
//     const store = new DataStore();
//     await store.open();

//     const chips = Factory.extractIndexedValues<ChipPayload>(data, 'chips').map(chip => {
//         return Factory.chip(chip);
//     });
//     const name = data.get('name') as string;
//     let id = data.get('id') as string;
//     const values = { name: name, chips: chips, id: id };
//     var set = Factory.chipSet(values);
//     await store.putValue('chipsets', set);
//     return redirect(DataStore.route('chipsets', RouteAction.list));
// }
