import {v4 as uuid} from 'uuid';
import { ChipPayload, ChipSetPayload, SettingsPayload, TARGET_STRATEGY, TournamentLevelPayload, TournamentPayload } from './DataStoreSchemaV1';
import { DataStore } from './DataStore';
import { Storable, Uniquable } from './Storable';

export class Factory {
    static freshenStorable<T extends Storable>(value: Partial<T>, forcePreset: boolean) {
        if (typeof value.created_at === 'string') {
            value.created_at = new Date(value.created_at);
        }
        if (typeof value.updated_at === 'string') {
            value.updated_at = new Date(value.updated_at);
        }
        if (!forcePreset && value.is_preset) {
            value.is_preset = false;
        } else if (forcePreset) {
            value.is_preset = true;
        }
    }

    static freshenUniquable<T extends Uniquable>(value: Partial<T>) {
        if (DataStore.matchesNewRoute(value.id) || value?.id === '') {
            value.id = uuid();
        }
    }

    static DEFAULT_SETTINGS: SettingsPayload = {
        should_graph_levels: false,
        id: 'user',
        is_preset: false
    };

    static settings(values: Partial<SettingsPayload> = {}, forcePreset = false): SettingsPayload {
        this.freshenStorable(values, forcePreset);
        this.freshenUniquable(values);
        return {
            ...Factory.DEFAULT_SETTINGS,
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
        this.freshenUniquable(values);
        return {
            ...Factory.DEFAULT_CHIP,
            ...values
        };
    }

    static DEFAULT_CHIP_SET: ChipSetPayload = {
        name: '',
        chips: [],
        id: 'new',
        is_preset: false
    };

    static chipSet(values: Partial<ChipSetPayload> = {}, forcePreset = false): ChipSetPayload {
        this.freshenStorable(values, forcePreset);
        this.freshenUniquable(values);
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

    static tournament(values: Partial<TournamentPayload> = {}, forcePreset = false): TournamentPayload {
        this.freshenStorable(values, forcePreset);
        this.freshenUniquable(values);

        return {
            ...Factory.DEFAULT_TOURNAMENT,
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
        this.freshenUniquable(values);
        return {
            ...Factory.DEFAULT_LEVEL,
            ...values
        };
    }
}
