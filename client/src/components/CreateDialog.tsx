import * as React from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import Button from '@mui/joy/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Input, FormHelperText } from '@mui/joy';
import { useState } from 'react';

interface CreateDialogProps extends DialogProps<string, string | null> {
    resourceType: string;
}

export default function CreateDialog({ payload, open, onClose }: DialogProps<string, string | null>) {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleCreate = () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setError(`${payload} name is required.`);
            return;
        }
        setError(null);
        onClose(trimmed); // ✅ returns string to caller
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (error && e.target.value.trim()) {
            setError(null);
        }
    };

    return (
        <Dialog fullWidth sx={{
            p: 2
        }}
            open={open}
            onClose={() => onClose(null)}
        >
            <DialogTitle>Create A New {payload}</DialogTitle>
            <DialogContent>
                <Input
                    placeholder={`Enter ${payload.toLowerCase()} name`}
                    value={name}
                    onChange={handleChange}
                    autoFocus
                    error={!!error}
                />
                {error && <FormHelperText color="danger">{error}</FormHelperText>}
            </DialogContent>
            <DialogActions>
                <Button variant="plain" color="neutral" onClick={() => onClose(null)}>
                    Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!name.trim()}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
