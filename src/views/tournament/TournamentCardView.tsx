import Grid from "@mui/material/Grid";
import { TournamentPayload } from "../../pipes/DataStoreSchemaV1";
import { Link } from "react-router-dom";
import { DataStore, RouteAction } from "../../pipes/DataStore";
import { ReactComponent as DiamondsIcon } from '../../assets/diamonds.svg';
import { ReactComponent as SpadesIcon } from '../../assets/spades.svg';
import { ReactComponent as ClubsIcon } from '../../assets/clubs.svg';
import { ReactComponent as HeartsIcon } from '../../assets/hearts.svg';
import SvgIcon from "@mui/material/SvgIcon";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FormatterController } from "../../controllers/FormatterController";
import Chip from "@mui/material/Chip";

interface TournamentCardViewProps {
    index: number;
    isPreset: boolean;
    tournament: TournamentPayload;
}

const TournamentIcon = (props: { count: number }) => {
    const icons = [SpadesIcon, DiamondsIcon, ClubsIcon, HeartsIcon];
    const index = props.count % icons.length;
    return (
        <SvgIcon component={icons[index]} color='inherit' inheritViewBox sx={{ height: '100%', width: '2em', float: 'right', ml: '15px' }} />
    );
}

function tournamentGameDescription(tournament: TournamentPayload) {
    return tournament.games.length === 0 ? undefined : tournament.games;
}

function tournamentLevelDescription(tournament: TournamentPayload) {
    return tournament.levels.reduce((aggregate, next) => {
        if (next.type === 'round') {
            aggregate.blinds.push(next.denominations || []);
            aggregate.levelCount += aggregate.shouldCountLevel ? 1 : 0;
        }
        if (aggregate.shouldCountLevel) {
            aggregate.duration += next.duration || 0;
        }
        aggregate.shouldCountLevel = aggregate.shouldCountLevel && !next.is_expected_conclusion;
        return aggregate;
    }, {
        blinds: new Array<number[]>(),
        duration: 0,
        levelCount: 0,
        shouldCountLevel: true
    });
}

function tournamentFirstLevelBaseDenomination(tournament: TournamentPayload): number | null {
    const level = tournament.levels.length > 0 ? tournament.levels[0] : null;
    if (!level) {
        return null;
    }
    const denoms = level.denominations;
    if (denoms && denoms.length > 0) {
        return denoms[0];
    }
    return null;
}

function tournamentDenominationDescription(tournament: TournamentPayload) {
    const denom = tournament.minimum_denomination > 0 ? tournament.minimum_denomination : tournamentFirstLevelBaseDenomination(tournament);
    return denom ? `${FormatterController.tournamentDenomination(denom)} base` : '';
}

interface TournamentChipViewProps {
    label: string;
}

const TournamentChipView = (props: TournamentChipViewProps) => {
    const { label } = props;
    return (
        <Grid item><Chip label={label} /></Grid>
    );
}

const sum = (list: number[]): number => {
    return list.reduce((l, r) => l + r);
}

function calculateAverageBlindRatio(arr: number[][], count: number): number {
    const sums = arr.map(sum);
    var total = 0;

    for (let index = 0; index < sums.length - 1; index++) {
        total += (sums[index] / sums[index + 1]);
    }

    return total / count;
}

export const TournamentCardView = (props: TournamentCardViewProps) => {
    const { tournament } = props;

    const description = tournamentLevelDescription(tournament);
    const levelDuration = `${FormatterController.time(tournament.level_duration)} levels`;
    const duration = FormatterController.time(description.duration);
    const durationText = `estimated ${duration}`;
    const actualBlindRatio = FormatterController.percentage(calculateAverageBlindRatio(description.blinds, description.levelCount));
    const targetBlindRatio = FormatterController.percentage(tournament.target_blind_ratio);
    const targetBlindRatioText = `target blind Δ${targetBlindRatio}`;
    const actualBlindRatioText = `actual Δ${actualBlindRatio}`;
    return (
        <Card key={tournament.id} sx={{ minWidth: 275, maxWidth: 400 }}>
            <CardContent>
                <Typography variant='h5' component='div'>
                    <Button
                        variant='outlined'
                        size='small'
                        color='secondary'
                        component={Link} to={DataStore.route('tournaments', RouteAction.read, tournament)}
                        sx={{ fontSize: '0.88em', textTransform: 'none' }}>
                        {tournament.tournament_name || 'Unnamed'}
                    </Button>
                    <TournamentIcon count={props.index} />
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant='caption' color='text.secondary' fontWeight='light'>
                    {targetBlindRatioText}, {actualBlindRatioText}
                </Typography>
                <Grid container spacing={0.5} alignItems='center'>
                    <TournamentChipView label={FormatterController.tournamentDenomination(tournament.starting_stack)} />
                    <TournamentChipView label={tournamentDenominationDescription(tournament)} />
                    <TournamentChipView label={levelDuration} />
                    <TournamentChipView label={durationText} />
                </Grid>
            </CardContent>
        </Card>
    );
}