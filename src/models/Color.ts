import * as colors from '@mui/material/colors';

export enum Color {
    amber = 'amber',
    black = 'black',
    blue = 'blue',
    blueGrey = 'blueGrey',
    brown = 'brown',
    cyan = 'cyan',
    deepOrange = 'deepOrange',
    deepPurple = 'deepPurple',
    green = 'green',
    grey = 'grey',
    indigo = 'indigo',
    lightBlue = 'lightBlue',
    lightGreen = 'lightGreen',
    lime = 'lime',
    orange = 'orange',
    pink = 'pink',
    purple = 'purple',
    red = 'red',
    teal = 'teal',
    white = 'white',
    yellow = 'yellow'
}

type ColorIndex = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
const materialColor = colors as Record<string, { [key in ColorIndex]?: string }>;

const customColors: { [key in Color]?: string } = {
    [Color.black]: colors.common.black,
    [Color.white]: colors.common.white
};

export const cssValueForNamedColor = (colorName?: string, context: ColorIndex = '500', defaultColor = colors.common.white): string => {
    if (!colorName) {
        return defaultColor;
    }
    const color = Color[colorName as keyof typeof Color];

    if (color in materialColor) {
        return materialColor[color][context] || defaultColor;
    }

    return customColors[color] || defaultColor;
}
