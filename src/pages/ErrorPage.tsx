import Typography from '@mui/material/Typography';
import { redirect, useLocation, useNavigate, useRouteError } from 'react-router-dom';
import HeaderView from '../views/HeaderView';
import { configuration } from '../configuration';
import { SvgIcon } from '@mui/material';
import { ReactComponent as FlowersIcon } from '../assets/flowers.svg';
import { DestroyButton } from '../views/DestroyButton';
import { ConfirmDeleteDialog } from '../views/ConfirmDeleteDialog';
import { useState } from 'react';
import { PTDSchemaCurrent } from '../pipes/DataStore';
import { StoreNames } from 'idb';
import { clearAction } from "../pipes/PresetPipes";

let strings = configuration.strings.en.error;

const ErrorView = (props: { error: Error }) => {
    const { error } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const [deleteCandidate, setDeleteCandidate] = useState<StoreNames<PTDSchemaCurrent>[] | null>(null);

    const handleDeleteDismissed = (isConfirmed: boolean) => {
        const token = deleteCandidate;
        setDeleteCandidate(null);
        if (isConfirmed && token) {
            clearAction(token).catch(e => {
                console.error('Failed to delete ', token, e);
            }).finally(() => {
                navigate('/');
            })
        }
    }
    return (
        <>
            <ConfirmDeleteDialog isOpen={!!deleteCandidate} dismiss={handleDeleteDismissed} message='Are you sure about this?' />
            <SvgIcon component={FlowersIcon} inheritViewBox color='inherit' sx={{ height: '5em', width: '5em', margin: '10px', float: 'right' }} />
            <HeaderView title={strings.title} />
            <Typography variant='h5'>💥 This is not great news 💥</Typography>
            <Typography color='error.main'><span style={{ fontWeight: 800 }}>Route:</span> {location.pathname}</Typography>
            <Typography color='error.light'><span style={{ fontWeight: 800 }}>Cause:</span> {error.message}</Typography>
            {
                !error.cause &&
                <Typography fontFamily='monospace' color='text.dark' fontSize='12px'>{error.stack}</Typography>
            }

            <DestroyButton title='Reset app' onConfirmDestroy={() => setDeleteCandidate(['tournaments', 'chipsets', 'settings'])} />

        </>
    );
};

export const ErrorPage = () => {
    var error = useRouteError() as Error;

    if (!error) {
        error = new Error('404 - The page you have requested does not exist.', { cause: '404' });
    }

    return (
        <div className='page error'>
            <ErrorView error={error} />
        </div>
    );
};
