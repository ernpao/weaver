import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project } from '../services/useProjectsService'

interface ProjectsStore {
    activeProject: Project | null;
    userProjects: Project[];
    setActiveProject: (project: Project | null) => void;
    setUserProjects: (projects: Project[]) => void;
}

const useProjectsStore = create<ProjectsStore>()(
    persist(
        (set) => ({
            activeProject: null,
            userProjects: [],
            setActiveProject: function (project) {
                console.log("Setting active project: ", project);
                set({ activeProject: project })
            },
            setUserProjects: (projects) => set({ userProjects: projects }),
        }),
        {
            name: 'projects-storage', // key in localStorage
            partialize: (state) => ({ activeProject: state.activeProject }), // only persist activeProject
        }
    )
)

export default useProjectsStore;