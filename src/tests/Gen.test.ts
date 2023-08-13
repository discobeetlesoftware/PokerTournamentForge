import { configuration } from "../configuration";
import { Factory } from "../pipes/Factory";
import { baseDenomination, estimateFinalBlind, nextBlind, roundToDenomination } from "../pipes/TournamentGenerator";

const DEFAULT = configuration.defaults;

test('estimateFinalBlind', () => {
    let payload = Factory.tournament({
        starting_stack: 100,
        player_count: 0
    });

    expect(estimateFinalBlind(payload)).toStrictEqual(0);

    payload.player_count = 10;
    payload.starting_stack = 20000;
    expect(estimateFinalBlind(payload)).toStrictEqual(10000);
});

test('baseDenomination', () => {
    let payload = Factory.tournament();
    let chip = Factory.chip({ value: 42 });
    expect(baseDenomination(payload, chip)).toStrictEqual(42);
    chip.value = 0;
    expect(baseDenomination(payload, chip)).toStrictEqual(DEFAULT.minimum_denomination);
    expect(baseDenomination(payload)).toStrictEqual(DEFAULT.minimum_denomination);
    payload.minimum_denomination = 256;
    chip.value = 1;
    expect(baseDenomination(payload, chip)).toStrictEqual(256);
});

test('roundToDenomination', () => {
    let chip = Factory.chip();
    expect(() => roundToDenomination(55, chip)).toThrowError("Cannot round '55' for chip.value of 0");

    chip.value = 25;
    expect(roundToDenomination(55, chip)).toStrictEqual(50);
    expect(roundToDenomination(1, chip)).toStrictEqual(25);
});

// test('nextBlind', () => {
//     let payload = Factory.tournament();
//     let set = Factory.chipSet();

//     expect(() => nextBlind(55, 0, payload, set, 0)).toThrowError("Cannot calculate next blind for '55' because the set called '' contains no chips");

//     set.chips = [
//         Factory.chip({ value: 25 }),
//         Factory.chip({ value: 100 }),
//         Factory.chip({ value: 500 })
//     ];
//     expect(nextBlind(55, 0, payload, set, 0)).toEqual([50, 25]);
//     expect(nextBlind(0, 0, payload, set, 0)).toEqual([25, 25]);
//     expect(nextBlind(97, 0, payload, set, 0)).toEqual([100, 100]);
//     expect(nextBlind(250, 0, payload, set, 0)).toEqual([250, 25]);
//     expect(nextBlind(112, 0, payload, set, 0)).toEqual([100, 100]);
//     expect(nextBlind(113, 0, payload, set, 0)).toEqual([125, 25]);
//     expect(nextBlind(488, 0, payload, set, 0)).toEqual([500, 500]);
//     expect(nextBlind(111111111, 0, payload, set, 0)).toEqual([111111100, 100]);

//     set.chips.shift();
//     set.chips.pop();
//     expect(nextBlind(250, 0, payload, set, 0)).toEqual([300, 100]);
// });

