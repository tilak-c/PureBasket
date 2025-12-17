import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'created' }
}, { timestamps: true }); 

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
