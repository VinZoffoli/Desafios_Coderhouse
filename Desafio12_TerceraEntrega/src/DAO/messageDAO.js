import Message from "../db/models/message.js";

export async function getAllMessages() {
    try {
        return await Message.find();
    } catch (error) {
        throw new Error(`Error getting messages from database: ${error}`);
    }
}

export async function createMessage(messageData) {
    try {
        return await Message.create(messageData);
    } catch (error) {
        throw new Error(`Error creating message in database: ${error}`);
    }
}