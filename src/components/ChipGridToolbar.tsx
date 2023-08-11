import AddIcon from '@mui/icons-material/Add';
import { Button } from "@mui/material";
import { GridRowsProp, GridRowModesModel, GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { Factory } from '../pipes/Factory';

type GridRowModesModelTransformer = (oldModel: GridRowModesModel) => GridRowModesModel;

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: GridRowModesModelTransformer) => void;
}

export function ChipGridToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
        let newChip = Factory.chip();
        setRows((oldRows) => [...oldRows, {...newChip, isNew: true}]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [newChip.id]: { mode: GridRowModes.Edit, fieldToFocus: 'value' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add chip
            </Button>
        </GridToolbarContainer>
    );
}
