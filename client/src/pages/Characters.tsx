import * as React from 'react';
import { useProjectCharacters } from '../hooks/services/useProjectResource';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    ButtonGroup,
    Menu,
    MenuItem,
    CardActions,
    Chip,
    Typography,
    Fab,
    CardHeader,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDialogs } from '@toolpad/core';
import DialogUpdateCharacter from '../components/DialogUpdateCharacter';
import DialogDeleteConfirmation from '../components/DialogDeleteConfirmation';
import Tag, { TagContainer } from '../components/Tag';
import { Menu as DropdownMenu } from '@mui/material';

function truncateString(str: string, num: number) {
    return str.length > num ? str.slice(0, num) + '...' : str;
}

export default function Characters() {
    const dialogs = useDialogs();
    const { items, loading, error, create, update, remove } = useProjectCharacters();
    const [anchorEls, setAnchorEls] = React.useState<{ [uuid: string]: HTMLElement | null }>({});

    const handleMenuOpen = (uuid: string, event: React.MouseEvent<HTMLElement>) => {
        setAnchorEls((prev) => ({ ...prev, [uuid]: event.currentTarget }));
    };

    const handleMenuClose = (uuid: string) => {
        setAnchorEls((prev) => ({ ...prev, [uuid]: null }));
    };

    return (
        <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', overflowY: 'auto', padding: 2 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(5, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    {items.map((item) => (
                        <Card key={item.uuid} sx={
                            {
                                position: 'relative', display: 'flex', flexDirection: 'column',
                                // borderRadius: 5
                            }
                        }>
                            <IconButton
                                onClick={(e) => handleMenuOpen(item.uuid, e)}
                                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEls[item.uuid]}
                                open={Boolean(anchorEls[item.uuid])}
                                onClose={() => handleMenuClose(item.uuid)}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose(item.uuid);
                                        update(item.uuid, dialogs.open(DialogUpdateCharacter, item));
                                    }}
                                >
                                    <EditIcon sx={{ mr: 1 }} />
                                    Edit
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose(item.uuid);
                                        remove(
                                            item.uuid,
                                            dialogs.open(DialogDeleteConfirmation, `Are you sure you want to delete "${item.name}?"`)
                                        );
                                    }}
                                >
                                    <DeleteIcon sx={{ mr: 1 }} />
                                    Delete
                                </MenuItem>
                            </Menu>

                            <CardContent sx={{ alignItems: 'center', textAlign: 'center', flexGrow: '1' }}>
                                <Avatar sx={{ width: 90, height: 90, mb: 2, mx: 'auto' }} />
                                <Typography variant="h6" gutterBottom>
                                    {item.name}
                                </Typography>

                                {item.role && (
                                    <Chip
                                        variant="outlined"
                                        sx={{ py: 0.5, px: 2, mb: 1 }}
                                        label={<Typography variant="body2" fontStyle="italic">{item.role}</Typography>}
                                    />
                                )}

                                {item.description && (
                                    <Typography variant="body2" sx={{ mb: 1, maxWidth: '32ch', mx: 'auto' }}>
                                        {truncateString(item.description, 64)}
                                    </Typography>
                                )}

                                {item.tags.length > 0 && <TagContainer tags={item.tags} />}
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'center', bgcolor: 'background.paper', py: 2 }}>
                                <ButtonGroup variant="contained">
                                    <Button color="primary">View</Button>
                                </ButtonGroup>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Box>

            <Fab
                color="primary"
                onClick={create}
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}
