import TextField from "@mui/material/TextField";
import { ChangeEvent, Dispatch, useState } from "react";
import { Form, useActionData, useLoaderData, useParams, useSubmit } from "react-router-dom";
import { configuration } from "../../configuration";
import LocalizationController from "../../controllers/LocalizationController";
import HeaderView from "../../views/HeaderView";
import { ChipPayload, ChipSetPayload } from "../../pipes/DataStoreSchemaV1";
import { DataStore, RouteAction } from "../../pipes/DataStore";
import { usePageTitle } from "../../hooks/usePageTitle";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { contextualDescriptor, determineStorableKind } from "../../pipes/Storable";
import { SecondaryBlockHeaderView } from "../../views/SecondaryHeaderView";
import { ChipSetTableView } from "../../views/ChipsetTableView";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { SelectorView } from "../../views/SelectorView";
import { Color, cssValueForNamedColor } from "../../models/Color";
import { Factory } from "../../pipes/Factory";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

let strings = configuration.strings.en.chip;

const EditableChipRow = (props: { chip: ChipPayload, update: Dispatch<ChipPayload>, remove: () => void }) => {
    const { chip, update, remove } = props;
    return (
        <TableRow key={chip.id}>
            <TableCell>
                <TextField color='secondary' size='small' name='value' value={chip.value} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    update({ ...chip, value: Number(event.target.value) })
                }} />
            </TableCell>
            <TableCell>
                <TextField color='secondary' size='small' name='count' value={chip.count} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    update({ ...chip, count: Number(event.target.value) })
                }} />
            </TableCell>
            <TableCell sx={{backgroundColor: cssValueForNamedColor(chip.color) }}>
                <SelectorView
                    values={Object.values(Color)}
                    selected={chip.color}
                    formValue={candidate => candidate || 'white'}
                    format={(candidate => {
                        return candidate || 'white';
                    })}
                    didSelectValue={candidate => {
                        update({ ...chip, color: candidate || 'white' });
                    }}
                />
            </TableCell>
            <TableCell>
                <IconButton onClick={remove}><RemoveIcon /></IconButton>
            </TableCell>
        </TableRow>
    );
};

export const ChipSetEditPage = () => {
    useActionData();
    const originalChipset = useLoaderData() as ChipSetPayload;
    const [chipset, updateSet] = useState(originalChipset);
    const submit = useSubmit();
    const { id } = useParams();

    const kind = determineStorableKind(chipset, id);
    const title = `${contextualDescriptor(kind)} chip set`;
    usePageTitle(title);

    return (
        <Paper className='page chip-set'>
            <HeaderView title={LocalizationController.mapString(strings.subtitle[kind], { setname: originalChipset.name })} />
            <div className='content'>
                <Form onSubmit={e => {
                    e.preventDefault();
                    submit(JSON.stringify(chipset), { method: 'post', encType: 'application/json', action: DataStore.route('chipsets', RouteAction.forge, chipset) });
                }}>
                    <div style={{marginBottom: '20px', marginTop: '10px'}}>
                        <TextField color='secondary' variant='outlined' label='Name' name='name' value={chipset.name} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            updateSet({ ...chipset, name: event.target.value })
                        }} />
                    </div>
                    <SecondaryBlockHeaderView title={'Chips'}>
                        <IconButton onClick={() => {
                            updateSet({
                                ...chipset,
                                chips: [...chipset.chips, Factory.chip()]
                            });
                        }}><AddIcon htmlColor='white' />
                        </IconButton>
                    </SecondaryBlockHeaderView>
                    <ChipSetTableView headers={['Actions']}>
                        {chipset.chips?.map((chip, index) => <EditableChipRow chip={chip} update={value => {
                            updateSet({
                                ...chipset,
                                chips: chipset.chips.map(c => {
                                    if (chip.id === c.id) {
                                        return value;
                                    } else {
                                        return c;
                                    }
                                })
                            })
                        }}
                            remove={() => {
                                updateSet({
                                    ...chipset,
                                    chips: chipset.chips.filter((c, i) => i !== index)
                                })
                            }}
                        />)}
                    </ChipSetTableView>
                    <Button type='submit' color='secondary' variant='contained'>{strings.actions.save}</Button>
                </Form>
            </div>
        </Paper >
    );
};
