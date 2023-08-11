import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface SelectorViewProps<T> {
    values: T[];
    selected?: T;
    isDisabled?: boolean;
    didSelectValue: (value: T | undefined) => void;
    format: (value?: T) => string;
    formValue: (value?: T) => string;
}

export const SelectorView = <T,>(props: SelectorViewProps<T>) => {
    const { values, selected, isDisabled, didSelectValue, format, formValue } = props;

    const onChange = (event: SelectChangeEvent<string>) => {
        const result = values.find(value => formValue(value) === event.target.value);
        didSelectValue(result);
    };
    const selectedId = formValue(selected);

    return (
        <FormControl sx={{ margin: 0, width:'100%', backgroundColor:'white'}} size='small'>
            <Select disabled={isDisabled || false} color='secondary' fullWidth value={selectedId} onChange={onChange}>
                <MenuItem key={formValue(undefined)} value={formValue(undefined)} selected={!selected}>
                    {format(undefined)}
                </MenuItem>
                {
                    values.map(value => {
                        let id = formValue(value);
                        return <MenuItem key={id} value={id} selected={selectedId === id}>
                            {format(value)}
                        </MenuItem>       
                    })
                }
            </Select>
        </FormControl>
    );
};
