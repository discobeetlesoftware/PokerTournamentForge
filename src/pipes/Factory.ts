import {v4 as uuid} from 'uuid';
import { ChipPayload, ChipSetPayload, SettingsPayload, TARGET_STRATEGY, TournamentLevelPayload, TournamentPayload } from './DataStoreSchemaV1';
import { DataStore } from './DataStore';
import { Uniquable } from './Storable';

export class Factory {

    private static id(values: Partial<Uniquable>): string {
        if (values?.id) {
            return values.id;
        }
        return uuid();
    };

    static DEFAULT_SETTINGS: SettingsPayload = {
        should_graph_levels: false,
        id: 'user',
        is_preset: false
    };

    static settings(values: Partial<SettingsPayload> = {}): SettingsPayload {
        if (typeof values.created_at === 'string') {
            values.created_at = new Date(values.created_at);
        }
        if (typeof values.updated_at === 'string') {
            values.updated_at = new Date(values.updated_at);
        }
        return {
            ...Factory.DEFAULT_SETTINGS,
            id: this.id(values),
            ...values
        };
    }

    static DEFAULT_CHIP: ChipPayload = {
        value: 0,
        count: 0,
        color: '',
        id: 'new'
    };
    
    static chip(values: Partial<ChipPayload> = {}): ChipPayload {
        if (DataStore.matchesNewRoute(values.id) || values?.id === '') {
            delete values.id;
        }
        return {
            ...Factory.DEFAULT_CHIP,
            id: this.id(values),
            ...values
        };
    }

    static DEFAULT_CHIP_SET: ChipSetPayload = {
        name: '',
        chips: [],
        id: 'new',
        is_preset: false
    };

    static chipSet(values: Partial<ChipSetPayload> = {}): ChipSetPayload {
        if (DataStore.matchesNewRoute(values.id) || values?.id === '') {
            delete values.id;
        }
        if (typeof values.created_at === 'string') {
            values.created_at = new Date(values.created_at);
        }
        if (typeof values.updated_at === 'string') {
            values.updated_at = new Date(values.updated_at);
        }
        if (values.chips) {
            values.chips = [...values.chips].sort((l, r) => {
                if (l.value === r.value) {
                    return 0;
                }
                if (l.value < r.value) {
                    return -1;
                }
                return 1;
            });
        }
        return {
            ...Factory.DEFAULT_CHIP_SET,
            id: this.id(values),
            ...values
        };
    };

    static DEFAULT_TOURNAMENT: TournamentPayload = {
        id: 'new',
        set_id: '',
        tournament_name: '',
        start_time: 0,
        target_duration: 0,
        level_duration: 20,
        break_duration: 10,
        starting_stack: 20_000,
        player_count: 10,
        target_blind_ratio: 0.4,
        target_strategy: TARGET_STRATEGY.AGGRESSIVE,
        color_up_threshold: 0.15,
        minimum_denomination: 25,
        generator_version: 1,
        level_overflow: 3,
        break_threshold: [3, 6],
        initial_big_blind_multiple: 2,
        minimum_color_up_multiple: 2.5,
        games: [],
        levels: [],
        is_preset: false
    };

    static tournament(values: Partial<TournamentPayload> = {}): TournamentPayload {
        if (DataStore.matchesNewRoute(values.id) || values?.id === '') {
            delete values.id;
        }
        if (typeof values.created_at === 'string') {
            values.created_at = new Date(values.created_at);
        }
        if (typeof values.updated_at === 'string') {
            values.updated_at = new Date(values.updated_at);
        }
        return {
            ...Factory.DEFAULT_TOURNAMENT,
            id: this.id(values),
            ...values
        };
    };

    static DEFAULT_LEVEL: TournamentLevelPayload = {
        id: 'new',
        type: '',
        is_keyframe: false,
        is_expected_conclusion: false,
        note: '',
        description: '',
        duration: 0,
        denominations: []
    };

    static level(values: Partial<TournamentLevelPayload> = {}): TournamentLevelPayload {
        if (DataStore.matchesNewRoute(values.id) || values?.id === '') {
            delete values.id;
        }
        return {
            ...Factory.DEFAULT_LEVEL,
            id: this.id(values),
            ...values
        };
    }
}
