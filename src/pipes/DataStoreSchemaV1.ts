import { Storable, Uniquable } from "./Storable";

export const TARGET_STRATEGY = {
    STRICT: "STRICT",
    AGGRESSIVE: "AGGRESSIVE",
    MAX: "MAX",
} as const;
type ObjectValues<T> = T[keyof T];
export type TargetStrategy = ObjectValues<typeof TARGET_STRATEGY>;

export interface SettingsPayload extends Storable {
    should_graph_levels: boolean;
}

export interface ColorUpBreakpoint {
    denomination: number;
    threshold: number;
}

export interface TournamentPayload extends Storable {
    set_id: string;
    tournament_name: string;
    start_time: number;
    target_duration: number;
    level_duration: number;
    break_duration: number;
    starting_stack: number;
    player_count: number;
    target_blind_ratio: number;
    target_strategy: TargetStrategy;
    color_up_breakpoints: ColorUpBreakpoint[];
    minimum_denomination: number;
    generator_version: number;
    level_overflow: number;
    break_threshold: number[];
    initial_big_blind_multiple: number;
    minimum_color_up_multiple: number;
    games: string;
    levels: TournamentLevelPayload[];
}

export interface TournamentLevelPayload extends Omit<Uniquable, "id"> {
    type: string;
    is_keyframe: boolean;
    is_expected_conclusion: boolean;
    note?: string;
    description?: string;
    duration?: number;
    denominations?: number[];
    breakOffset: number;
    game?: string;
}

export interface ChipSetPayload extends Storable {
    name: string;
    chips: ChipPayload[];
}

export interface ChipPayload extends Uniquable {
    value: number;
    count: number;
    color: string;
}
