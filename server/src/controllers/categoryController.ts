import { Request, Response } from 'express';
import { CategoryModel } from '../models/CategoryModel';
import { Category } from '../models/Category';

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await CategoryModel.create({
      name,
      description,
      image_url
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const { name, description, image_url } = req.body;
    const category = await CategoryModel.update(id, {
      name,
      description,
      image_url
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const deleted = await CategoryModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};