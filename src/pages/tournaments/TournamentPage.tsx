import { useState } from "react";
import HeaderView from "../../views/HeaderView";
import { configuration } from "../../configuration";
import { Link, useActionData, useLoaderData, useNavigate, useParams, useSubmit } from "react-router-dom";
import { SecondaryBlockHeaderView } from "../../views/SecondaryHeaderView";
import { usePageTitle } from "../../hooks/usePageTitle";
import { TournamentLevelsView } from "../../views/tournament/TournamentLevelsView";
import { ConfirmDeleteDialog } from "../../views/ConfirmDeleteDialog";
import { DataStore, RouteAction, store } from "../../pipes/DataStore";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";
import { DateView } from "../../views/DateView";
import { EnrichedTournamentPayload } from "../../pipes/TournamentPipes";
import { ChipsetGridView } from "../../views/chipset/ChipsetGridView";
import { TournamentGraphView } from "../../views/tournament/TournamentGraphView";
import ShareIcon from '@mui/icons-material/Share';
import { StorableKind } from "../../pipes/Storable";
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from "@mui/material/Snackbar";
import { useSharableLinkBuilder } from "../../hooks/useSharableLinkBuilder";
import { FormatterController } from "../../controllers/FormatterController";

const strings = configuration.strings.en.tournament;

const getOriginString = (kind: StorableKind): string => {
    switch (kind) {
        case StorableKind.preset:
            return 'Preset';
        case StorableKind.custom:
            return 'Custom';
        case StorableKind.unsaved:
            return 'Custom';
        case StorableKind.foreign:
            return 'Unsaved';
    }
}

export const TournamentPage = () => {
    useParams();
    useActionData();
    const { tournament, chipsets, kind, settings } = useLoaderData() as EnrichedTournamentPayload;
    const submit = useSubmit();
    const navigate = useNavigate();
    const linkBuilder = useSharableLinkBuilder();
    const [isDeleteStaged, setIsDeleteStaged] = useState(false);
    const [isShareSuccess, setIsShareSuccess] = useState(false);
    const title = tournament.tournament_name.length > 0 ? tournament.tournament_name : 'Unnamed';

    usePageTitle(title);

    const forceSharableEnabled = false;
    const isCloneable = kind === StorableKind.preset;
    const isEditable = kind === StorableKind.custom;
    const isDeletable = kind === StorableKind.custom;
    const isSavable = kind === StorableKind.foreign;
    const isSharable = forceSharableEnabled || (kind === StorableKind.custom && window.isSecureContext);

    return (
        <>
            <Snackbar onClose={() => setIsShareSuccess(false)} open={isShareSuccess} autoHideDuration={2000} message='Share link copied' />
            <ConfirmDeleteDialog isOpen={isDeleteStaged} dismiss={isConfirmed => {
                setIsDeleteStaged(false);
                if (isConfirmed) {
                    submit(JSON.stringify({ id: tournament.id }), { method: 'delete', encType: 'application/json' })
                }
            }} message='Are you sure you want to permanently delete this tournament?' />
            <Paper className='page tournament'>
                <HeaderView title={title}>
                    <span>
                        <IconButton color='secondary' component={Link} to={DataStore.route('tournaments', RouteAction.forge, tournament)}>
                            {isCloneable && <ContentCopyIcon />}
                            {isEditable && <EditIcon />}
                        </IconButton>
                        {isDeletable &&
                            <IconButton color='secondary' onClick={() => setIsDeleteStaged(true)}><DeleteIcon /></IconButton>
                        }
                        {isSharable &&
                            <IconButton
                                color='secondary'
                                onClick={() => {
                                    const url = linkBuilder(DataStore.route('tournaments', RouteAction.share, tournament));
                                    navigator.clipboard.writeText(url);
                                    setIsShareSuccess(true);
                                }}
                            >
                                <ShareIcon />
                            </IconButton>
                        }
                        {isSavable &&
                            <IconButton
                                color='secondary'
                                onClick={() => {
                                    store.tournaments.put(tournament).then(result => {
                                        const route = DataStore.route('tournaments', result ? RouteAction.read : RouteAction.list, tournament);
                                        navigate(route, { replace: true });
                                    });
                                }}
                            >
                                <SaveIcon />
                            </IconButton>
                        }
                    </span>
                    <div>
                        <Typography variant='body2'>
                            {getOriginString(kind)} tournament, base {FormatterController.tournamentDenomination(tournament.minimum_denomination)}.
                        </Typography>
                        {tournament.games.length > 0 &&
                        <Typography variant='body2'>
                            Playing {tournament.games}
                        </Typography>
                        }
                        
                        <DateView created_at={tournament.created_at} updated_at={tournament.updated_at} />
                    </div>
                </HeaderView>

                <div className='content'>
                    <ChipsetGridView title={'Chip sets'} chipsets={chipsets} placeholder={strings.no_customs} />
                    {
                        settings.should_graph_levels &&
                        <Paper>
                            <TournamentGraphView title='Blinds' tournament={tournament} />
                        </Paper>
                    }

                    <SecondaryBlockHeaderView title={'Levels'} />
                    <TournamentLevelsView tournament={tournament} />
                </div>

            </Paper>
        </>
    );
};
