import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';

dotenv.config();

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/aurora', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
}).catch(err => console.log(err))

const port = process.env.PORT || 5000;

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/uploads', uploadRouter);
app.get('/', (req, res) =>{
    res.send('Server is running')
})

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use((err, req, res, next) =>{
    res.status(500).send({message: err.message});
})

app.listen(port, () =>{
    console.log(`Server is running at http://localhost:${port}`);
})