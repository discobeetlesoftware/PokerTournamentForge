import Grid from "@mui/material/Grid";
import { TournamentPayload } from "../pipes/DataStoreSchemaV1";
import { Link } from "react-router-dom";
import { DataStore, RouteAction } from "../pipes/DataStore";
import { ReactComponent as DiamondsIcon } from '../assets/diamonds.svg';
import { ReactComponent as SpadesIcon } from '../assets/spades.svg';
import { ReactComponent as ClubsIcon } from '../assets/clubs.svg';
import { ReactComponent as HeartsIcon } from '../assets/hearts.svg';
import SvgIcon from "@mui/material/SvgIcon";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ChipPayloadController } from "../controllers/ChipPayloadController";

interface TournamentCardViewProps {
    index: number;
    isPreset: boolean;
    tournament: TournamentPayload;
}

const TournamentIcon = (props: {count: number}) => {
    const icons = [SpadesIcon, DiamondsIcon, ClubsIcon, HeartsIcon];
    const index = props.count % icons.length;
    return (
        <SvgIcon component={icons[index]} color='inherit' inheritViewBox sx={{ height: '100%', width: '2em', float: 'right', ml: '15px' }} />
    );
}
/*
function tournamentGameDescription(tournament: TournamentPayload) {
    return tournament.games.length === 0 ? undefined : tournament.games.join(', ');
}

function tournamentLevelDescription(tournament: TournamentPayload) {
    return tournament.levels.reduce((aggregate, next) => {
        aggregate.duration += next.duration || 0;
        aggregate.levelCount += aggregate.shouldCountLevel ? 1 : 0;
        aggregate.shouldCountLevel = aggregate.shouldCountLevel && !next.is_expected_conclusion;
        return aggregate;
    }, {
        duration: 0,
        levelCount: 0,
        shouldCountLevel: true
    });
}
*/
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
    return denom ? `T${ChipPayloadController.shortNumberToString(denom)} base` : '';
}

export const TournamentCardView = (props: TournamentCardViewProps) => {
    const { tournament } = props;

    return (
        <Card key={tournament.id} sx={{ minWidth: 275, maxWidth: 400 }}>
            <CardContent>
                <Typography variant='h5' component='div'>
                    <Button 
                        variant='outlined'
                        size='small' 
                        color='secondary' 
                        component={Link} to={DataStore.route('tournaments', RouteAction.read, tournament)} 
                        sx={{fontSize: '0.88em', textTransform: 'none' }}>
                        {tournament.tournament_name || 'Unnamed'}
                    </Button>
                    <TournamentIcon count={props.index} />
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant='caption' color='text.secondary' fontWeight='light'>
                    {tournamentDenominationDescription(tournament)}
                    {/* {(set.chips || []).reduce((total, chip) => total + chip.count, 0)} chips, {set.chips?.length} denominations */}
                </Typography>
                <Grid container spacing={0.5} alignItems='center'>
                    {/* {(set.chips || []).map(ChipView)} */}
                </Grid>
            </CardContent>
        </Card>
    );
}