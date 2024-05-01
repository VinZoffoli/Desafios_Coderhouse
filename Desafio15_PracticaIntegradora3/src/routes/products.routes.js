import { Router } from "express";
import { checkProductAuthorization } from '../middleware/productAuthorization.middleware.js';
import { checkProductOwner } from '../middleware/productOwner.middleware.js';
import { addProduct } from '../controllers/products.controller.js';
import { createProduct } from '../controllers/products.controller.js';
import { updateExistingProduct } from '../controllers/products.controller.js';
import { updateProduct } from '../controllers/products.controller.js';
import { removeProduct } from '../controllers/products.controller.js';
import { deleteProduct } from '../controllers/products.controller.js';
import { getProductById } from '../controllers/products.controller.js';
import { getPaginatedProducts } from '../controllers/products.controller.js';

const router = Router();

router.get('/products', getPaginatedProducts);
router.get('/:pid', getProductById);
router.post('/', checkProductAuthorization, createProduct);
router.post('/', checkProductAuthorization, addProduct); 
router.put('/:pid', checkProductAuthorization, checkProductOwner, updateExistingProduct);
router.put('/:pid', checkProductAuthorization, checkProductOwner, updateProduct); // Usa la función updateProduct como controlador de la ruta PUT '/:pid'
router.delete('/:pid', checkProductAuthorization, checkProductOwner, removeProduct); // Utiliza la función removeProduct como controlador para la ruta DELETE '/:pid'
router.delete('/:pid', checkProductAuthorization, checkProductOwner, deleteProduct); // Usa la función deleteProduct como controlador de la ruta DELETE '/:pid'

export default router;