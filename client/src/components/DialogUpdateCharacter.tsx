import * as React from 'react';
import { useState } from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    MenuItem,
    FormLabel,
    FormHelperText,
} from '@mui/material';
import { Character } from '../hooks/services/useProjectResource';
import { TagContainer } from './Tag';

export default function DialogUpdateCharacter({
    payload,
    open,
    onClose,
}: DialogProps<Character, Partial<Character> | null>) {
    const [updatedInfo, setUpdatedInfo] = useState<Partial<Character>>(payload);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [tagError, setTagError] = useState<string | null>(null);

    const handleUpdate = () => {
        if (!updatedInfo.name?.trim()) {
            setError('Name is required');
            return;
        }
        onClose(updatedInfo);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setUpdatedInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === 'name' && value.trim()) {
            setError(null);
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedInfo((prev) => ({
            ...prev,
            role: e.target.value,
        }));
    };

    const handleTagAdd = () => {
        const trimmedTag = tagInput.trim();
        if (!trimmedTag) return;

        const existingTags = updatedInfo.tags || [];
        if (existingTags.includes(trimmedTag)) {
            setTagError('This tag already exists.');
            return;
        }

        setUpdatedInfo((prev) => ({
            ...prev,
            tags: [...existingTags, trimmedTag],
        }));
        setTagInput('');
        setTagError(null);
    };

    const handleTagDelete = (tagToDelete: string) => {
        setUpdatedInfo((prev) => ({
            ...prev,
            tags: (prev.tags || []).filter((tag) => tag.trim() !== tagToDelete.trim()),
        }));
    };

    return (
        <Dialog fullWidth sx={{ p: 2 }} open={open} onClose={() => onClose(null)}>
            <DialogTitle>Editing Character: {payload.name}</DialogTitle>
            <DialogContent>
                <FormLabel>Character Info</FormLabel>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Name"
                        name="name"
                        value={updatedInfo.name || ''}
                        onChange={handleChange}
                        placeholder="Character name"
                        autoFocus
                        error={!!error}
                        helperText={error}
                        fullWidth
                    />

                    <TextField
                        label="Description"
                        name="description"
                        value={updatedInfo.description || ''}
                        onChange={handleChange}
                        placeholder="Description"
                        multiline
                        minRows={3}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Role"
                        name="role"
                        value={updatedInfo.role || ''}
                        onChange={handleRoleChange}
                        fullWidth
                    >
                        <MenuItem value="Protagonist">Protagonist</MenuItem>
                        <MenuItem value="Antagonist">Antagonist</MenuItem>
                        <MenuItem value="Supporting">Supporting</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        <MenuItem value="">None</MenuItem>
                    </TextField>

                    <FormLabel>Tags</FormLabel>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            value={tagInput}
                            onChange={(e) => {
                                setTagInput(e.target.value);
                                if (tagError) setTagError(null);
                            }}
                            placeholder="Add tag"
                            error={!!tagError}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleTagAdd();
                                }
                            }}
                            // fullWidth
                            sx={{ flexGrow: 1 }}
                        />
                        <Button variant="contained" onClick={handleTagAdd}>
                            Add Tag
                        </Button>
                    </Stack>
                    {tagError && (
                        <FormHelperText error>{tagError}</FormHelperText>
                    )}

                    <TagContainer tags={updatedInfo.tags ?? []} onRemove={handleTagDelete} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleUpdate} disabled={!updatedInfo.name?.trim()}>
                    Save
                </Button>
                <Button variant="contained" onClick={() => onClose(null)} color="inherit">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
