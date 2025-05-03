import * as React from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import Button from '@mui/joy/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
    Input,
    FormHelperText,
    Textarea,
    Stack,
    Chip,
    IconButton,
    Select,
    Option,
    FormLabel,
} from '@mui/joy';
import { Close } from '@mui/icons-material';
import { useState } from 'react';
import { Character } from '../hooks/services/useProjectResource';

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

    const handleRoleChange = (_: any, newValue: string | null) => {
        setUpdatedInfo((prev) => ({
            ...prev,
            role: newValue || '',
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
                <Stack spacing={2} mt={1}>

                    <FormLabel>Name</FormLabel>
                    <Input
                        name="name"
                        value={updatedInfo.name || ''}
                        onChange={handleChange}
                        placeholder="Character name"
                        autoFocus
                        error={!!error}
                    />
                    {error && <FormHelperText color="danger">{error}</FormHelperText>}

                    <FormLabel>Description</FormLabel>
                    <Textarea
                        name="description"
                        value={updatedInfo.description || ''}
                        onChange={handleChange}
                        placeholder="Description"
                        minRows={3}
                    />


                    <FormLabel>Role</FormLabel>
                    <Select
                        name="role"
                        value={updatedInfo.role || ''}
                        onChange={handleRoleChange}
                        placeholder="Select role"
                        slotProps={{
                            listbox: {
                                sx: {
                                    zIndex: 2000, // higher than Dialog
                                },
                            },
                        }}
                    >
                        <Option value="Protagonist">Protagonist</Option>
                        <Option value="Antagonist">Antagonist</Option>
                        <Option value="Supporting">Supporting</Option>
                        <Option value="Other">Other</Option>
                        <Option value="">None</Option>
                    </Select>

                    <FormLabel>Tags</FormLabel>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Input
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
                        />
                        <Button size="sm" onClick={handleTagAdd}>
                            Add Tag
                        </Button>
                    </Stack>
                    {tagError && <FormHelperText color="danger">{tagError}</FormHelperText>}

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {(updatedInfo.tags || []).map((tag, index) => (
                            <Chip
                                key={index}
                                variant="outlined"
                                onClick={() => handleTagDelete(tag)}
                                endDecorator={
                                    <IconButton
                                        size="sm"
                                        sx={{
                                            ml: 0.5,
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            '&:hover': { opacity: 1 },
                                        }}
                                    >
                                        <Close fontSize="small" />
                                    </IconButton>
                                }
                                sx={{
                                    '&:hover .MuiIconButton-root': {
                                        opacity: 1,
                                    },
                                    paddingLeft: 5,
                                }}
                            >
                                {tag}
                            </Chip>
                        ))}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="plain" color="neutral" onClick={() => onClose(null)}>
                    Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={!updatedInfo.name?.trim()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
