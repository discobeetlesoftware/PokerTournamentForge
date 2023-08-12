import { Link, useActionData, useLoaderData } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { configuration } from "../../configuration";
import HeaderView from "../../views/HeaderView";
import { ChipSetPayload } from "../../pipes/DataStoreSchemaV1";
import { DataStore, RouteAction } from "../../pipes/DataStore";
import { usePageTitle } from "../../hooks/usePageTitle";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ChipsetGridView } from "../../views/ChipsetGridView";

let strings = configuration.strings.en.chip_list;

export const ChipListPage = () => {
    usePageTitle(strings.title);
    useActionData();
    const sets = useLoaderData() as ChipSetPayload[];
    const presets = sets.filter(set => set.is_preset);
    const customs = sets.filter(set => !set.is_preset);

    return (
        <>
            <Paper className='page chipset-list'>
                <HeaderView title={strings.title} />
                <Typography>
                    Add your own chip sets to customize output when constructing a tournament.
                </Typography>

                <Button variant='contained' startIcon={<AddIcon />} component={Link} to={DataStore.route('chipsets', RouteAction.forge)}>{strings.actions.new}</Button>

                {(sets.length === 0) && <Typography component='p' sx={{ mt: 2 }}>{strings.overview}</Typography>}
            </Paper>

            <div className='content'>
                <ChipsetGridView title={'Presets'} chipsets={presets} />
                <ChipsetGridView title={'Customs'} chipsets={customs} placeholder={strings.no_customs} />
            </div>
        </>
    );
};
