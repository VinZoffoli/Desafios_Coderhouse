import {UserModel} from './models/user.js'

class UserDAO {
    async getAll() {
        try {
            console.log('Conectado correctamente a DAO de usuarios');
            return await UserModel.find();
        } catch (error) {
            throw new Error(`Error getting users from database: ${error}`);
        }
    }

    async get(id) {
        try {
            console.log('Conectado correctamente a DAO de usuarios');
            return await UserModel.findById(id);
        } catch (error) {
            throw new Error(`Error getting user by ID from database: ${error}`);
        }
    }

    async create(user) {
        try {
            console.log('Conectado correctamente a DAO de usuarios');
            return await UserModel.create(user);
        } catch (error) {
            throw new Error(`Error creating user in database: ${error}`);
        }
    }

    async delete(id) {
        try {
            console.log('Conectado correctamente a DAO de usuarios');
            return await UserModel.deleteOne({ _id: id });
        } catch (error) {
            throw new Error(`Error deleting user by ID from database: ${error}`);
        }
    }
}

export default UserDAO;
