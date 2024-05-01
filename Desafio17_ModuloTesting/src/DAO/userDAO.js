import User from "../db/models/user.js";

export async function getUserByEmail(email) {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error(`Error getting user from database: ${error}`);
    }
}

export async function createUser(userData) {
    try {
        return await User.create(userData);
    } catch (error) {
        throw new Error(`Error creating user in database: ${error}`);
    }
}