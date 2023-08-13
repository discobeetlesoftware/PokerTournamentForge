import { Dispatch, useCallback, ChangeEvent, useState } from "react";
import { SelectorViewProps, SelectorView } from "./SelectorView";
import { configuration } from "../configuration";
import Grid, { GridSize } from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { ExpandableElementView } from "./ExpandableElementView";
import { ChipSetPayload, ColorUpBreakpoint, TournamentPayload } from "../pipes/DataStoreSchemaV1";
import { FormatterController } from "../controllers/FormatterController";

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

export interface TournamentBreakpointViewProps {
    breakpoints: ColorUpBreakpoint[],
    chipset: ChipSetPayload,
    update: Dispatch<Partial<TournamentPayload>>;
}

const ConfigurableElementTitle = (props: { tooltip: string, isVisible: boolean, title: string, setIsVisible: (v: boolean) => void  }) => {
    return (
        <Tooltip title={props.tooltip}>
        <div className='title'>
            <Typography color='text.secondary' variant='body1' component='span'>{props.title}</Typography>
            <Switch color='secondary' size='small' checked={props.isVisible} onChange={(e, v) => props.setIsVisible(v)} sx={{ marginLeft: '5px' }} />
        </div>
    </Tooltip>
    );
};

export const TournamentBreakpointView = (props: TournamentBreakpointViewProps) => {
    const { chipset, update, breakpoints } = props;
    const [isVisible, setIsVisible] = useState(true);
    const mapKey = 'color_up_breakpoints';
    const defaultThreshold = configuration.defaults.color_up_threshold;
    const formStrings = configuration.strings.en.tournament.form as Record<string, ConfigurableElementStrings>;
    const [selectedIndex, setSelectedIndex] = useState(0);

    const breakpoint = breakpoints[selectedIndex] || breakpoints[breakpoints.length - 1];
    const selectedConfig = {
        min: chipset.chips[selectedIndex + 1].value,
        step: chipset.chips[selectedIndex].value,
        max: breakpoint ? (breakpoint.denomination * 20) : chipset.chips[chipset.chips.length - 1].value
    };

    const canReset = true;//!breakpoints.every(breakpoint => breakpoint.threshold === defaultThreshold);

    const onReset = useCallback(() => {
        setSelectedIndex(0);
        update({
            [mapKey]: chipset.chips.map(chip => {
                return { denomination: chip.value, threshold: chip.value / defaultThreshold };
            }
        )});
    }, [update, defaultThreshold]);

    return (
        <Grid item xs={6} md={4} lg={3} xl={2}>

            <div className='control-group'>
                <ConfigurableElementTitle tooltip={formStrings[mapKey].tooltip} title={formStrings[mapKey].name} isVisible={isVisible} setIsVisible={setIsVisible} />
                <ExpandableElementView isOpen={isVisible}>
                <SelectorView
                    values={chipset.chips.slice(0, chipset.chips.length - 1)}
                    selected={chipset.chips[selectedIndex]}
                    didSelectValue={chip => {
                        if (chip === undefined) {
                            setSelectedIndex(0);
                        } else {
                            const index = chipset.chips.findIndex(candidate => chip.value === candidate.value);
                            setSelectedIndex(index);
                        }
                    }}
                    formValue={candidate => {
                        const chip = candidate || chipset.chips[0];
                        return chip.value.toString();
                    }}
                    format={candidate => {
                        const chip = candidate || chipset.chips[0];
                        return FormatterController.chip(chip)
                    }}
                />
                <Slider
                    marks
                    color='secondary'
                    min={selectedConfig.min}
                    step={selectedConfig.step}
                    max={selectedConfig.max}
                    value={(breakpoints[selectedIndex] || breakpoints[breakpoints.length - 1]).threshold}
                    valueLabelDisplay='auto'
                    onChange={(e, v) => {
                        const updatedBreakpoints = breakpoints.map((breakpoint, index) => {
                            if (index === selectedIndex) {
                                return {
                                    ...breakpoint,
                                    threshold: (v as number)
                                }
                            } else {
                                return breakpoint;
                            }
                        });
                        update({[mapKey]: updatedBreakpoints});
                    }}
                />
                <div className='action'>
                    <Button color='secondary' variant='contained' size='small' onClick={onReset} disabled={!canReset}>Reset</Button>
                </div>
            </ExpandableElementView>
        </div >
        </Grid >
    )
};

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
                <ConfigurableElementTitle tooltip={formStrings[mapKey].tooltip} title={formStrings[mapKey].name} isVisible={isVisible} setIsVisible={setIsVisible} />
                <ExpandableElementView isOpen={isVisible}>
                    {fieldTypeString && <TextField
                        color='secondary'
                        fullWidth
                        size='small'
                        placeholder={formStrings[mapKey].placeholder}
                        name={mapKey}
                        value={onFormat(value as any)}
                        id={mapKey}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => update({
                            [mapKey]: fieldTypeNumber ? Number(event.target.value) : event.target.value
                        })}
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
                        onChange={(_, v) => update({ [mapKey]: v })}
                    />}
                    <div className='action'>
                        <Button color='secondary' variant='contained' size='small' onClick={onReset} disabled={!canReset}>Reset</Button>
                    </div>
                </ExpandableElementView>
            </div >
        </Grid>
    )
};
