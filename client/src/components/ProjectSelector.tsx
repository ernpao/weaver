import { useEffect } from "react"
import useProjectsStore from "../hooks/store/useProjectsStore"
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Button, Skeleton, Stack } from "@mui/joy";
import useProjectService from "../hooks/services/useProjectsService";
import { useDialogs } from "@toolpad/core";
import CreateDialog from "./CreateDialog";
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProjectSelector() {

    const dialogs = useDialogs()
    const projectsService = useProjectService()
    const { activeProject, userProjects, setActiveProject, setUserProjects, } = useProjectsStore()

    const CREATE_NEW_PROJECT = "Create a new project..."

    const refreshDropdown = async () => {

        const projects = await projectsService.getAllUserProjects()

        if (!projects || projects.length === 0) {
            setUserProjects([])
            setActiveProject(null)
            return
        }

        // Sort most recent first
        projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setUserProjects(projects)
        setActiveProject(activeProject ?? projects[0])
    }

    useEffect(() => { refreshDropdown() }, [])

    async function handleChange(val: string) {
        if (val === CREATE_NEW_PROJECT) {
            const name = await dialogs.open(CreateDialog, "Project")
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
        <Select
            disabled={projectsService.loading}
            sx={{ width: "80%", mx: "auto" }}
            variant="plain"
            onChange={(e, v) => handleChange(v || CREATE_NEW_PROJECT)}
            value={activeProject?.uuid || ""}
        >
            {userProjects.map((p, i) => (
                <Option key={i} value={p.uuid}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        width="100%"
                        padding={1}
                    >
                        {p.name}
                        <Button
                            onClick={async () => {
                                await projectsService.remove(p.uuid)
                                await refreshDropdown()
                            }}
                        >
                            <DeleteIcon />
                        </Button>
                    </Stack>
                </Option>
            ))}
            <Option value="" sx={{ display: "none" }}>{CREATE_NEW_PROJECT}</Option>
            <Option value={CREATE_NEW_PROJECT}>{CREATE_NEW_PROJECT}</Option>
        </Select>
    )
}
