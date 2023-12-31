import Typography from "@mui/material/Typography";
import { useState } from "react";
import { configuration } from "../configuration";
import HeaderView from "../views/HeaderView";
import Paper from "@mui/material/Paper";
import { usePageTitle } from "../hooks/usePageTitle";
import { ConfirmDeleteDialog } from "../views/ConfirmDeleteDialog";
import { PTDSchemaCurrent } from "../pipes/DataStore";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { SecondaryBlockHeaderView } from "../views/SecondaryHeaderView";
import { Form, useActionData, useLoaderData, useSubmit } from "react-router-dom";
import { SettingsPayload } from "../pipes/DataStoreSchemaV1";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Snackbar from "@mui/material/Snackbar";
import { clearAction } from "../pipes/PresetPipes";
import { StoreNames } from "idb";
import { DestroyButton } from "../views/DestroyButton";

export const SettingsPage = () => {
    const [deleteCandidate, setDeleteCandidate] = useState<StoreNames<PTDSchemaCurrent>[] | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const submit = useSubmit();
    const [settings, updateSettings] = useState(useLoaderData() as SettingsPayload)
    useActionData();
    const [displaySaveSuccess, setDisplaySaveSuccess] = useState(false);

    let strings = configuration.strings.en.settings;
    usePageTitle(strings.title);

    const handleDeleteDismissed = (isConfirmed: boolean) => {
        const token = deleteCandidate;
        setDeleteCandidate(null);
        if (isConfirmed && token) {
            setIsUpdating(true);
            clearAction(deleteCandidate).catch(e => {
                console.error('Failed to delete ', token, e);
            }).finally(() => {
                setIsUpdating(false);
            })
        }
    };

    return (
        <>
            <Snackbar onClose={() => setDisplaySaveSuccess(false)} open={displaySaveSuccess} autoHideDuration={2000} message='Settings updated' />
            <ConfirmDeleteDialog isOpen={!!deleteCandidate} dismiss={handleDeleteDismissed} message='Are you sure about this?' />
            <Paper className='page about'>
                <HeaderView title={strings.title} />
                {isUpdating && <div>Processing…</div>}
                {!isUpdating &&
                    <div className='content'>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            submit(JSON.stringify(settings) as any as { [x: string]: any; }, {
                                method: 'post',
                                encType: 'application/json'
                            });
                            setDisplaySaveSuccess(true);
                        }}>
                            <div style={{ marginTop: '25px', marginBottom: '25px' }}>
                                <SecondaryBlockHeaderView title='Global configuration' />
                                <FormControlLabel
                                    label='Graph tournament levels'
                                    control={<Switch
                                        checked={settings.should_graph_levels}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            updateSettings({
                                                ...settings,
                                                should_graph_levels: event.target.checked
                                            });
                                        }}
                                    />}
                                />
                                <Typography variant='caption' fontWeight='light'>
                                    May cause problems for small screens and slow systems.
                                </Typography>

                                <div>
                                    <Button color='secondary' type='submit' variant='outlined' size='large' startIcon={<SaveAltIcon />}>Save</Button>
                                </div>
                            </div>
                        </Form>
                        <div>
                            <SecondaryBlockHeaderView title='Danger zone' />
                            <DestroyButton title='Reset app' onConfirmDestroy={() => setDeleteCandidate(['tournaments', 'chipsets', 'settings'])} />
                            <DestroyButton title='Reset tournaments' onConfirmDestroy={() => setDeleteCandidate(['tournaments'])} />
                            <DestroyButton title='Reset chip sets' onConfirmDestroy={() => setDeleteCandidate(['chipsets'])} />
                        </div>
                    </div>
                }
            </Paper>
        </>
    );
};
