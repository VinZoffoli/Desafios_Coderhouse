import { Router } from "express";
import { checkProductAuthorization } from '../middleware/productAuthorization.middleware.js';
import { checkProductOwner } from '../middleware/productOwner.middleware.js';
import { addProduct, createProduct, updateExistingProduct, updateProduct, removeProduct, deleteProduct, getProductById, getPaginatedProducts } from '../controllers/products.controller.js';

const router = Router();

router.get('/products', getPaginatedProducts);
router.get('/:pid', getProductById);
router.post('/', checkProductAuthorization, createProduct);
router.post('/', checkProductAuthorization, addProduct); 
router.put('/:pid', checkProductAuthorization, checkProductOwner, updateExistingProduct);
router.put('/:pid', checkProductAuthorization, checkProductOwner, updateProduct); 
router.delete('/:pid', checkProductAuthorization, checkProductOwner, removeProduct); 
router.delete('/:pid', checkProductAuthorization, checkProductOwner, deleteProduct);

export default router;