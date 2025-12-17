import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  cartTotal
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCart);
router.get('/:userId/total', cartTotal);
router.post('/:userId/add', addItem);
router.put('/:userId/update', updateItem);
router.delete('/:userId/remove/:itemId', removeItem);
router.delete('/:userId/clear', clearCart);

export default router;