// models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false 
  },
  name: { type: String },
  imageUrl: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
}, { _id: true, id: false });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;
