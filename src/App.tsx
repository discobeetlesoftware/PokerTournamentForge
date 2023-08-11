import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useRouteError } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { WelcomePage } from './pages/WelcomePage';
import { AboutPage } from './pages/AboutPage';
import { ChipSetPage } from './pages/chipsets/ChipSetPage';
import { theme } from './theme';
import { ChipListPage } from './pages/chipsets/ChipListPage';
import { TournamentListPage } from './pages/tournaments/TournamentListPage';
import { chipSetDeleteAction, chipListLoader, chipSetLoader, chipSetUpdateAction, chipSetEditLoader } from './pipes/ChipSetPipes';
import { tournamentDeleteAction, tournamentListLoader, tournamentEditLoader, tournamentUpdateAction, enrichedTournamentLoader, sharedTournamentLoader } from './pipes/TournamentPipes';
import { TournamentEditPage } from './pages/tournaments/TournamentEditPage';
import usePresets from './hooks/usePresets';
import { SettingsPage } from './pages/SettingsPage';
import { TournamentPage } from './pages/tournaments/TournamentPage';
import { ChipSetEditPage } from './pages/chipsets/ChipSetEditPage';
import { ErrorPage } from './pages/ErrorPage';
import PiwikPro from '@piwikpro/react-piwik-pro';
import { useEffect } from 'react';
import { settingsLoader, settingsUpdateAction } from './pipes/SettingsPipes';

const routes = createRoutesFromElements(
    <Route path='/' element={<AppLayout />} ErrorBoundary={ErrorPage} >
        <Route index element={<WelcomePage />} />
        <Route path='chipsets'>
            <Route index element={<ChipListPage />} loader={chipListLoader} />
            <Route path=':id'>
                <Route index element={<ChipSetPage />} loader={chipSetLoader} action={chipSetDeleteAction} />
                <Route path='forge' element={<ChipSetEditPage />} loader={chipSetEditLoader} action={chipSetUpdateAction} />
            </Route>
        </Route>
        <Route path='tournaments'>
            <Route index element={<TournamentListPage />} loader={tournamentListLoader} />
            <Route path='share' element={<TournamentPage />} loader={sharedTournamentLoader} />
            <Route path=':id'>
                <Route index element={<TournamentPage />} loader={enrichedTournamentLoader} action={tournamentDeleteAction}  />
                <Route path='forge' element={<TournamentEditPage />} loader={tournamentEditLoader} action={tournamentUpdateAction} />
            </Route>
        </Route>
        <Route path='about'>
            <Route index element={<AboutPage />} />
        </Route>
        <Route path='settings'>
            <Route index element={<SettingsPage />} loader={settingsLoader} action={settingsUpdateAction} />
        </Route>
        <Route path='*' element={<ErrorPage />} />
    </Route>
);

const router = createBrowserRouter(routes, { basename: '/PokerTournamentForge' });

function App() {
    usePresets();

    useEffect(() => {
        const configure = () => {
            PiwikPro.initialize('1f7e4b4a-3271-4027-bc94-f31ce19da243', 'https://discobeetle.containers.piwik.pro');
        }
        const timer = setTimeout(configure, 100);
        return () => {
            clearTimeout(timer);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
