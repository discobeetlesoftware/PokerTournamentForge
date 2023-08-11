import { useEffect, useState } from "react";
import { ChipSetPayload, TournamentPayload } from "../pipes/DataStoreSchemaV1";
import { Factory } from "../pipes/Factory";
import { DataStore } from "../pipes/DataStore";
import { Color } from "../models/Color";

interface PresetData {
    sets: ChipSetPayload[];
    tournaments: TournamentPayload[];
}

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
    let set = Factory.chipSet({ name: name, chips: [], is_preset: true });
    for (let [value, count] of zip(values, counts)) {
        set.chips.push(Factory.chip({
            value: value,
            count: count,
            color: chipColors[value] || Color.white
        }))
    }
    return set;
}

function generatePresets(): PresetData {
    var presets: PresetData = {
        sets: [],
        tournaments: []
    };

    presets.sets.push(zipChipSet(
        'Default',
        [25, 100, 500, 1000, 5000, 25_000, 100_000, 500_000, 2_500_000],
        [300, 300, 100, 400, 300, 200, 200, 150, 500]
    ));

    presets.sets.push(zipChipSet(
        'Classic',
        [25, 100, 500, 1000, 5000],
        [160, 160, 80, 160, 28]
    ));

    presets.sets.push(zipChipSet(
        'Big Money MN',
        [500, 1000, 5000, 25000, 100000],
        [60, 120, 120, 80, 20]
    ));

    return presets;
}

export default function usePresets() {
    const [hasPresets, setHasPresets] = useState(0);

    useEffect(() => {
        const configurePresets = async () => {
            if (hasPresets) {
                return;
            }
            
            const store = new DataStore();
            const isOpen = await store.open();
            const presets = generatePresets();
            
            if (!isOpen) {
                throw Error('Failed to open store');
            }
            const chipCount = await store.countAll('chipsets');
            if (chipCount === 0) {
                await store.putBulkValue('chipsets', presets.sets);
            }
            const tournamentCount = await store.countAll('tournaments');
            if (tournamentCount === 0) {
                await store.putBulkValue('tournaments', presets.tournaments);
            }
            const settingsCount = await store.countAll('settings');
            if (settingsCount === 0) {
                await store.putValue('settings', Factory.settings());
            }
        }

        if (!hasPresets) {
            const timer = setTimeout(configurePresets, 100);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [hasPresets]);

    return () => {
        setHasPresets(hasPresets + 1);
    };
}
