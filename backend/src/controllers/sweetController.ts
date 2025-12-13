import { Request, Response, NextFunction } from 'express';
import { Sweet } from '../models/Sweet';

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Protected
export const getSweets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sweets = await Sweet.find({});
        res.json(sweets);
    } catch (error) {
        next(error);
    }
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Protected
export const searchSweets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;
        let query: any = {};

        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweet.find(query);
        res.json(sweets);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a sweet
// @route   POST /api/sweets
// @access  Protected
export const createSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, category, price, quantity } = req.body;
        const image = (req as any).file ? (req as any).file.path : undefined;

        const sweet = await Sweet.create({ name, category, price, quantity, image });
        res.status(201).json(sweet);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

// @desc    Update a sweet
// @route   PUT /api/sweets/:id
// @access  Protected
export const updateSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (sweet) {
            sweet.name = req.body.name || sweet.name;
            sweet.category = req.body.category || sweet.category;
            sweet.price = req.body.price || sweet.price;
            sweet.quantity = req.body.quantity !== undefined ? req.body.quantity : sweet.quantity;
            if ((req as any).file) {
                sweet.image = (req as any).file.path;
            }

            const updatedSweet = await sweet.save();
            res.json(updatedSweet);
        } else {
            res.status(404);
            throw new Error('Sweet not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a sweet
// @route   DELETE /api/sweets/:id
// @access  Admin
export const deleteSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (sweet) {
            await sweet.deleteOne(); // or findByIdAndDelete
            res.json({ message: 'Sweet removed' });
        } else {
            res.status(404);
            throw new Error('Sweet not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Purchase a sweet (decrease quantity)
// @route   POST /api/sweets/:id/purchase
// @access  Protected
export const purchaseSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quantity } = req.body;
        const sweet = await Sweet.findById(req.params.id);

        if (sweet) {
            if (sweet.quantity >= quantity) {
                sweet.quantity -= quantity;
                sweet.soldQuantity = (sweet.soldQuantity || 0) + quantity;
                const updatedSweet = await sweet.save();
                res.json({ message: 'Purchase successful', quantity: updatedSweet.quantity });
            } else {
                res.status(400);
                throw new Error('Not enough stock');
            }
        } else {
            res.status(404);
            throw new Error('Sweet not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Restock a sweet (increase quantity)
// @route   POST /api/sweets/:id/restock
// @access  Admin
export const restockSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quantity } = req.body;
        const sweet = await Sweet.findById(req.params.id);

        if (sweet) {
            sweet.quantity += quantity;
            const updatedSweet = await sweet.save();
            res.json({ message: 'Restock successful', quantity: updatedSweet.quantity });
        } else {
            res.status(404);
            throw new Error('Sweet not found');
        }
    } catch (error) {
        next(error);
    }
};
