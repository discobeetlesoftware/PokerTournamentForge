import { useState } from "react";
import { Link, useActionData, useLoaderData, useSubmit } from "react-router-dom";
import { configuration } from "../../configuration";
import HeaderView from "../../components/HeaderView";
import { ChipPayload, TournamentPayload } from "../../pipes/DataStoreSchemaV1";
import { DataStore, RouteAction } from "../../pipes/DataStore";
import { usePageTitle } from "../../hooks/usePageTitle";
import { ChipSetLoaderResult } from "../../pipes/ChipSetPipes";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import { cssValueForNamedColor } from "../../models/Color";
import { contrastColor } from 'contrast-color';
import { SecondaryBlockHeaderView } from "../../components/SecondaryHeaderView";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Factory } from "../../pipes/Factory";
import { IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { DateView } from "../../components/DateView";
import { ChipSetTableView } from "../../components/ChipsetTableView";
import { ChipPayloadController } from "../../controllers/ChipPayloadController";

let strings = configuration.strings.en.chip;

const ChipRow = (props: { chip: ChipPayload }) => {
    const { chip } = props;
    const color = cssValueForNamedColor(chip.color);
    const textColor = contrastColor({ bgColor: color });
    return (
        <TableRow>
            <TableCell>{ChipPayloadController.shortNumberToString(chip.value)}</TableCell>
            <TableCell>{chip.count}</TableCell>
            <TableCell sx={{ backgroundColor: color, color: textColor }}>{chip.color}</TableCell>
        </TableRow>
    );
};

const TournamentRow = (props: { tournament: TournamentPayload, chips: ChipPayload[] }) => {
    const { tournament, chips } = props;
    const minimumChip = (chips.find(chip => chip.value === tournament.minimum_denomination) || chips[0]) || Factory.chip();
    return (
        <TableRow>
            <TableCell>
                {tournament.tournament_name || 'Unnamed tournament'}
                <IconButton color='secondary' component={Link} to={DataStore.route('tournaments', RouteAction.read, tournament)}><NavigateNextIcon /></IconButton>
            </TableCell>
            <TableCell>{tournament.player_count}</TableCell>
            <TableCell>{ChipPayloadController.shortNumberToString(tournament.starting_stack)}</TableCell>
            <TableCell>{ChipPayloadController.format(minimumChip) || 'Unconfigured'}</TableCell>

        </TableRow>
    );
}

export const ChipSetPage = () => {
    useActionData();
    const submit = useSubmit();
    const [isDeleteStaged, setIsDeleteStaged] = useState(false);
    const { chipset, tournaments } = useLoaderData() as ChipSetLoaderResult;
    const title = chipset.name?.length > 0 ? chipset.name : 'Unnamed';
    const origin = chipset.is_preset ? 'Preset' : 'Custom';
    usePageTitle(title);
    return (
        <>
            <ConfirmDeleteDialog isOpen={isDeleteStaged} dismiss={isConfirmed => {
                setIsDeleteStaged(false);
                if (isConfirmed) {

                    submit(JSON.stringify({ id: chipset.id }), { method: 'DELETE', encType: 'application/json' })
                }
            }} message='Are you sure you want to permanently delete this chip set?' />
            <Paper className='page chip-set'>
                <HeaderView title={title}>
                    <span>
                        <IconButton color='secondary' component={Link} to={DataStore.route('chipsets', RouteAction.forge, chipset)}>
                            {chipset.is_preset && <ContentCopyIcon />}
                            {!chipset.is_preset && <EditIcon />}
                        </IconButton>
                        {!chipset.is_preset &&
                            <IconButton color='secondary' onClick={() => setIsDeleteStaged(true)}><DeleteIcon /></IconButton>
                        }
                    </span>
                    <div>

                    <Typography variant='body2'>
                        {origin} chip set containing {chipset.chips.reduce((total, value) => total + value.count, 0)} chips in {chipset.chips.length} denominations.
                    </Typography>
                    <DateView created_at={chipset.created_at} updated_at={chipset.updated_at} />
                    </div>
                </HeaderView>

                <div className='content'>
                    <SecondaryBlockHeaderView title={'Tournaments'} />
                    {tournaments.length === 0 &&
                        <Typography variant='body2'>None yet</Typography>
                    }
                    {tournaments.length > 0 &&
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Player count</TableCell>
                                        <TableCell>Starting stack</TableCell>
                                        <TableCell>Base denom</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tournaments.map(tournament => <TournamentRow tournament={tournament} chips={chipset.chips} />)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                    <SecondaryBlockHeaderView title={'Chips'} />
                    <ChipSetTableView>
                        {chipset.chips?.map(chip => <ChipRow chip={chip} />)}
                    </ChipSetTableView>
                </div>
            </Paper>
        </>
    );
};
