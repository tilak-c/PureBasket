import express from 'express';
import {
  createOrder,
  createOrderFromCart,
  getOrderById,
  getOrdersByUser,
  listOrders,
  updateOrderStatus
} from '../controllers/ordersController.js';

const router = express.Router();

router.post('/', createOrder);
router.post('/:userId/create-from-cart', createOrderFromCart);
router.get('/:id', getOrderById);
router.get('/user/:userId', getOrdersByUser);
router.get('/', listOrders);
router.put('/:id/status', updateOrderStatus);
export default router;
