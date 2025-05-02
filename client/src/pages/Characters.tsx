import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useProjectCharacters } from '../hooks/services/useProjectResource';
import { Card } from '@mui/joy';
import { Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Characters() {
    const { items, loading, error, createNew, update, remove } = useProjectCharacters();

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
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: 2, // Equal vertical and horizontal spacing
                    }}
                >
                    {items.map((item, index) => (
                        <Card
                            key={index}
                            title={item.name}
                            sx={{
                                minHeight: "33.33vh",
                            }}
                        >
                            <Typography variant='h5'>{item.name}</Typography>
                        </Card>
                    ))}
                </Box>
            </Box>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                onClick={createNew}
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
