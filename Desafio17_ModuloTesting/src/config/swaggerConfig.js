import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Productos y Carrito',
            version: '1.0.0',
            description: 'Documentación de la API de Productos y Carrito',
        },
    },
    apis: ['../controllers/products.controller.js', '../controllers/cart.controller.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerDocs, swaggerUi };