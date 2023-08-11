import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as PokerChipIcon } from '../assets/pokerChip.svg';
import { contrastColor } from 'contrast-color';
import { ChipPayload, ChipSetPayload } from "../pipes/DataStoreSchemaV1";
import { cssValueForColor, stringToColor } from "../models/Color";
import { DataStore, RouteAction } from "../pipes/DataStore";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import SvgIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { ChipPayloadController } from "../controllers/ChipPayloadController";

const ChipView = (chip: ChipPayload) => {
    const color = cssValueForColor(stringToColor(chip.color));
    return (
        <Grid item key={chip.value}>
            <Chip label={ChipPayloadController.shortNumberToString(chip.value)}
                variant='outlined'
                sx={{
                    borderColor: 'black',
                    background: color,
                    color: contrastColor({ bgColor: color })
                }}
            />
        </Grid>
    );
};

interface PokerChipSetViewProps {
    isPreset: boolean;
    set: ChipSetPayload;
}

export function ChipsetCardView(props: PokerChipSetViewProps) {
    const { isPreset, set } = props;
    return (
        <Card key={set.id} sx={{ minWidth: 275, maxWidth: 400 }}>
            <CardContent>
                <SvgIcon component={PokerChipIcon} inheritViewBox color='inherit' sx={{ height: '100%', width: '2em', float: 'right', mt: 0.5, mr: 0.5 }} />
                <Typography variant='h5' component='div'>
                    <Button
                        variant='outlined'
                        size='small'
                        color='secondary'
                        component={RouterLink} to={DataStore.route('chipsets', RouteAction.read, set)}
                        sx={{ fontSize: '0.88em', textTransform: "none" }}
                    >
                        {set.name || 'Unnamed'}
                    </Button>
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant='caption' color='text.secondary' fontWeight='light'>
                    {(set.chips || []).reduce((total, chip) => total + chip.count, 0)} chips, {set.chips?.length} denominations
                </Typography>
                <Grid container spacing={0.5} alignItems='center'>
                    {(set.chips || []).map(ChipView)}
                </Grid>
            </CardContent>
        </Card>
    );
}