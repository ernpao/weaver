import * as React from 'react';
import Typography from '@mui/material/Typography';
import useProjectsStore from '../hooks/store/useProjectsStore';

export default function Dashboard() {

    const { activeProject } = useProjectsStore()

    return (
        <>
            {activeProject? activeProject.name:"You don't have any projects!"}
        </>
    );
}