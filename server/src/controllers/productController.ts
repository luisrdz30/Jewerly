import { Request, Response } from 'express';
import { ProductModel } from '../models/ProductModel';
import { Product } from '../models/Product';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await ProductModel.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      material,
      weight_grams,
      dimensions_cm,
      image_url,
      category_id,
      is_featured,
      in_stock,
      sku
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    const product = await ProductModel.create({
      name,
      description,
      price,
      material,
      weight_grams,
      dimensions_cm,
      image_url,
      category_id,
      is_featured,
      in_stock,
      sku
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const {
      name,
      description,
      price,
      material,
      weight_grams,
      dimensions_cm,
      image_url,
      category_id,
      is_featured,
      in_stock,
      sku
    } = req.body;

    const product = await ProductModel.update(id, {
      name,
      description,
      price,
      material,
      weight_grams,
      dimensions_cm,
      image_url,
      category_id,
      is_featured,
      in_stock,
      sku
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const deleted = await ProductModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const products = await ProductModel.findByCategory(categoryId);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const products = await ProductModel.findFeatured(limit);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const query = req.params.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const products = await ProductModel.search(query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};