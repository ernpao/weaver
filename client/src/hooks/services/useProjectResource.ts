import { useDialogs } from "@toolpad/core/useDialogs";
import useProjectsStore from "../store/useProjectsStore";
import { IProjectResource, useService } from "./_useService";
import DialogCreate from "../../components/DialogCreate";
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
        create: _create,
        update: _update,
        remove: _remove,
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


    async function create(): Promise<T | null> {

        try {
            if (!activeProject) return null;

            const name = await dialogs.open(DialogCreate, resourceName)
            if (!name) return null;

            const newItem = await _create(name, { projectUuid: activeProject.uuid })

            if (newItem) { await fetchItems(); }

            return newItem

        } catch (error) {
            handleError(error)
        }

        return null;

    }

    async function update(resourceUuid: string, asyncParams: Promise<Partial<T> | null>): Promise<T | null> {

        try {

            const updatedFields = await asyncParams;
            if (!updatedFields) return null;

            const updatedResource = await _update(resourceUuid, updatedFields);
            if (updatedResource) { await fetchItems(); }

            return updatedResource;

        } catch (error) {
            handleError(error);
        }

        return null;
    }

    async function remove(resourceUuid: string, asyncConfirmation: Promise<boolean>): Promise<boolean> {

        const confirmation = await asyncConfirmation;

        if (confirmation) {
            try {
                const success = await _remove(resourceUuid)
                if (success) { await fetchItems(); }
                return success;
            } catch (error) {
                handleError(error)
            }
        }
        return false;
    }


    return { items, loading, error, create, remove, update };
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