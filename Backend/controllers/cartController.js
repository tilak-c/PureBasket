import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

async function ensureCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}
  
export async function getCart(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid userId' });

    const cart = await ensureCart(userId);
    return res.json(cart);
  } catch (err) {
    console.error('getCart error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function addItem(req, res) {
  try {
    const { userId } = req.params;
    const { productId, name, price, imageUrl, quantity = 1 } = req.body;

    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid userId' });

    const qty = Number(quantity) || 1;
    if (qty <= 0) return res.status(400).json({ message: 'Quantity must be >= 1' });

    const cart = await ensureCart(userId);

    let snapshot = null;
    if (productId) {
      if (!mongoose.isValidObjectId(productId)) return res.status(400).json({ message: 'Invalid productId' });
      const prod = await Product.findById(productId).lean();
      if (!prod) return res.status(404).json({ message: 'Product not found' });
      snapshot = {
        product: prod._id,
        name: prod.name,
        imageUrl: prod.imageUrl,
        price: prod.price
      };
    } else {
      if (!name || price == null || !imageUrl) {
        return res.status(400).json({ message: 'Provide productId or name, price, imageUrl' });
      }
      snapshot = { product: null, name, imageUrl, price };
    }

    let existingIndex = -1;
    if (snapshot.product) {
      existingIndex = cart.items.findIndex(it => it.product && it.product.toString() === snapshot.product.toString());
    } else {
      existingIndex = cart.items.findIndex(it => (!it.product) && it.name === snapshot.name && it.price === snapshot.price && it.imageUrl === snapshot.imageUrl);
    }

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity = (cart.items[existingIndex].quantity || 0) + qty;
    } else {
      cart.items.push({
        product: snapshot.product,
        name: snapshot.name,
        imageUrl: snapshot.imageUrl,
        price: snapshot.price,
        quantity: qty
      });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error('addItem error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function updateItem(req, res) {
  try {
    const { userId } = req.params;
    const { itemId, quantity, name, price, imageUrl } = req.body;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid userId' });

    if (!itemId) return res.status(400).json({ message: 'itemId is required' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex(it => it._id.toString() === itemId);
    if (idx < 0) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity != null) {
      const q = Number(quantity);
      if (Number.isNaN(q) || q < 0) return res.status(400).json({ message: 'Invalid quantity' });
      if (q === 0) {
        cart.items.splice(idx, 1);
      } else {
        cart.items[idx].quantity = q;
      }
    }

    if (typeof name === 'string') cart.items[idx].name = name;
    if (price != null) cart.items[idx].price = price;
    if (typeof imageUrl === 'string') cart.items[idx].imageUrl = imageUrl;

    await cart.save();
    return res.json(cart);
  } catch (err) {
    console.error('updateItem error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function removeItem(req, res) {
  try {
    const { userId, itemId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid userId' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex(it => it._id.toString() === itemId);
    if (idx < 0) return res.status(404).json({ message: 'Item not found in cart' });

    cart.items.splice(idx, 1);
    await cart.save();
    return res.json(cart);
  } catch (err) {
    console.error('removeItem error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function clearCart(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid userId' });
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    return res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    console.error('clearCart error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function cartTotal(req, res) {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId }).lean();
    if (!cart) return res.json({ total: 0, totalItems: 0 });

    const total = cart.items.reduce(
      (acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 0)),
      0
    );

    const totalItems = cart.items.reduce(
      (acc, it) => acc + Number(it.quantity || 0),
      0
    );

    return res.json({ total, totalItems });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}


//search the items
//close the browser all the items are gone ->store it for some days
//Rating system ->on brands as well
//adding brands
//order history
//fav items 
//comment system
//recommend using chat system like chatting application(share the products among each other)->Web socket
//site for seller and site for admin can control both seller and customer sites ->delete etc
//notification using toast
//ifa. user fav shop if that shop seller added any item the user can get a notification that seller has 
// added item and you can purchase it
//recommendation system 
//edit profile -can update password etc
