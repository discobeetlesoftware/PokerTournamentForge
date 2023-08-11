import Typography from "@mui/material/Typography";
import { configuration } from "../../configuration";
import HeaderView from "../../components/HeaderView";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { Link, useActionData, useLoaderData } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { usePageTitle } from "../../hooks/usePageTitle";
import { SecondaryBlockHeaderView } from "../../components/SecondaryHeaderView";
import { TournamentPayload } from "../../pipes/DataStoreSchemaV1";
import { TournamentCardView } from "../../components/TournamentCardView";
import { DataStore, RouteAction } from "../../pipes/DataStore";

let strings = configuration.strings.en.tournament_list;

export const TournamentListPage = () => {
    usePageTitle(strings.title);
    const data = useActionData();
    const tournaments = useLoaderData() as TournamentPayload[];

    const presets = tournaments.filter(tournament => tournament.is_preset);
    const customs = tournaments.filter(tournament => !tournament.is_preset);

    return (
        <>
            <Paper className='page tournament-list'>
                <HeaderView title={strings.title} />
                <Typography>
                    Welcome to the forge.
                </Typography>

                <Button variant='contained' startIcon={<AddIcon />} component={Link} to={DataStore.route('tournaments', RouteAction.forge)}>{strings.actions.new}</Button>

                {(customs.length === 0) && <Typography component='p' sx={{ mt: 2 }}>{strings.overview}</Typography>}
            </Paper>

            <div className='content'>
                <SecondaryBlockHeaderView title={'Presets'} />
                <Grid container spacing={2}>
                    {presets.map((tournament, index) =>
                        <Grid item key={tournament.id}>
                            <TournamentCardView index={index} isPreset={true} tournament={tournament} />
                        </Grid>
                    )}
                </Grid>

                <SecondaryBlockHeaderView title={'Customs'} sx={{ mt: 1.5 }} />
                <Grid container spacing={2}>
                    {customs.map((tournament, index) =>
                        <Grid item key={tournament.id}>
                            <TournamentCardView index={index} isPreset={false} tournament={tournament} />
                        </Grid>
                    )}
                </Grid>

                {(tournaments.length === 0) && <Typography component='p' sx={{ ml: 1.5, mr: 1.5, mt: 2 }}>{strings.no_customs}</Typography>}
            </div>
        </>
    );
};
