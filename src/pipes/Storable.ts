import { DataStore } from "./DataStore";

export interface Uniquable {
    id: string;
}

export interface Storable extends Uniquable {
    created_at: Date;
    updated_at: Date;
    is_preset: boolean;
}

export enum StorableKind {
    preset = 'preset',
    custom = 'custom',
    unsaved = 'unsaved',
    foreign = 'foreign'
}

export const determineStorableKind = (storable: Storable, id?: string): StorableKind => {
    if (DataStore.matchesNewRoute(id)) {
        return StorableKind.unsaved;
    }
    if (storable.is_preset) {
        return StorableKind.preset;
    }
    return StorableKind.custom;
}

export const contextualDescriptor = (kind: StorableKind): string => {
    switch (kind) {
        case StorableKind.preset:
            return 'Clone';
        case StorableKind.custom:
            return 'Update';
        case StorableKind.unsaved:
            return 'Create';
        case StorableKind.foreign:
            return 'Clone';
    }
}
