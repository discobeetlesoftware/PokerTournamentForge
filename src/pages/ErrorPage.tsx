import Typography from '@mui/material/Typography';
import { useLocation, useRouteError } from 'react-router-dom';
import HeaderView from '../components/HeaderView';
import { configuration } from '../configuration';
import { SvgIcon } from '@mui/material';
import { ReactComponent as FlowersIcon } from '../assets/flowers.svg';

let strings = configuration.strings.en.error;

const ErrorView = (props: { error: Error }) => {
    const location = useLocation();
    const { error } = props;
    return (
        <>
            <SvgIcon component={FlowersIcon} inheritViewBox color='inherit' sx={{ height: '5em', width: '5em', margin: '10px', float: 'right' }} />
            <HeaderView title={strings.title} />
            <Typography variant='h5'>💥 This is not great news 💥</Typography>
            <Typography color='error.main'><span style={{ fontWeight: 800 }}>Route:</span> {location.pathname}</Typography>
            <Typography color='error.light'><span style={{ fontWeight: 800 }}>Cause:</span> {error.message}</Typography>
            {
                !error.cause &&
                <Typography fontFamily='monospace' color='text.dark' fontSize='12px'>{error.stack}</Typography>
            }
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
