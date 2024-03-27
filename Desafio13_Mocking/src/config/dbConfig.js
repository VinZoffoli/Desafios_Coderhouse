import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://vinzoffoli:ObSRyT2RTBIqqkKo@cluster0.eboydle.mongodb.net/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Conectado con éxito a MongoDB usando Mongoose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Mongoose: " + error);
        process.exit(1);
    }
};

export default connectMongoDB;
