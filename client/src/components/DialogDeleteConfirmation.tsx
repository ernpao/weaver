import * as React from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

export default function DialogDeleteConfirmation({
    payload,
    open,
    onClose,
}: DialogProps<string, boolean>) {
    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            fullWidth
            sx={{ p: 2 }}
        >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography>{payload}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="plain" color="neutral" onClick={() => onClose(false)}>
                    Cancel
                </Button>
                <Button color="danger" onClick={() => onClose(true)}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
