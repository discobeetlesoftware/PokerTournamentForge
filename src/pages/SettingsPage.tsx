import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { configuration } from "../configuration";
import HeaderView from "../views/HeaderView";
import Paper from "@mui/material/Paper";
import { usePageTitle } from "../hooks/usePageTitle";
import { ConfirmDeleteDialog } from "../views/ConfirmDeleteDialog";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { SecondaryBlockHeaderView } from "../views/SecondaryHeaderView";
import { Form, useActionData, useLoaderData, useSubmit } from "react-router-dom";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Snackbar from "@mui/material/Snackbar";
import { DestroyButton } from "../views/DestroyButton";
import { DataStoreTableName, store } from "../pipes/DataStore";
import useFlatReducer from "../hooks/useFlatReducer";
import { SettingsLoaderResult } from "../pipes/SettingsPipes";

interface StoragePersistence {
    isStoragePersisted: boolean;
    isPending: boolean;
}

export const SettingsPage = () => {
    const [deleteCandidate, setDeleteCandidate] = useState<Array<DataStoreTableName> | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const submit = useSubmit();
    const data = useLoaderData() as SettingsLoaderResult;
    const [settings, updateSettings] = useState(data.settings);
    const [storagePersistence, setStoragePersistence] = useFlatReducer<StoragePersistence>({ 
        isStoragePersisted: data.isPersistent, 
        isPending: false 
    });

    useActionData();
    const [displaySaveSuccess, setDisplaySaveSuccess] = useState(false);

    let strings = configuration.strings.en.settings;
    usePageTitle(strings.title);

    const handleDeleteDismissed = (isConfirmed: boolean) => {
        const token = deleteCandidate;
        setDeleteCandidate(null);
        if (isConfirmed && token) {
            setIsUpdating(true);
            Promise.all(token.map(table => store.table(table).clear())).catch(e => {
                console.error('Failed to delete ', token, e);
            }).finally(() => {
                setIsUpdating(false);
            });
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
                            navigator.storage.persist().then(persisted => {
                                let failure = storagePersistence.isStoragePersisted && !persisted;
                                if (failure) {
                                    console.warn('Failed to request persistent storage');
                                }
                                setStoragePersistence({ isStoragePersisted: persisted, isPending: false });
                            });
                            submit(JSON.stringify(settings) as any as { [x: string]: any; }, {
                                method: 'post',
                                encType: 'application/json'
                            });
                            setDisplaySaveSuccess(true);
                        }}>
                            <div style={{ marginTop: '25px', marginBottom: '25px' }}>
                                <SecondaryBlockHeaderView title='Global configuration' />
                                <div>
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
                                </div>
                                <div>
                                    <FormControlLabel
                                            disabled={storagePersistence.isStoragePersisted && !storagePersistence.isPending}
                                            label='Data persistence'
                                            control={<Switch
                                                checked={storagePersistence.isStoragePersisted}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setStoragePersistence({ isStoragePersisted: event.target.checked, isPending: true });
                                                }}
                                            />}
                                        />
                                        <Typography variant='caption' fontWeight='light'>
                                            If set, the local data store will be flagged as permanent. This will help prevent data loss if the system decides it needs to reclaim space.
                                        </Typography>
                                </div>

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
