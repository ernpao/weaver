import * as React from 'react';
import { useProjectCharacters } from '../hooks/services/useProjectResource';
import { Avatar, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardOverflow, Chip, Dropdown, IconButton, Menu, MenuButton, MenuItem, Stack, Typography } from '@mui/joy';
import { CardHeader, Fab } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDialogs } from '@toolpad/core';
import DialogUpdateCharacter from '../components/DialogUpdateCharacter';
import DialogDeleteConfirmation from '../components/DialogDeleteConfirmation';
import Tag, { TagContainer } from '../components/Tag';

function truncateString(str: string, num: number) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

export default function Characters() {
    const dialogs = useDialogs()
    const { items, loading, error, create, update, remove } = useProjectCharacters();

    return (
        <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
            {/* Scrollable grid area */}
            <Box
                sx={{
                    height: '100%',
                    overflowY: 'auto',
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(5, 1fr)',
                        },
                        gap: 2, // Equal vertical and horizontal spacing
                    }}
                >
                    {items.map((item, index) => (
                        <Card key={index} title={item.name}
                            sx={{
                                position: 'relative',
                            }}>
                            <Dropdown>
                                <MenuButton slots={{ root: IconButton }}
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        zIndex: 1000,
                                    }}>
                                    <MoreVert /></MenuButton>
                                <Menu>
                                    <MenuItem onClick={
                                        () => { update(item.uuid, dialogs.open(DialogUpdateCharacter, item)) }
                                    }><EditIcon />Edit</MenuItem>


                                    <MenuItem onClick={
                                        () => { remove(item.uuid, dialogs.open(DialogDeleteConfirmation, `Are you sure you want to delete "${item.name}?"`)) }
                                    }><DeleteIcon />Delete</MenuItem>
                                </Menu>
                            </Dropdown>

                            <CardOverflow sx={{ p: 2, alignItems: 'center' }}>
                                <Avatar sx={{ '--Avatar-size': '9rem', mb: 1 }} />
                            </CardOverflow>
                            <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>


                                <Typography gutterBottom level="title-lg" >{item.name}</Typography>
                                {item.role && <Chip variant='outlined' sx={{ py: 1, px: 2 }}><Typography level="body-sm" fontStyle={"italic"}>{item.role}</Typography></Chip>}
                                {item.description && <Typography gutterBottom level="body-sm" sx={{ m: 1, maxWidth: '32ch' }}>
                                    {truncateString(item.description, 64)}
                                </Typography>}

                                {(item.tags.length) > 0 && <TagContainer tags={item.tags} />}
                                
                            </CardContent>
                            <CardOverflow sx={{ bgcolor: 'background.level1' }}>
                                <CardActions buttonFlex="1">
                                    <ButtonGroup spacing={1} variant="solid" sx={{ bgcolor: 'background.surface' }}>
                                        <Button color='primary'>View</Button>
                                        {/* <Button color='neutral' onClick={
                                            async () => {
                                                await update(item);
                                                await fetchItems();
                                            }}>
                                            Edit
                                        </Button> */}
                                    </ButtonGroup>
                                </CardActions>
                            </CardOverflow>
                        </Card>
                    ))}
                </Box>
            </Box>

            {/* Floating Action Button */}
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
        </Box >
    );
}
