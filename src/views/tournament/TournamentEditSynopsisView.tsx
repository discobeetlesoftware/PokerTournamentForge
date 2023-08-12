import Paper from "@mui/material/Paper";
import HeaderView from "../HeaderView";
import Typography from "@mui/material/Typography";
import LocalizationController from "../../controllers/LocalizationController";
import { configuration } from "../../configuration";

interface TournamentEditSynopsisViewProps {
    isCreate: boolean;
    name: string;
}

export const TournamentEditSynopsisView = ({ isCreate, name }: TournamentEditSynopsisViewProps) => {
    const strings = configuration.strings.en.tournament;

    return (
        <Paper className='page tournament'>
            <HeaderView title={isCreate ? strings.title.create : LocalizationController.mapString(strings.title.update, { name })} />
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
    )
};