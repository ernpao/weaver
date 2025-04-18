import UserModel, { IUser } from '../models/user'; // Import model and interface
import bcrypt from 'bcryptjs'


export default class UserService {

    async createPasswordHash(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async create(email: string, password: string) {

        const user = new UserModel({
            email,
            password: await this.createPasswordHash(password)
        });

        const savedUser: IUser = await user.save();

        // Avoid sending password back, even if hashed
        const userResponse = savedUser.toObject();
        delete userResponse.password;
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email, deletedAt: null });
    }

    async getUser(uuid: string): Promise<IUser | null> {
        return await UserModel.findOne({ uuid, deletedAt: null });
    }

    async updateUser(uuid: string, email: string | null, password: string | null, username: string | null) {
        const user = await this.getUser(uuid)

        if (user) {

            if (email?.trim()) user.email = email;
            if (password?.trim()) user.password = await this.createPasswordHash(password)
            if (username?.trim()) user.username = username;

            await user.save();
        }

    }

    async deleteUser(uuid: string) {
        const user = await this.getUser(uuid)
        if (user) {
            user.deletedAt = new Date();
            user.save();
        }
    }

    async userWithEmailExists(email: string): Promise<boolean> {
        return (await this.getUserByEmail(email)) ? true : false;
    }

    async checkPassword(email: string, password: string): Promise<boolean> {

        const user = await UserModel.findOne({ email }).select('+password');

        if (user) {
            const storedPassword = user.password;
            return bcrypt.compareSync(password, storedPassword)
        }

        return false;
    }

}