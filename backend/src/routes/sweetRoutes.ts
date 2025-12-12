import { Router } from 'express';
import { getSweets, createSweet, searchSweets, updateSweet, deleteSweet, purchaseSweet, restockSweet } from '../controllers/sweetController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
    .get(protect, getSweets)
    .post(protect, createSweet);

router.get('/search', protect, searchSweets);

router.route('/:id')
    .put(protect, updateSweet)
    .delete(protect, admin, deleteSweet);

router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, admin, restockSweet);

export default router;
