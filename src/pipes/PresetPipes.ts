import { ChipSetPayload, TournamentPayload } from "../pipes/DataStoreSchemaV1";
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

function zipChipSet(name: string, offset: number, values: number[], counts: number[]): ChipSetPayload {
    if (values.length !== counts.length) {
        throw Error();
    }
    const date = new Date();
    date.setMilliseconds(date.getMilliseconds() + offset);
    let set = Factory.chipSet({ name: name, created_at: date, chips: [], id: name.toLowerCase().replace(/\s+/g, '') }, true);
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
            return tournamentPresets();
        case 'chipsets':
            return chipsetPresets();
    }

    throw Error(`Unknown table: ${tableName}`);
}

function zipTournament(offset: number, set_id: string, payload: Partial<TournamentPayload>): TournamentPayload {
    let tournament = Factory.tournament(payload, true);
    tournament.set_id = set_id;
    const date = new Date();
    date.setMilliseconds(date.getMilliseconds() + offset);
    tournament.created_at = date;
    tournament.updated_at = date;
    return tournament;
}


export const tournamentPresets = () => {
    return [
        zipTournament(1, 'default', {
            "tournament_name": "Two Table",
            "start_time": 0,
            "target_duration": 0,
            "level_duration": 15,
            "break_duration": 10,
            "starting_stack": 10000,
            "player_count": 16,
            "target_blind_ratio": 0.55,
            "target_strategy": "AGGRESSIVE",
            "color_up_breakpoints": [
                { "denomination": 25, "threshold": 125 },
                { "denomination": 100, "threshold": 900 },
                { "denomination": 500, "threshold": 1000 },
                { "denomination": 1000, "threshold": 6000 },
                { "denomination": 5000, "threshold": 30000 },
                { "denomination": 25000, "threshold": 175000 },
                { "denomination": 100000, "threshold": 600000 },
                { "denomination": 500000, "threshold": 3500000 },
                { "denomination": 2500000, "threshold": 15000000 }
            ],
            "minimum_denomination": 25,
            "generator_version": 1,
            "level_overflow": 3,
            "break_threshold": [4, 5],
            "initial_big_blind_multiple": 2,
            "minimum_color_up_multiple": 2.5,
            "levels": [
                {
                    "id": "febbe6f7-e6c9-42a2-9dbd-2d58f54f9ef6",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        25,
                        50
                    ],
                    "breakOffset": 0
                },
                {
                    "id": "64db1a0a-5f05-448e-8e2a-756028a234c1",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        50,
                        100
                    ],
                    "breakOffset": 0
                },
                {
                    "id": "045888d9-b209-43bd-b53d-4608c4d36af5",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        75,
                        150
                    ],
                    "breakOffset": 0
                },
                {
                    "id": "204a6857-9bf6-4225-bedc-6826fe0285c1",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        125,
                        250
                    ],
                    "breakOffset": 0
                },
                {
                    "id": "c0e491c4-ab51-4802-8f32-b619eaeaadd7",
                    "type": "break",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "Color up T25",
                    "description": "",
                    "duration": 10,
                    "denominations": [
                        25
                    ],
                    "breakOffset": 1
                },
                {
                    "id": "c93d9911-67a8-4562-be77-5de938f6ba39",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        200,
                        400
                    ],
                    "breakOffset": 1
                },
                {
                    "id": "8a0cadbd-dbc0-49d5-8d98-15f0ed45bac3",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        300,
                        600
                    ],
                    "breakOffset": 1
                },
                {
                    "id": "f7bbd90c-acba-4e0e-b0ef-688f17b88165",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        500,
                        1000
                    ],
                    "breakOffset": 1
                },
                {
                    "id": "82e67ad3-6319-49d4-94c8-fba739d6224b",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        800,
                        1600
                    ],
                    "breakOffset": 1
                },
                {
                    "id": "232e1151-58fe-4763-aa3b-aa0f8f62115f",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        1200,
                        2400
                    ],
                    "breakOffset": 1
                },
                {
                    "id": "8fdad12f-ffdf-4a93-9024-edd819389401",
                    "type": "break",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "Color up T100, T500",
                    "description": "",
                    "duration": 10,
                    "denominations": [
                        100,
                        500
                    ],
                    "breakOffset": 2
                },
                {
                    "id": "d33000b5-4993-48be-a2fc-e5f040b75f26",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        2000,
                        4000
                    ],
                    "breakOffset": 2
                },
                {
                    "id": "f1f2b950-b36c-42ca-9ad9-03ef1a56d752",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        3000,
                        6000
                    ],
                    "breakOffset": 2
                },
                {
                    "id": "a1c7e269-f107-4903-b420-44d0cbbc6e5b",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": true,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        5000,
                        10000
                    ],
                    "breakOffset": 2
                },
                {
                    "id": "ba426c5f-b2f8-489c-bf73-465ac4845b6c",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        8000,
                        16000
                    ],
                    "breakOffset": 2
                },
                {
                    "id": "8c5dce59-47c2-4d94-9516-412379405bd3",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        12000,
                        24000
                    ],
                    "breakOffset": 2
                },
                {
                    "id": "f2d78361-af0a-4d57-89a3-1697e273a3fb",
                    "type": "round",
                    "is_keyframe": false,
                    "is_expected_conclusion": false,
                    "note": "",
                    "description": "",
                    "duration": 15,
                    "denominations": [
                        19000,
                        38000
                    ],
                    "breakOffset": 2
                }
            ],
            "is_preset": false
        })
    ];
};

export const chipsetPresets = () => {
    return [
        zipChipSet(
            'Default',
            1,
            [25, 100, 500, 1000, 5000, 25_000, 100_000, 500_000, 2_500_000],
            [300, 300, 100, 400, 300, 200, 200, 150, 500]
        ),

        zipChipSet(
            'Classic',
            2,
            [25, 100, 500, 1000, 5000],
            [160, 160, 80, 160, 28]
        ),

        zipChipSet(
            'Big Money',
            3,
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
