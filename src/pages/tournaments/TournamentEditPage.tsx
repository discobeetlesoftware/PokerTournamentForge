import { useEffect, useMemo } from "react";
import HeaderView from "../../components/HeaderView";
import { configuration } from "../../configuration";
import LocalizationController from "../../controllers/LocalizationController";
import { Form, useActionData, useLoaderData, useParams, useSubmit } from "react-router-dom";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { TournamentLevelPayload } from "../../pipes/DataStoreSchemaV1";
import { EnrichedTournamentPayload } from "../../pipes/TournamentPipes";
import { Factory } from "../../pipes/Factory";
import { SecondaryBlockHeaderView } from "../../components/SecondaryHeaderView";
import Time from "../../models/Time";
import { DataStore, RouteAction } from "../../pipes/DataStore";
import { usePageTitle } from "../../hooks/usePageTitle";
import useFlatReducer from "../../hooks/useFlatReducer";
import { ConfigurableElementView, FormModel } from "../../components/ConfigurableElementView";
import { generateTournament } from "../../pipes/UseTournament";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { TournamentGraphView } from "../../components/TournamentGraphView";
import { ChipPayloadController } from "../../controllers/ChipPayloadController";

const strings = configuration.strings.en.tournament;

const TimeFormatter = (minutes?: number, forceFull: boolean = false): string => {
    if (!minutes || minutes === 0) {
        return '';
    }
    const hours = Math.floor(minutes / 60);
    minutes = hours > 0 ? minutes % 60 : minutes;
    var output: string[] = [];
    if (hours > 0 || forceFull) {
        output.push(`${hours}h`);
    }
    if (minutes > 0 || forceFull) {
        output.push(`${minutes}m`);
    }
    return output.join(' ');
}

export const TournamentEditPage = () => {
    const data = useActionData();
    const { id } = useParams();
    const submit = useSubmit();
    const { tournament, chipsets, settings } = useLoaderData() as EnrichedTournamentPayload;
    const [state, setState] = useFlatReducer(tournament);
    const selectedSet = useMemo(() => chipsets.find(set => set.id === state.set_id), [state.set_id]);
    const selectedChip = useMemo(() => selectedSet?.chips.find(chip => chip.value === state.minimum_denomination), [state.set_id, state.minimum_denomination]);
    const defaultTournament = Factory.DEFAULT_TOURNAMENT as unknown as FormModel;
    const isCreate = DataStore.matchesNewRoute(id);
    const formModel = state as unknown as FormModel;
    const defaultSet = chipsets.filter(set => set.is_preset).reduce((prev, candidate) => {
        if (candidate.chips.length > prev.chips.length) {
            return candidate;
        }
        return prev;
    });

    useEffect(() => {
        setState({
            levels: generateTournament(state, selectedSet || defaultSet)
        });
    }, [
        selectedSet?.id, 
        state.target_blind_ratio, 
        state.level_duration, 
        state.break_duration, 
        state.color_up_threshold, 
        state.starting_stack, 
        state.minimum_denomination,
        state.break_threshold,
        state.player_count, 
        state.target_duration]);

    const title = isCreate ? 'Create tournament' : 'Update tournament';
    usePageTitle(title);

    const ComponentView = ConfigurableElementView;

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

    function levelDuration(level: TournamentLevelPayload): string {
        return TimeFormatter(level.duration);
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
                        <ComponentView key='tournament_name' mapKey='tournament_name' grid={{ md: 6, xs: 12 }} update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='games' mapKey='games' grid={{ md: 6, xs: 12 }} update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='set_id' mapKey='set_id' update={v => {
                            setState({ ...v, minimum_denomination: undefined })
                        }} formElement={formModel} defaultElement={defaultTournament} format={value => value.name} selectorViewProps={{
                            values: chipsets,
                            selected: selectedSet,
                            formValue: (set) => set!.id
                        }} />
                        <ComponentView key='minimum_denomination' mapKey='minimum_denomination' update={v => {
                            setState({ 'minimum_denomination': Number(v.minimum_denomination) })
                        }} formElement={formModel} defaultElement={defaultTournament} format={chip => {
                            return ChipPayloadController.format(chip) || '';
                        }} selectorViewProps={{
                            values: selectedSet?.chips || [],
                            selected: selectedChip,
                            isDisabled: !selectedSet,
                            formValue: (chip) => chip!.value.toString()
                        }} />
                        <ComponentView key='level_duration' mapKey='level_duration' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='break_duration' mapKey='break_duration' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='break_threshold' mapKey='break_threshold' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='target_blind_ratio' mapKey='target_blind_ratio' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='color_up_threshold' mapKey='color_up_threshold' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='starting_stack' mapKey='starting_stack' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='player_count' mapKey='player_count' update={setState} formElement={formModel} defaultElement={defaultTournament} />
                        <ComponentView key='target_duration' mapKey='target_duration' update={setState} formElement={formModel} defaultElement={defaultTournament} />
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
                <TableContainer sx={{ overflow: 'clip' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Level</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>Small Blind</TableCell>
                                <TableCell>Big Blind</TableCell>
                                <TableCell>Notes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                state.levels.map((level, index) =>
                                    <TableRow key={'level' + index} className={levelClassName(level, index)}>
                                        <TableCell>{levelText(level)}</TableCell>
                                        <TableCell>{TimeFormatter(level.duration)}</TableCell>
                                        <TableCell>{levelStartTime(level)}</TableCell>
                                        {level.type === 'round' && <TableCell>{levelBlind(level, 0)}</TableCell>}
                                        {level.type === 'round' && <TableCell>{levelBlind(level, 1)}</TableCell>}
                                        <TableCell style={{ textAlign: 'right' }} colSpan={level.type === 'round' ? 1 : 3}>{levelNote(level)}</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};