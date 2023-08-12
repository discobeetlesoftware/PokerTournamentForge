import { useEffect, useMemo } from "react";
import HeaderView from "../../views/HeaderView";
import { configuration } from "../../configuration";
import LocalizationController from "../../controllers/LocalizationController";
import { Form, useActionData, useLoaderData, useParams, useSubmit } from "react-router-dom";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { TARGET_STRATEGY, TournamentLevelPayload } from "../../pipes/DataStoreSchemaV1";
import { EnrichedTournamentPayload } from "../../pipes/TournamentPipes";
import { Factory } from "../../pipes/Factory";
import { SecondaryBlockHeaderView } from "../../views/SecondaryHeaderView";
import Time from "../../models/Time";
import { DataStore, RouteAction } from "../../pipes/DataStore";
import { usePageTitle } from "../../hooks/usePageTitle";
import useFlatReducer from "../../hooks/useFlatReducer";
import { ConfigurableElementView, FormModel, TournamentBreakpointView } from "../../views/ConfigurableElementView";
import { generateTournament } from "../../pipes/UseTournament";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { TournamentGraphView } from "../../views/tournament/TournamentGraphView";
import { ChipPayloadController } from "../../controllers/ChipPayloadController";
import { TournamentLevelsView } from "../../views/tournament/TournamentLevelsView";

const strings = configuration.strings.en.tournament;

export const TournamentEditPage = () => {
    useActionData();
    const { id } = useParams();
    const submit = useSubmit();
    const { tournament, chipsets, settings } = useLoaderData() as EnrichedTournamentPayload;
    const [state, setState] = useFlatReducer(tournament);
    const selectedSet = useMemo(() => chipsets.find(set => set.id === state.set_id) || chipsets[0], [state.set_id, chipsets]);
    const breakpoints = useMemo(() => {
        var breakpointMap: Record<number, number> = {};
        for (const breakpoint of state.color_up_breakpoints) {
            breakpointMap[breakpoint.denomination] = breakpoint.threshold;
        }
        return selectedSet.chips.map(chip => {
            const existingValue = breakpointMap[chip.value];
            return { denomination: chip.value, threshold: existingValue || chip.value / configuration.defaults.color_up_threshold }
        });
    }, [state.set_id, chipsets, state.color_up_breakpoints]);
    const selectedChip = useMemo(() => selectedSet?.chips.find(chip => chip.value === state.minimum_denomination), [state.set_id, state.minimum_denomination, selectedSet]);
    const defaultTournament = Factory.DEFAULT_TOURNAMENT as unknown as FormModel;
    const isCreate = DataStore.matchesNewRoute(id);
    const formModel = state as unknown as FormModel;
    const defaultSet = chipsets.filter(set => set.is_preset).reduce((prev, candidate) => {
        if (candidate.chips.length > prev.chips.length) {
            return candidate;
        }
        return prev;
    });
    // eslint-disable-next-line
    useEffect(() => {
        setState({
            levels: generateTournament(state, selectedSet || defaultSet)
        });
    }, [
        selectedSet?.id,
        state.target_blind_ratio,
        state.level_duration,
        state.break_duration,
        state.color_up_breakpoints,
        state.starting_stack,
        state.minimum_denomination,
        state.target_strategy,
        state.break_threshold,
        state.player_count,
        state.games,
        state.target_duration]);

    const title = isCreate ? 'Create tournament' : 'Update tournament';
    usePageTitle(title);

    var levelCounts = {
        'round': 0,
        'break': 0
    } as Record<string, number>;
    function levelText(level: TournamentLevelPayload): string {
        levelCounts[level.type] += 1;
        const prefix = level.type === 'round' ? 'Level' : 'Break';
        return `${prefix} ${levelCounts[level.type]}`;
    }

    var time = new Time(0, tournament.start_time);
    function levelStartTime(level: TournamentLevelPayload): string {
        const result = time.toString();
        time.append(level.duration || 0);
        return result;
    }

    function levelBlind(level: TournamentLevelPayload, index: number): string {
        if (level.type === 'break' || !level.denominations) {
            return '';
        }
        const value = level.denominations[index];
        return value.toString();
    }

    function levelClassName(level: TournamentLevelPayload, index: number): string {
        if (level.is_expected_conclusion) {
            return 'tournament-level-conclusion';
        }
        if (level.type === 'round') {
            return index % 2 === 0 ? 'tournament-level-row' : '';
        }
        return 'tournament-break-row';
    }

    function levelNote(level: TournamentLevelPayload): string {
        if (level.is_expected_conclusion) {
            return 'Expected conclusion';
        }
        return level.note || '';
    }

    return (
        <>
            <Paper className='page tournament'>
                <HeaderView title={isCreate ? strings.title.create : LocalizationController.mapString(strings.title.update, { name: state.tournament_name })} />
                <div className='content'>
                    <Typography fontWeight='light' fontSize={14}>
                        <span>
                            Fields with no default value are optional. Target duration and blind ratio are associated with each other, so changing one will modify the other.
                        </span>
                        <span>
                            The level calculation makes a best attempt at producing playable results, but playability is not a guarantee.
                        </span>
                        <span>
                            Tickle or hover a field title to learn how it influences the output.
                        </span>
                    </Typography>

                </div>
            </Paper>

            <Paper sx={{ mt: '2vh' }}>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    submit(JSON.stringify(state) as any as { [x: string]: any; }, {
                        method: "post",
                        encType: 'application/json',
                        action: DataStore.route('tournaments', RouteAction.forge, state)
                    });
                }}>
                    <SecondaryBlockHeaderView title={'Configuration'} />
                    <Grid container spacing={{ xs: 1, md: 2 }} sx={{ width: '100vw' }} direction='row' justifyContent='center' alignItems='center'>
                        <ConfigurableElementView key='tournament_name' mapKey='tournament_name' grid={{ md: 6, xs: 12 }} update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ConfigurableElementView
                            key='games'
                            mapKey='games'
                            grid={{ md: 6, xs: 12 }}
                            update={setState}
                            formElement={formModel}
                            defaultElement={defaultTournament} />
                        <ConfigurableElementView key='set_id' mapKey='set_id' update={v => {
                            setState({ ...v, minimum_denomination: undefined })
                        }} formElement={formModel} defaultElement={defaultTournament} format={value => value.name} selectorViewProps={{
                            values: chipsets,
                            selected: selectedSet,
                            formValue: (set) => set!.id
                        }} />
                        <ConfigurableElementView key='minimum_denomination' mapKey='minimum_denomination' update={v => {
                            setState({ 'minimum_denomination': Number(v.minimum_denomination) })
                        }} formElement={formModel} defaultElement={defaultTournament} format={chip => {
                            return ChipPayloadController.format(chip);
                        }} selectorViewProps={{
                            values: selectedSet?.chips || [],
                            selected: selectedChip || selectedSet.chips[0],
                            isDisabled: !selectedSet,
                            formValue: (chip) => chip!.value.toString()
                        }} />
                        <ConfigurableElementView key='target_strategy' mapKey='target_strategy' update={setState} formElement={formModel} defaultElement={defaultTournament} format={strategy => {
                            return strategy;
                        }} selectorViewProps={{
                            values: Object.keys(TARGET_STRATEGY),
                            selected: state.target_strategy,
                            formValue: (strategy) => strategy || TARGET_STRATEGY.AGGRESSIVE
                        }} />
                        <ConfigurableElementView key='level_duration' mapKey='level_duration' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ConfigurableElementView key='break_duration' mapKey='break_duration' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ConfigurableElementView key='break_threshold' mapKey='break_threshold' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ConfigurableElementView key='target_blind_ratio' mapKey='target_blind_ratio' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <TournamentBreakpointView breakpoints={breakpoints} update={setState} chipset={selectedSet} />
                        <ConfigurableElementView key='starting_stack' mapKey='starting_stack' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ConfigurableElementView key='player_count' mapKey='player_count' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ConfigurableElementView key='target_duration' mapKey='target_duration' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                    </Grid>
                    <div style={{ padding: '20px' }}>
                        <Button type='submit' startIcon={<SaveAltIcon />} color='secondary' variant='contained'>{isCreate ? strings.actions.create : strings.actions.update}</Button>
                    </div>
                </Form>
            </Paper>

            {
                settings.should_graph_levels &&
                <Paper>
                    <TournamentGraphView title='Blinds' tournament={state} />
                </Paper>
            }

            <Paper sx={{ mt: '2vh' }}>
                <SecondaryBlockHeaderView title={state.tournament_name.length > 0 ? state.tournament_name : 'Tournament'} />
                <TournamentLevelsView tournament={state} />
            </Paper>
        </>
    );
};
