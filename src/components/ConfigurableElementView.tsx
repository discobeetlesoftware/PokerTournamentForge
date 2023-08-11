import { Dispatch, useCallback, ChangeEvent, useState, ReactNode } from "react";
import { SelectorViewProps, SelectorView } from "./SelectorView";
import { configuration } from "../configuration";
import Grid, { GridSize } from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export interface Formatable {
    toString(): string;
}

export type FormModel = Record<string, string | number | string[] | number[]>;

export type ConfigurableNumberParams = {
    min: number;
    max: number;
    step: number;
}

export type ConfigurableElementStrings = {
    name: string;
    tooltip: string;
    placeholder?: string;
}

export interface ConfigurableElementViewProps<T extends Formatable> {
    mapKey: string;
    grid?: {
        xs?: GridSize | boolean;
        md?: GridSize | boolean;
        lg?: GridSize | boolean;
        xl?: GridSize | boolean;
    }
    update: Dispatch<Partial<FormModel>>;
    formElement: FormModel;
    defaultElement: FormModel;
    selectorViewProps?: Omit<SelectorViewProps<T>, 'didSelectValue' | 'format'>;
    format?: (value: T) => string;
}

const ExpandableElementView = (props: { isOpen: boolean, children: ReactNode }) => {
    const { isOpen, children } = props;
    return (
        <>
            {isOpen &&
                <div className='element' >{children}</div>
            }
        </>
    );
};

export const ConfigurableElementView = <T extends Formatable>(props: ConfigurableElementViewProps<T>) => {
    const [isVisible, setIsVisible] = useState(true);
    const configs = configuration.defaults.form as Record<string, ConfigurableNumberParams>;
    const formStrings = configuration.strings.en.tournament.form as Record<string, ConfigurableElementStrings>;

    const { mapKey, grid, update, formElement, defaultElement, selectorViewProps, format } = props;
    const value = formElement[mapKey];
    const canReset = value !== defaultElement[mapKey];
    const onReset = useCallback(() => {
        update({ [mapKey]: defaultElement[mapKey] });
    }, [mapKey, update, defaultElement]);
    const onFormat = format ? format : (value: T): string => {
        return value.toString();
    };

    const fieldTypeString = !selectorViewProps && (configs[mapKey] === undefined || !Array.isArray(value))
    const fieldTypeNumber = !selectorViewProps && configs[mapKey] !== undefined;

    return (
        <Grid item xs={grid?.xs || 6} md={grid?.md || 4} lg={grid?.lg || 3} xl={grid?.xl || 2}>
            <div className='control-group'>
                <Tooltip title={formStrings[mapKey].tooltip}>
                    <div className='title'>
                        <Typography color='text.secondary' variant='body1' component='span'>{formStrings[mapKey].name}</Typography>
                        <Switch size='small' checked={isVisible} onChange={(e, v) => setIsVisible(v)} sx={{marginLeft:'5px'}} />
                    </div>
                </Tooltip>
                <ExpandableElementView isOpen={isVisible}>
                    {fieldTypeString && <TextField
                        color='secondary'
                        fullWidth
                        size='small'
                        placeholder={formStrings[mapKey].placeholder}
                        name={mapKey}
                        value={onFormat(value as any)}
                        id={mapKey}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => update({ [mapKey]: event.target.value })}
                    />}
                    {selectorViewProps && <SelectorView {...selectorViewProps}
                        formValue={candidate => {
                            return candidate ? selectorViewProps.formValue(candidate) : `empty_${mapKey}`
                        }}
                        format={(candidate => {
                            return candidate ? onFormat(candidate) : formStrings[mapKey].placeholder || '';
                        })}
                        didSelectValue={candidate => {
                            update({ [mapKey]: candidate ? selectorViewProps?.formValue(candidate) : undefined })
                        }}
                    />}
                    {fieldTypeNumber && <Slider
                        color='secondary'
                        min={configs[mapKey].min}
                        step={configs[mapKey].step}
                        max={configs[mapKey].max}
                        value={value as number}
                        valueLabelDisplay={fieldTypeString ? 'off' : 'auto'}
                        onChange={(e, v) => update({ [mapKey]: v })}
                    />}
                    <div className='action'>
                        <Button color='secondary' variant='contained' size='small' onClick={onReset} disabled={!canReset}>Reset</Button>
                    </div>
                </ExpandableElementView>
            </div >
        </Grid>
    )
};
