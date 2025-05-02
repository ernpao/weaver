import { useState } from "react";

const API_SERVER = process.env.REACT_APP_API_SERVER_URL;
const API_VERSION = process.env.REACT_APP_API_VERSION;
const API_BASE_URL = `${API_SERVER}/api/${API_VERSION}`;

const defaultRequestParams: Partial<RequestInit> = {
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
};

export interface APIResponse<T> {
    success?: boolean;
    error?: any;
    message?: string;
    data?: T;
}

export class APIError extends Error {
    status: number;
    response: any;

    constructor(message: string, status: number, response: any) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.response = response;
    }
}

async function handleResponse<T>(res: Response): Promise<APIResponse<T>> {
    let json: APIResponse<T>;

    try {
        json = await res.json();
    } catch (err) {
        throw new APIError('Invalid JSON response', res.status, null);
    }

    if (!res.ok || res.status !== 200) {
        const message = json.message || res.statusText || 'API error';
        throw new APIError(message, res.status, json);
    }

    return json;
}

async function APIPost<T>(requestPath: string, requestBody?: any): Promise<APIResponse<T>> {
    const res = await fetch(`${API_BASE_URL}${requestPath}`, {
        ...defaultRequestParams,
        method: 'POST',
        body: JSON.stringify(requestBody),
    });

    return handleResponse<T>(res);
}

async function APIGet<T>(requestPath: string): Promise<APIResponse<T>> {
    const res = await fetch(`${API_BASE_URL}${requestPath}`, {
        ...defaultRequestParams,
    });

    return handleResponse<T>(res);
}

async function APIPut<T>(requestPath: string, requestBody?: any): Promise<APIResponse<T>> {
    const res = await fetch(`${API_BASE_URL}${requestPath}`, {
        ...defaultRequestParams,
        method: 'PUT',
        body: JSON.stringify(requestBody),
    });

    return handleResponse<T>(res);
}

async function APIDelete<T>(requestPath: string): Promise<APIResponse<T>> {
    const res = await fetch(`${API_BASE_URL}${requestPath}`, {
        ...defaultRequestParams,
        method: 'DELETE',
    });

    return handleResponse<T>(res);
}

export interface IResource {
    uuid: string;
    ownerUuid: string;
    name: string;
    description?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface IProjectResource extends IResource {
    projectUuid: string;
};

function createCRUDService<T extends IResource>(resourcePath: string) {
    return {

        get(requestPath: string): Promise<APIResponse<T>> {
            return APIGet<T>(`/${requestPath}`);
        },

        getArray(requestPath: string): Promise<APIResponse<T[]>> {
            return APIGet<T[]>(`/${requestPath}`);
        },

        getAll(projectUuid: string): Promise<APIResponse<T[]>> {
            return APIGet<T[]>(`/projects/${projectUuid}/${resourcePath}/`);
        },

        getOne(uuid: string): Promise<APIResponse<T>> {
            return APIGet<T>(`/${resourcePath}/${uuid}`);
        },

        create(name: string, data?: Partial<T>): Promise<APIResponse<T>> {
            return APIPut<T>(`/${resourcePath}/`, { ...data, name });
        },

        update(uuid: string, data: Partial<T>): Promise<APIResponse<T>> {
            return APIPost<T>(`/${resourcePath}/${uuid}`, data);
        },

        delete(uuid: string): Promise<APIResponse<null>> {
            return APIDelete<null>(`/${resourcePath}/${uuid}`);
        },
    };
}

export function useService<T extends IResource>(resourcePath: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const service = createCRUDService<T>(resourcePath);

    async function getAll(projectUuid: string): Promise<T[] | null> {
        return handleRequest(() => service.getAll(projectUuid));
    }

    async function getOne(uuid: string): Promise<T | null> {
        return handleRequest(() => service.getOne(uuid));
    }

    async function get(requestPath: string): Promise<T | null> {
        return handleRequest(() => service.get(requestPath));
    }

    async function getArray(requestPath: string): Promise<T[] | null> {
        return handleRequest(() => service.getArray(requestPath));
    }

    async function create(name: string, data?: any | T): Promise<T | null> {
        return handleRequest(() => service.create(name, data));
    }

    async function update(uuid: string, data: Partial<T>): Promise<T | null> {
        return handleRequest(() => service.update(uuid, data));
    }

    async function remove(uuid: string): Promise<boolean> {
        setLoading(true);
        setError(null);
        try {
            await service.delete(uuid);
            return true;
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function handleRequest<R>(reqFn: () => Promise<APIResponse<R>>): Promise<R | null> {
        setLoading(true);
        setError(null);
        try {
            const res = await reqFn();
            return res.data ?? null;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }

    function handleError(err: unknown) {
        if (err instanceof APIError) {
            setError(err.message);
            console.error("APIError", err.status, err.response);
        } else {
            setError("Unexpected error");
            console.error("Unknown error", err);
        }
    }

    return {
        loading,
        error,
        handleError,
        getAll,
        getOne,
        get,
        getArray,
        create,
        update,
        remove,
    };
}