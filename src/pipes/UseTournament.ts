import { ChipPayload, ChipSetPayload, TARGET_STRATEGY, TournamentLevelPayload, TournamentPayload } from "./DataStoreSchemaV1";
import { configuration } from "../configuration";
import { Factory } from "./Factory";

const DEFAULT = configuration.defaults;

export function estimateFinalBlind(payload: TournamentPayload): number {
    return (payload.player_count * payload.starting_stack) / 20.0;
}

export function baseDenomination(payload: TournamentPayload, chip?: ChipPayload): number {
    if (payload.minimum_denomination > 0) {
        return payload.minimum_denomination;
    }
    if (!chip || chip.value === 0) {
        return DEFAULT.minimum_denomination;
    }
    return chip.value;
}

export function roundToDenomination(candidate: number, chip: ChipPayload): number {
    if (!chip || chip.value === 0) {
        throw Error(`Cannot round '${candidate}' for chip${!chip ? '?' : ''}.value of 0`);
    }
    return Math.max(chip.value, Math.round(candidate / chip.value) * chip.value);
}

export function nextBlind(smallBlind: number, bigBlind: number, target: number, payload: TournamentPayload, set: ChipSetPayload, minimumChipIndex: number) {
    var chip = set.chips[minimumChipIndex];
    if (!chip) {
        throw Error(`Cannot calculate next blind for smallBlind[${smallBlind}] bigBlind[${bigBlind}] because the set called '${set.name}' contains no chips`);
    }
    const nextTarget = target + (target * payload.target_blind_ratio);
    var candidate = (() => {
        switch (payload.target_strategy) {
            case TARGET_STRATEGY.MAX:
                return bigBlind + (bigBlind * payload.target_blind_ratio);
            case TARGET_STRATEGY.AGGRESSIVE:
                return smallBlind + (smallBlind * payload.target_blind_ratio);
            case TARGET_STRATEGY.STRICT:
                return nextTarget;
        }
    })();
    var closestValue = roundToDenomination(candidate, chip);
    if (closestValue === 0) {
        return { smallBlind: chip.value, bigBlind: chip.value, closestChip: chip.value, target: nextTarget };
    }


    var closestChip = chip;
    for (let index = minimumChipIndex; index < set.chips.length; index++) {
        chip = set.chips[index];
        let nextValue = roundToDenomination(candidate, chip);
        if (Math.abs(candidate - nextValue) <= Math.abs(candidate - closestValue)) {
            closestValue = nextValue;
            closestChip = chip;
        }
    }

    switch (payload.target_strategy) {
        case TARGET_STRATEGY.MAX: {
            closestValue = roundToDenomination((closestValue / 2) - 1, set.chips[minimumChipIndex]);
            if (closestValue === smallBlind) {
                closestValue += set.chips[minimumChipIndex].value;
            }
            return {
                smallBlind: closestValue,
                bigBlind: closestValue * 2,
                closestChip: closestChip.value,
                target: nextTarget
            };
        }
        case TARGET_STRATEGY.AGGRESSIVE: {
            if (closestValue === smallBlind) {
                closestValue += set.chips[minimumChipIndex].value;
            }        
            return {
                smallBlind: closestValue,
                bigBlind: closestValue * 2,
                closestChip: closestChip.value,
                target: nextTarget
            };
        }
        case TARGET_STRATEGY.STRICT: {
            if (closestValue === smallBlind) {
                closestValue += set.chips[minimumChipIndex].value;
            }    
            return {
                smallBlind: closestValue,
                bigBlind: closestValue * 2,
                closestChip: closestChip.value,
                target: nextTarget
            };
        }
    }
}

// export function nextBlinds(smallBlind: number, bigBlind: number, target: number, payload: TournamentPayload, set: ChipSetPayload, minimumChipIndex: number) {
//     let candidate = nextBlind(smallBlind, bigBlind, target, payload, set, minimumChipIndex);

//     return {
//         smallBlind: candidate.nextBlind,
//         bigBlind: candidate.bigBlind,
//         target: candidate.target
//     }
    



    /*

    let largeCandidate = nextBlind(smallBlind + (smallBlind * payload.target_blind_ratio), payload, set)[0];//new small blind candidate
    let smallCandidate = smallBlind + bigBlind;// new big blind candidate
    let largeCandidateRatioDelta = Math.abs(payload.target_blind_ratio - (oldBlind / (largeCandidate * 3)));
    let smallCandidateRatioDelta = Math.abs(payload.target_blind_ratio - (oldBlind / (smallBlind + smallCandidate)));
    console.log(largeCandidate, smallCandidate);
    
    if (largeCandidate === smallBlind) {
        return [smallBlind, smallCandidate];
    }

    if (largeCandidateRatioDelta <= smallCandidateRatioDelta) {
        return []
    } else {
        return [smallBlind, smallCandidate];
    }*/

// }

export function generateTournament(payload: TournamentPayload, set: ChipSetPayload): TournamentLevelPayload[] {
    if (set.chips.length < 2) {
        return [];
    }
    console.log('==========================');
    var minimumChipIndex = 0;
    var smallBlind = baseDenomination(payload, set.chips[minimumChipIndex]);
    var bigBlind = smallBlind * payload.initial_big_blind_multiple;
    var target = smallBlind;
    var overflowCount = payload.level_overflow;
    var mark_is_expected_conclusion = false;
    const finalBlind = estimateFinalBlind(payload);
    const isOverflowing = function(): boolean { return bigBlind >= finalBlind; };
    const shouldOverflow = function(): boolean { return overflowCount >= 0; };
    const isExpectedConclusion = function(): boolean {
        if (isOverflowing()) {
            overflowCount -= 1;
        }
        if (mark_is_expected_conclusion) {
            return false;
        }
        if (overflowCount < payload.level_overflow) {
            mark_is_expected_conclusion = true;
            return true;
        }
        return false;
    }

    var lastBreakLevel = 0;
    var pendingColorUpBreaks: TournamentLevelPayload[] = [];
    var levels: TournamentLevelPayload[] = [];
    const [min, max] = payload.break_threshold;

    function pushBreak (level?: TournamentLevelPayload) {
        // console.log(min, max, pendingColorUpBreaks.length, level?'pushing':'+', lastBreakLevel, 'mindenom:', set.chips[minimumChipIndex].value);
        if (lastBreakLevel < min) {
            if (level) {
                pendingColorUpBreaks.push(level);
            }
            return false;
        }

        const colorUpBreak = pendingColorUpBreaks.shift();
        if (colorUpBreak) {
            if (level) {
                for (let denom of (level.denominations || [])) {
                    colorUpBreak.denominations?.push(denom);
                }
                colorUpBreak.note = `Color up T${colorUpBreak.denominations?.join(', ')}`
            }
            levels.push(colorUpBreak);
        } else if (level) {
            levels.push(level);
        } else if (lastBreakLevel >= max) {
            levels.push(Factory.level({
                type: 'break',
                duration: payload.break_duration,
            }));
        } else {
            return false;
        }
        return true;
    };

    while (!isOverflowing() || shouldOverflow()) {
        let level = Factory.level({
            type: 'round',
            duration: payload.level_duration,
            is_expected_conclusion: isExpectedConclusion(),
            denominations: [smallBlind, bigBlind]
        });
        levels.push(level);
        // console.log('pushed level ', levels.length, level.denominations);
        lastBreakLevel += 1;

        const shouldColorUp = (
                minimumChipIndex + 1 < set.chips.length // is there another chip to use?
            ) && (
                !isOverflowing() && (set.chips[minimumChipIndex].value / smallBlind) < payload.color_up_threshold // is the color up demanded by the color up threshold?
            ) && (
                (set.chips[minimumChipIndex].value <= set.chips[minimumChipIndex + 1].value / payload.minimum_color_up_multiple) || // is the current chip big enough relative to the next chip in set? (because if not we might as well just wait a level or two)
                (finalBlind / bigBlind < payload.minimum_color_up_multiple) // is the current bigBlind relative to the finalBlind below the minimum color up multiple? (this logic is probably wrong)
            )
             /*
            ) && (
                (finalBlind / bigBlind) > (payload.minimum_color_up_multiple * 1.1)
            )*/;
        if (shouldColorUp) {
            const colorUpChip = set.chips[minimumChipIndex];
            minimumChipIndex += 1;
            if (colorUpChip) {
                lastBreakLevel += pushBreak(Factory.level({
                    type: 'break',
                    duration: payload.break_duration,
                    denominations: [colorUpChip.value],
                    note: `Color up T${colorUpChip.value}`
                })) ? -lastBreakLevel : 0;
            }
            if (!set.chips[minimumChipIndex]) {
                console.warn('Not enough chips to generate complete structure with given configuration', JSON.stringify(payload));
                break;
            }
        } else if (!isOverflowing()) {
            lastBreakLevel += pushBreak() ? -lastBreakLevel : 0;
        }


        var { smallBlind, bigBlind, target } = nextBlind(smallBlind, bigBlind, target, payload, set, minimumChipIndex);

    }
    return levels;
}


/*
unction estimateFinalBlind(payload: TournamentPayload): number {
    return (payload.player_count * payload.starting_stack) / 20.0;
}

function baseDenomination(payload: TournamentPayload, chip?: ChipPayload): number {
    if (payload.minimum_denomination >= 0) {
        return payload.minimum_denomination;
    }
    if (!chip || chip.value === 0) {
        return DEFAULT.minimum_denomination;
    }
    return chip.value > 0 ? chip.value : 1;
}

function roundToDenomination(candidate: number, chip: ChipPayload): number {
    return Math.round(candidate / chip.value) * chip.value;
}

function nextBlind(candidate: number, payload: TournamentPayload, set: ChipSetPayload): number {
    var chip = set.chips[0];
    var closestValue = roundToDenomination(candidate, chip);
    if (closestValue === 0) {
        return baseDenomination(payload, chip);
    }

    for (let index = 1; index < set.chips.length; index++) {
        chip = set.chips[index];
        let nextValue = roundToDenomination(candidate, chip);
        if (Math.abs(candidate - nextValue) <= Math.abs(candidate - closestValue)) {
            closestValue = nextValue;
        }
    }

    return closestValue;
}

function nextBlinds(smallBlind: number, bigBlind: number, payload: TournamentPayload, set: ChipSetPayload): [number, number] {
    const oldBlind = smallBlind + bigBlind;

    let largeCandidate = nextBlind(smallBlind + (smallBlind * payload.target_blind_ratio), payload, set);//new small blind candidate
    let smallCandidate = smallBlind + bigBlind;// new big blind candidate
    let largeCandidateRatioDelta = Math.abs(payload.target_blind_ratio - (oldBlind / (largeCandidate * 3)));
    let smallCandidateRatioDelta = Math.abs(payload.target_blind_ratio - (oldBlind / (smallBlind + smallCandidate)));

    if (largeCandidateRatioDelta <= smallCandidateRatioDelta) {
        return [largeCandidate, largeCandidate * 2];
    } else {
        return [smallBlind, smallCandidate];
    }

}

function generateTournament(payload: TournamentPayload, set: ChipSetPayload): TournamentLevelPayload[] {
    var minimumChipIndex = 0;
    var smallBlind = baseDenomination(payload, set.chips[minimumChipIndex]);
    var bigBlind = smallBlind * payload.initial_big_blind_multiple;
    var overflowCount = payload.level_overflow;
    const finalBlind = estimateFinalBlind(payload);
    const isOverflowing = function(): boolean { return bigBlind >= finalBlind; };
    const shouldOverflow = function(): boolean { return overflowCount >= 0; };

    var levels: TournamentLevelPayload[] = [];
    while (!isOverflowing() || shouldOverflow()) {

        let level = Factory.level({
            type: 'round',
            duration: payload.level_duration,
            is_expected_conclusion: overflowCount < payload.level_overflow,
            denominations: [smallBlind, bigBlind]
        });
        levels.push(level);

        const ratio = set.chips[minimumChipIndex].value / smallBlind;
        const shouldColorUp = (
            !isOverflowing() && ratio < payload.color_up_threshold
            ) && (
                (set.chips[minimumChipIndex].value * payload.minimum_color_up_multiple) > (set.chips[minimumChipIndex + 1]?.value || 0)
            ) && (
                (finalBlind / bigBlind) > (payload.minimum_color_up_multiple * 1.1)
            );
        if (shouldColorUp) {
            const colorUpChip = set.chips[minimumChipIndex];
            minimumChipIndex += 1;
            if (colorUpChip) {
                levels.push(Factory.level({
                    type: 'break',
                    duration: payload.break_duration,
                    denominations: [colorUpChip.value]
                }));
            }
        }

        [smallBlind, bigBlind] = nextBlinds(smallBlind, bigBlind, payload, set);

        if (isOverflowing()) {
            overflowCount -= 1;
        }
    }
*/
/*
export default class DesignerController2 {
    configuration: TournamentConfiguration;



    generate(): Tournament {
 
            small_blind = small_blind + (small_blind * this.configuration.target_blind_ratio);
            small_blind = this.nearest_blind(small_blind)[1];
            if (small_blind === level.small_blind()) {
                small_blind += this.chips[0].value;
            }

            if (is_overflowing()) {
                level_overflow -= 1;
            }
        }
        return tournament;
    }
}*/