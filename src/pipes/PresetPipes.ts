import { ChipSetPayload } from "../pipes/DataStoreSchemaV1";
import { Factory } from "../pipes/Factory";
import { DataStore, PTDSchemaCurrent } from "../pipes/DataStore";
import { Color } from "../models/Color";
import { StoreNames, StoreValue } from "idb";

const chipColors: { [denom: number]: Color } = {
    1: Color.white,
    5: Color.red,
    10: Color.blue,
    25: Color.green,
    50: Color.orange,
    100: Color.black,
    500: Color.purple,
    1000: Color.yellow,
    5000: Color.pink,
    10000: Color.teal,
    25000: Color.lime,
    50000: Color.brown,
    100000: Color.amber,
    500000: Color.cyan,
    1000000: Color.indigo
};

function* zip<L, R>(left: L[], right: R[]): Generator<[L, R], void, void> {
    const minLength = Math.min(left.length, right.length);

    for (let index = 0; index < minLength; index++) {
        yield [left[index], right[index]];
    }
}

function zipChipSet(name: string, values: number[], counts: number[]): ChipSetPayload {
    if (values.length !== counts.length) {
        throw Error();
    }
    let set = Factory.chipSet({ name: name, chips: [] }, true);
    for (let [value, count] of zip(values, counts)) {
        set.chips.push(Factory.chip({
            value: value,
            count: count,
            color: chipColors[value] || Color.white
        }))
    }
    return set;
}

export const generatePresets = <StoreName extends StoreNames<PTDSchemaCurrent>>(tableName: StoreName): NonNullable<StoreValue<PTDSchemaCurrent, StoreName>[]> => {
    switch (tableName) {
        case 'settings':
            return [Factory.settings()];
        case 'tournaments':
            return [];
        case 'chipsets':
            return chipsetPresets();
    }

    throw Error(`Unknown table: ${tableName}`);
}

export const chipsetPresets = () => {
    return [
        zipChipSet(
            'Default',
            [25, 100, 500, 1000, 5000, 25_000, 100_000, 500_000, 2_500_000],
            [300, 300, 100, 400, 300, 200, 200, 150, 500]
        ),

        zipChipSet(
            'Classic',
            [25, 100, 500, 1000, 5000],
            [160, 160, 80, 160, 28]
        ),

        zipChipSet(
            'Big Money MN',
            [500, 1000, 5000, 25000, 100000],
            [60, 120, 120, 80, 20]
        )
    ];
};

export const populateAction = async <StoreName extends StoreNames<PTDSchemaCurrent>>(tableNames: StoreName[]) => {
    const store = new DataStore();
    const isOpen = await store.open();
    if (!isOpen) {
        throw Error('Failed to open store');
    }
    return Promise.all(tableNames.map(name => {
        store.countAll(name).then(count => {
            if (count === 0) {
                return store.putBulkValue(name, generatePresets(name));
            } else {
                return Promise.resolve(true);
            }
        });
    }));
};

export const clearAction = async <StoreName extends StoreNames<PTDSchemaCurrent>>(tableNames: StoreName[]) => {
    const store = new DataStore();
    const isOpen = await store.open();
    if (!isOpen) {
        throw Error('Failed to open store');
    }
    await Promise.all(tableNames.map(name => store.clear(name)));
    return populateAction(tableNames);
};
