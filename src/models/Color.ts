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

const customColors: { [key in Color]?: string } = {
    [Color.black]: colors.common.black,
    [Color.white]: colors.common.white
};

export const cssValueForNamedColor = (colorName?: string, context: ColorIndex = '500'): string => {
    const color = stringToColor(colorName);
    if (!color) {
        return colors.common.white;
    }
    if (color in colors) {
        return (colors as any)[color][context];
    }

    if (color in customColors) {
        return customColors[color]!;
    }

    throw new Error(`Invalid color: ${color}`);
}

export const cssValueForColor = (color: Color | undefined, context: ColorIndex = '500'): string => {
    if (!color) {
        return colors.common.white;
    }
    
    if (color in colors) {
        return (colors as any)[color][context];
    }

    if (color in customColors) {
        return customColors[color]!;
    }

    throw new Error(`Invalid color: ${color}`);
};

export function stringToColor(color?: string): Color | undefined {
    if (!color) {
        return undefined;
    }
    if (color in Color) {
        return Color[color as keyof typeof Color];
    } else {
        return undefined;
    }
}
