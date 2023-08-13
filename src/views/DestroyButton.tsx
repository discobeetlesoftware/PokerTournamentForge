import Button from "@mui/material/Button";
import WarningIcon from '@mui/icons-material/Warning';

export const DestroyButton = (props: { title: string, onConfirmDestroy: () => void }) => {
    return (
        <div className='destroy-button'>
            <Button color='warning' startIcon={<WarningIcon />} variant='outlined' size='large' onClick={props.onConfirmDestroy}>{props.title}</Button>
        </div>
    );
}
