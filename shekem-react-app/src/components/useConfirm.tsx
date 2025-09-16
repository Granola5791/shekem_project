import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

interface ConfirmProps {
    yesButtonText: string;
    noButtonText: string;
};

export function useConfirm() {
    const [confirmState, setConfirmState] = useState<{
        open: boolean;
        message: string;
        resolve?: ((value: boolean) => void) | null;
    }>({ open: false, message: "" });

    const askConfirm = (message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({ open: true, message, resolve });
        });
    };

    const onCancel = () => {
        confirmState.resolve?.(false);
        setConfirmState({ ...confirmState, open: false });
    };

    const onOK = () => {
        confirmState.resolve?.(true);
        setConfirmState({ ...confirmState, open: false });
    };

    const ConfirmDialog = ({ noButtonText, yesButtonText }: ConfirmProps) => (
        <Dialog open={confirmState.open} onClose={onCancel}>
            <DialogContent>
                <Typography>{confirmState.message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    {noButtonText}
                </Button>
                <Button onClick={onOK} autoFocus>
                    {yesButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return { askConfirm, ConfirmDialog };
}
