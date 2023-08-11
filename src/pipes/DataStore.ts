import { IDBPDatabase, IndexNames, StoreNames, StoreValue, openDB } from 'idb';
import { DataStoreTableNamesV1, PTDSchemaV1 } from './DataStoreSchemaV1';
import { HydrationController } from '../controllers/HydrationController';

export const DataStoreVersion = 1;
const DEBUG = false;
const DataStoreName = 'poker_tournament_forge';

export type PTDSchemaCurrent = PTDSchemaV1;
export const PTDStoreTableNamesCurrent = DataStoreTableNamesV1;
export type ValueType = StoreValue<PTDSchemaCurrent, StoreNames<PTDSchemaCurrent>>;
export type IndexType = IndexNames<PTDSchemaCurrent, StoreNames<PTDSchemaCurrent>>;

export enum RouteAction {
    list, forge, read, delete, share
}

export class DataStore {
    static NEW_ID = 'new';
    private db?: IDBPDatabase<PTDSchemaCurrent>;

    public async open(tableNames = PTDStoreTableNamesCurrent) {
        try {
            this.db = await openDB<PTDSchemaCurrent>(DataStoreName, DataStoreVersion, {
                upgrade(db) {
                    for (const tableName of tableNames) {
                        if (db.objectStoreNames.contains(tableName)) {
                            continue;
                        }
                        db.createObjectStore(tableName, { autoIncrement: false, keyPath: 'id' });
                    }
                },
            });
        } catch (error) {
            return false;
        }
        return true;
    }

    private static actionPath(action: RouteAction, element?: ValueType): string {
        switch (action) {
            case RouteAction.list:
                return '';

            case RouteAction.delete:
                if (element) {
                    return element.id;
                }
                return '';
            
            case RouteAction.read:
                return element?.id || 'new';

            case RouteAction.forge:
                return `${element?.id || 'new'}/forge`;

            case RouteAction.share:
                return `share?p=${HydrationController.encode(element)}`;

            default:
                throw Error(`Unknown action[${action}] for element:[${element}]`);
        }
    }

    static matchesNewRoute(candidate?: string): boolean {
        if (!candidate) {
            return false;
        }
        const components = candidate.split('/');
        return components[components.length - 1] === 'new';
    }

    static route(tableName: StoreNames<PTDSchemaCurrent>, action: RouteAction, element?: ValueType): string {
        return `/${tableName}/${DataStore.actionPath(action, element)}`;
    }

    public async getValue<StoreName extends StoreNames<PTDSchemaCurrent>>(tableName: StoreName, id: string | IDBKeyRange): Promise<undefined | StoreValue<PTDSchemaCurrent, StoreName>> {
        if (this.db === undefined) {
            throw Error(`DataStore '${DataStoreName}' v${DataStoreVersion} not open`);
        }
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        const result = await store.get(id);
        if (DEBUG) {
            console.log(`[${tableName}] Get `, JSON.stringify(result));
        }
        tx.commit();
        return result;
    }

    public async countAll(tableName: StoreNames<PTDSchemaCurrent>) {
        if (this.db === undefined) {
            throw Error(`DataStore '${DataStoreName}' v${DataStoreVersion} not open`);
        }
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        const result = await store.count();
        if (DEBUG) {
            console.log(`[${tableName}] Count `, result);
        }
        tx.commit();
        return result;
    }
    
    public async getAllValue<StoreName extends StoreNames<PTDSchemaCurrent>>(tableName: StoreName, query?: string | IDBKeyRange): Promise<StoreValue<PTDSchemaCurrent, StoreName>[]> {
        if (this.db === undefined) {
            throw Error(`DataStore '${DataStoreName}' v${DataStoreVersion} not open`);
        }
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        let result = await store.getAll(query);
        if (DEBUG) {
            console.log(`[${tableName}] Get All `, JSON.stringify(result));
        }
        tx.commit();
        return result;
    }

    public async putValue(tableName: StoreNames<PTDSchemaCurrent>, value: ValueType) {
        if (this.db === undefined) {
            throw Error(`DataStore '${DataStoreName}' v${DataStoreVersion} not open`);
        }
        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        const date = new Date();
        if (!value.created_at) {
            value.created_at = date;
        }
        value.updated_at = date;
        const result = await store.put(value);
        if (DEBUG) {
            console.log(`[${tableName}] Put `, JSON.stringify(result));
        }
        tx.commit();
        return result;
    }

    public async putBulkValue(tableName: StoreNames<PTDSchemaCurrent>, values: StoreValue<PTDSchemaCurrent, StoreNames<PTDSchemaCurrent>>[]) {
        if (this.db === undefined) {
            throw Error(`DataStore '${DataStoreName}' v${DataStoreVersion} not open`);
        }
        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        const date = new Date();
        for (const value of values) {
            if (!value.created_at) {
                value.created_at = date;
            }
            value.updated_at = date;
            const result = await store.put(value);
            if (DEBUG) {
                console.log(`[${tableName}] Put Bulk `, JSON.stringify(result));
            }
        }
        tx.commit();
        return true;
    }

    public async deleteValue(tableName: StoreNames<PTDSchemaCurrent>, id: string) {
        if (this.db === undefined) {
            throw Error(`DataStore '${DataStoreName}' v${DataStoreVersion} not open`);
        }
        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        const result = await store.get(id);
        if (!result) {
            console.error('Id not found', id);
            return result;
        }
        await store.delete(id);
        if (DEBUG) {
            console.log(`[${tableName}] Delete`, id);
        }
        tx.commit();
        return id;
    }

    public async clear(tableName: StoreNames<PTDSchemaCurrent>) {
        if (this.db === undefined) {
            throw Error(`DataStore '${DataStoreName}' v${DataStoreVersion} not open`);
        }

        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        const result = await store.clear();
        if (DEBUG) {
            console.log(`[${tableName}] DeleteAll`);
        }
        tx.commit();
        return result;
    }
}
