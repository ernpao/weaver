
import { AuthenticatedUser } from '../../src/types/user';

export { };

declare global {
    namespace Express {
        export interface Request {
            user?: AuthenticatedUser;
            uuid?: string,
            projectUuid?: string,
        }
    }
}


