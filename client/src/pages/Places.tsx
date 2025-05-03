import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useProjectPlaces } from '../hooks/services/useProjectResource';

export default function Places() {
    const { items, loading, error, create, update, remove } = useProjectPlaces();
    return <Typography>Places Page</Typography>;
}