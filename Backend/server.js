import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js';
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json())

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders',orderRoutes);
app.get('/',(req,res)=>res.send("auth backend running"));
const PORT=process.env.PORT||5001;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,()=>console.log(`Server listening on PORT ${PORT}`))  
})
.catch(err=>{
    console.error("MongoDB connection error",err);
    process.exit(1);
})

