import { useSession } from "@toolpad/core";
import { IResource, useService } from "./_useService";

export interface Project extends IResource { }

export default function useProjectService() {

    const session = useSession();
    const service = useService<Project>("projects")

    async function getAllUserProjects(): Promise<Project[] | null> {
        if (session && session.user && session.user.id) {
            return service.getArray(`users/${session.user.id}/projects`)
        }
        return null
    }

    return { ...service, getAllUserProjects }
}