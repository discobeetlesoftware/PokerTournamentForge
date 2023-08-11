import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FC, forwardRef } from "react";

interface ConfirmDeleteDialogProps {
    isOpen: boolean;
    message: string;
    dismiss: (didConfirm: boolean) => void;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>) {
        return <Slide direction="up" ref={ref} {...props} />;
});

export const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = (props) => {
    const { isOpen, dismiss, message } = props;
    return (
        <Dialog
            open={isOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => dismiss(false)}
        >
            <DialogTitle>{"Confirm"}</DialogTitle>
            <DialogContent>
                <DialogContentText id='delete-dialog-description'>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => dismiss(false)}>Keep</Button>
                <Button onClick={() => dismiss(true)}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}
