import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import {isAuth, isAdmin} from '../utils.js'
import data from '../data.js';
import Product from '../models/productModels.js';

const productRouter = express.Router();

productRouter.get(
    '/',
    expressAsyncHandler(async (req, res) =>{
    const products = await Product.find({});
    res.send({message:'Products fetched',products});
}))

productRouter.get('/seed', expressAsyncHandler(async (req, res) =>{
    //await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({createdProducts});
}))

productRouter.get('/:id',expressAsyncHandler(async  (req, res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        res.send(product);
    } else {
        res.status(404).send({message: 'Product not Found'})
    }
}))

//deleting a product
productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id);
      if (product) {
        const deletedProduct = await product.remove();
        res.send({ message: 'Product Deleted', product: deletedProduct });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
);

//updating a product
productRouter.put(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        const updatedProduct = await product.save();
        res.send({ message: 'Product Updated', product: updatedProduct });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
);

//Adding a product goes below
productRouter.post('/', isAuth, isAdmin,
    expressAsyncHandler(async (req, res) =>{
      const product = new Product({
        name: req.body.name || 'name',
        image: req.body.image || '/image/image.jpg' ,
        brand: req.body.brand || 'brand',
        category: req.body.category || 'category',
        description: req.body.description || 'description',
        price: req.body.price || 0,
        countInStock: req.body.countInStock || 0,
        rating: req.body.rating || 0,
        numReviews: req.body.numReviews || 0,
      })
      const createdProduct = await product.save(product);
      res.send({message:'Product created',product: createdProduct});
    })
);

export default productRouter;