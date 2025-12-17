import Product from '../models/Product.js'

export async function createProduct(req,res){
    try{
        const {name,price,imageUrl}=req.body;
        if(!name||price==null||!imageUrl){
            return res.json({message:"Name,price and imageUrl is required"});
        }
        const p=await Product.create({name,price,imageUrl});

        return res.status(201).json(p);
    }catch (err) {
    console.error('createProduct error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function getProducts(req, res) {
     try {
        const products = await Product.find();
    return res.json(products);
  } catch (err) {
    console.error('getProducts error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params; 
    const p = await Product.findById(id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    return res.json(p);
  } catch (err) {
    console.error('getProductById error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price, imageUrl } = req.body;
    const update = {};
    if (typeof name === 'string') update.name = name;
    if (price != null) update.price = price;
    if (typeof imageUrl === 'string') update.imageUrl = imageUrl;

    const p = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!p) return res.status(404).json({ message: 'Product not found' });
    return res.json(p);
  } catch (err) {
    console.error('updateProduct error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const p = await Product.findByIdAndDelete(id).lean();
    if (!p) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted', product: p });
  } catch (err) {
    console.error('deleteProduct error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}