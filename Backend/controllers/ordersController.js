import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export async function createOrder(req, res) {
  try {
    const { user, items } = req.body;
    if (!user || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'user and items array are required' });
    }
    if (!mongoose.isValidObjectId(user)) return res.status(400).json({ message: 'Invalid user id' });

    for (const it of items) {
      if (!it.name || it.price == null || !it.imageUrl || !it.quantity) {
        return res.status(400).json({ message: 'Each item must have name, price, imageUrl and quantity' });
      }
    }

    const totalPrice = items.reduce((acc, it) => acc + (Number(it.price) * Number(it.quantity)), 0);

    const order = await Order.create({
      user,
      items,
      totalPrice,
      status: 'created'
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error('createOrder error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function createOrderFromCart(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid userId' });

    const cart = await Cart.findOne({ user: userId }).lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    const items = cart.items.map(it => ({
      name: it.name,
      price: it.price,
      imageUrl: it.imageUrl,
      quantity: it.quantity
    }));

    const totalPrice = items.reduce((acc, it) => acc + (Number(it.price) * Number(it.quantity)), 0);

    const order = await Order.create({
      user: userId,
      items,
      totalPrice,
      status: 'created'
    });

    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    return res.status(201).json(order);
  } catch (err) {
    console.error('createOrderFromCart error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid order id' });

    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error('getOrderById error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function getOrdersByUser(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid userId' });

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (err) {
    console.error('getOrdersByUser error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function listOrders(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (err) {
    console.error('listOrders error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid order id' });
    if (!status) return res.status(400).json({ message: 'status is required' });

    const allowed = ['created', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error('updateOrderStatus error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
