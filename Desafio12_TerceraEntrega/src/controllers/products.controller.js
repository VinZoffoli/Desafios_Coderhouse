import productRepository from '../Repository/index.js';

export const getProducts = async (req, res) => {
    try {
        const products = await productRepository.getItems();
        res.send(products);
    } catch (error) {
        res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
};