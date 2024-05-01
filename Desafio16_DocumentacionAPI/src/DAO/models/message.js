import mongoose from "mongoose";

const collectionName = 'messages';

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
});

export const MODEL_MESSAGES = mongoose.model(collectionName, messageSchema);