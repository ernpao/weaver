import { useDialogs } from "@toolpad/core/useDialogs";
import useProjectsStore from "../store/useProjectsStore";
import { IProjectResource, useService } from "./_useService";
import CreateDialog from "../../components/CreateDialog";
import { useEffect, useState } from "react";

export interface Character extends IProjectResource {
    role?: string;
}

export interface Event extends IProjectResource {
    timelinePosition?: number;
}

export interface Place extends IProjectResource {
    location?: string;
}

export default function useProjectResource<T extends IProjectResource>(resourcePath: string, resourceName: string) {

    const dialogs = useDialogs()
    const { activeProject } = useProjectsStore()
    const {
        loading,
        error,
        handleError,
        getAll,
        // getOne,
        create: put,
        update,
        remove,
    } = useService<T>(resourcePath)


    const [items, setItems] = useState<T[]>([])

    async function fetchItems() {

        try {
            if (activeProject) {
                const data = await getAll(activeProject.uuid)
                setItems(data ?? [])
            }
        } catch (error) {
            handleError(error)
        }

    }

    useEffect(() => { fetchItems(); }, [activeProject])

    // async function getAllInProject(): Promise<T[] | null> { return activeProject ? getAll(activeProject.uuid) : null };

    async function createNew(): Promise<T | null> {

        try {
            if (!activeProject) return null;

            const name = await dialogs.open(CreateDialog, resourceName)
            if (!name) return null;

            const newItem = await put(name, { projectUuid: activeProject.uuid })

            if (newItem) { await fetchItems(); }

            return newItem

        } catch (error) {
            handleError(error)
        }

        return null;

    }

    return { items, loading, error, createNew, update, remove }
}

export function useProjectCharacters() {
    const service = useProjectResource<Character>("characters", "Character");
    return { ...service }
}

export function useProjectEvents() {
    const service = useProjectResource<Event>("events", "Event");
    return { ...service }
}

export function useProjectPlaces() {
    const service = useProjectResource<Place>("places", "Place");
    return { ...service }
}