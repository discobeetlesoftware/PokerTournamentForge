import Grid from "@mui/material/Grid";
import { SecondaryBlockHeaderView } from "../SecondaryHeaderView";
import { ChipsetCardView } from "./ChipsetCardView";
import { ChipSetPayload } from "../../pipes/DataStoreSchemaV1";
import Typography from "@mui/material/Typography";

export const ChipsetGridView = (props: { title: string, placeholder?: string, chipsets: ChipSetPayload[]}) => {
    const hasChipsets = props.chipsets.length > 0;
    return (
        <>
            <SecondaryBlockHeaderView title={props.title} />
            <Grid container spacing={2} sx={{ mb: 1.5 }}>
                {props.chipsets.map(set =>
                    <Grid item key={set.id}>
                        <ChipsetCardView set={set} />
                    </Grid>
                )}
            </Grid>

            {!hasChipsets && 
                <Typography component='p' sx={{ ml: 1.5, mr: 1.5, mt: 2 }}>{props.placeholder}</Typography>
            }
        </>
    );
}
