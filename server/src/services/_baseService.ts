import { Model } from "mongoose";
import { IResourceDocument, IProjectResourceDocument } from "../models/_baseDocument";
import ProjectService from "./projectService";

export abstract class BaseService<T extends IResourceDocument> {

    #model: Model<T>;
    ownerUuid: string;
    #queryParams: any;

    constructor(ownerUuid: string, model: Model<T>, queryParams?: any) {
        this.#model = model;
        this.ownerUuid = ownerUuid;
        this.#queryParams = { ownerUuid }

        if (queryParams) {
            this.#queryParams = { ...queryParams, ownerUuid }
        }
    }


    protected async _create(params: any): Promise<T> {

        const newDoc = new this.#model({ ...this.#queryParams, ...params });
        const savedDoc: T = await newDoc.save();

        return savedDoc;
    }


    /**
     * Fetch a document with the given UUID.
     *
     * @param uuid - UUID of the document.
    */
    async get(uuid: string): Promise<T | null> {
        return await this.#model.findOne({ ...this.#queryParams, uuid, deletedAt: null })
    }


    /**
     * Fetch all of the owner's documents of type T.
     *
    */
    async getAll(params?: any): Promise<T[]> {
        let filter = { ...this.#queryParams, deletedAt: null }

        if (params) {
            filter = { ...filter, ...params }
        }

        return await this.#model.find(filter)
    }


    /**
     * Fetch a document that has been deleted.
     *
     * @param uuid - UUID of the document.
    */
    async getDeleted(uuid: string): Promise<T | null> {
        return await this.#model.findOne({ ...this.#queryParams, uuid, deletedAt: { $ne: null } })
    }


    /**
     * Check if a document with the given UUID exists (and is not deleted).
     *
     * @param uuid - UUID of the document.
    */
    async exists(uuid: string): Promise<boolean> {
        const doc = await this.get(uuid);
        return doc ? true : false;
    }


    /**
     * Fetch a document with the given UUID.
     *
     * @param uuid - UUID of the document.
     * @param params - object containing fields/values to be modified.
    */
    protected async _update(uuid: string, params: any): Promise<T | null> {
        console.log("Updating resource: ", uuid)

        const doc = await this.get(uuid);
        console.log("Updating doc: ", doc)
        let docUpdated = false;

        console.log("Update params: ", params)

        if (doc != null) {

            for (const key in params) {
                // Use hasOwnProperty to ensure it's a direct property of params, not from prototype
                if (Object.prototype.hasOwnProperty.call(params, key)) {
                    // Check if the value is actually different to potentially avoid unnecessary Mongoose change tracking
                    // Note: Deep equality check might be needed for nested objects/arrays if precision is critical here,
                    // but Mongoose's save() will handle final change detection anyway.
                    if (doc[key as keyof T] !== params[key as keyof T]) {
                        // console.debug(`Applying update for key "${key}"`);
                        // Type assertion might still be needed if T is very generic,
                        // but Partial<T> significantly improves safety.
                        // Assign the value from params to the corresponding key on the document.
                        (doc as any)[key] = params[key as keyof T];
                        docUpdated = true; // Mark that we've potentially made a change
                    }
                }
            }

            if (docUpdated) {
                doc.updatedAt = new Date();
                await doc.save()
            }

        }

        return doc;

    }


    /**
     * Delete the document with the given UUID.
     *
     * @param uuid - UUID of the document.
    */
    async delete(uuid: string) {

        const doc = await this.get(uuid);

        if (doc) {
            doc.deletedAt = new Date();
            await doc.save()
        }

    }


    /**
     * Restore a deleted document with the given UUID.
     *
     * @param uuid - UUID of the document.
    */
    async restore(uuid: string) {

        const doc = await this.getDeleted(uuid);

        if (doc) {
            doc.deletedAt = null;
            await doc.save()
        }

    }


    async addTag(uuid: string, tag: string) {

        const doc = await this.get(uuid);

        if (doc) {
            if (!doc.tags.includes(tag)) {
                doc.tags.push(tag);
                doc.updatedAt = new Date();
                await doc.save()
            }
        }
    }


    async removeTag(uuid: string, tag: string) {

        const doc = await this.get(uuid);

        if (doc) {
            doc.tags = doc.tags.filter((t: string) => t !== tag);
            doc.updatedAt = new Date();
            await doc.save()
        }
    }


    async setTags(uuid: string, tags: string[]) {
        const doc = await this.get(uuid);

        if (doc) {
            doc.tags = tags;
            doc.updatedAt = new Date();
            await doc.save;
        }

    }


    async clearTags(uuid: string) {
        const doc = await this.get(uuid);

        if (doc) {
            doc.tags = [];
            doc.updatedAt = new Date();
            await doc.save;
        }

    }

}

export abstract class BaseProjectResourceService<T extends IProjectResourceDocument> extends BaseService<T>{

    async create(projectUuid: string, name: string): Promise<T | null> {

        const service = new ProjectService(this.ownerUuid);

        if (await (service.exists(projectUuid))) {
            return await this._create({ name, projectUuid })
        } else {
            return null;
        }

    }

}
