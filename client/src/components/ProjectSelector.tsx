import { useEffect } from "react";
import useProjectsStore from "../hooks/store/useProjectsStore";
import {
    Button,
    Skeleton,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import useProjectService from "../hooks/services/useProjectsService";
import { useDialogs } from "@toolpad/core";
import DialogCreate from "./DialogCreate";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogDeleteConfirmation from "./DialogDeleteConfirmation";

export default function ProjectSelector() {

    const dialogs = useDialogs()
    const projectsService = useProjectService()
    const { activeProject, userProjects, setActiveProject, setUserProjects, } = useProjectsStore()

    const CREATE_NEW_PROJECT = "Create a new project..."

    const refreshDropdown = async () => {
        console.log("Refreshing projects dropdown...")
        const projects = await projectsService.getAllUserProjects()

        if (!projects || projects.length === 0) {
            setUserProjects([])
            setActiveProject(null)
            return
        }

        // Sort most recent first
        projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setUserProjects(projects)

        const projectUuids = projects.map(p => p.uuid)
        const dropdownSelectedProject = projectUuids.includes(activeProject?.uuid || '*') ? activeProject : projects[0]

        setActiveProject(dropdownSelectedProject)
    }

    useEffect(() => { refreshDropdown() }, [])

    async function handleChange(event: any) {
        const val = event.target.value || CREATE_NEW_PROJECT;
        if (val === CREATE_NEW_PROJECT) {
            const name = await dialogs.open(DialogCreate, "Project")
            if (name) {
                try {
                    const newProject = await projectsService.create(name)

                    if (newProject) {
                        await refreshDropdown()
                        setActiveProject(newProject)
                    }
                } catch (err) {
                    console.error("Error creating project:", err)
                }
            }
        } else {
            const selected = userProjects.find((p) => p.uuid === val)
            if (selected) {
                setActiveProject(selected)
            }
        }
    }

    return projectsService.loading ? (
        <Skeleton variant="rectangular" height={40} width="80%" sx={{ mx: "auto" }} />
    ) : (
        <FormControl fullWidth sx={{ width: "80%", mx: "auto" }}>
            {/* <InputLabel id="project-selector-label">Select Project</InputLabel> */}
            <Select
                labelId="project-selector-label"
                value={activeProject?.uuid || ""}
                onChange={handleChange}
                // label="Select Project"
                inputProps={{ 'aria-label': 'Without label' }}

            >
                {userProjects.map((p, i) => (
                    <MenuItem key={i} value={p.uuid}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                            gap={2}
                        >
                            {p.name}
                            <Button
                                size="small"
                                color="error"
                                onClick={async (e) => {
                                    e.stopPropagation();

                                    const confirmation = await dialogs.open(DialogDeleteConfirmation, `Are you sure you want to delete "${p.name}?"`)

                                    if (confirmation) {

                                        await projectsService.remove(p.uuid);
                                        await refreshDropdown();

                                    }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                        </Stack>
                    </MenuItem>
                ))}
                <MenuItem sx={{ display: "none" }} value="">{CREATE_NEW_PROJECT}</MenuItem>
                <MenuItem value={CREATE_NEW_PROJECT}>{CREATE_NEW_PROJECT}</MenuItem>
            </Select>
        </FormControl>
    );
}
