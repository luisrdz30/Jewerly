import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.ts = Router();

/from '../controllers/productController';

const router = Router();

// Get all products
router.get('/', getProducts);

// Get product by ID
router.get('/:id', getProductById);

// Get products by category
router.get('/category/:categoryId', getProductsByCategory);

// Get featured products
router.get('/featured/:limit?', getFeaturedProducts);

// Search products
router.get('/search/:query', searchProducts);

// Create new product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router;