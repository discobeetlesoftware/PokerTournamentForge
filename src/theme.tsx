import { ThemeOptions, createTheme } from '@mui/material/styles';

export const redThemeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#d64545',
            light: '#f29b9b',
            dark: '#911111',
        },
        background: {
            default: '#e8e6e1',
            paper: '#ffffff',
        },
        text: {
            disabled: '#a39e93',
            primary: '#27241d',
            secondary: '#423d33',
        },
        secondary: {
            main: '#0a6c74',
            dark: '#044e54',
            light: '#2cb1bc',
        },
        error: {
            main: '#b44d12',
            light: '#cb6e17',
            dark: '#8d2b0b',
        },
        success: {
            main: '#7bb026',
            light: '#94c843',
            dark: '#507712',
        },
    },
    typography: {
        fontFamily: 'Rubik',
    },
};

export const theme = createTheme(redThemeOptions);