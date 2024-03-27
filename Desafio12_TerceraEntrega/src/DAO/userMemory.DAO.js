class UserMemoryDAO {
    constructor() {
        this.users = [];
    }

    async getAll() {
        try {
            console.log('Conectado correctamente a DAO de usuarios en memoria');
            return this.users;
        } catch (error) {
            throw new Error(`Error getting users from memory: ${error}`);
        }
    }

    async get(id) {
        try {
            console.log('Conectado correctamente a DAO de usuarios en memoria');
            return this.users.find(user => user.id === id);
        } catch (error) {
            throw new Error(`Error getting user by ID from memory: ${error}`);
        }
    }

    async create(user) {
        try {
            console.log('Conectado correctamente a DAO de usuarios en memoria');
            this.users.push(user);
            return user;
        } catch (error) {
            throw new Error(`Error creating user in memory: ${error}`);
        }
    }

    async delete(id) {
        try {
            console.log('Conectado correctamente a DAO de usuarios en memoria');
            this.users = this.users.filter(user => user.id !== id);
        } catch (error) {
            throw new Error(`Error deleting user by ID from memory: ${error}`);
        }
    }
}

export default UserMemoryDAO;
