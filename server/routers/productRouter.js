import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import { isAuth, isAdmin } from '../utils.js'
import data from '../data.js';
import Product from '../models/productModels.js';
import {
  addProduct, addProductReview, deleteProduct,
  getCategories, getProduct, getProducts, updateProduct
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/',
  expressAsyncHandler(getProducts))

productRouter.get('/categories',
  expressAsyncHandler(getCategories));

productRouter.get('/seed', expressAsyncHandler(async (req, res) => {
  //await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  res.send({ createdProducts });
}))

productRouter.get('/:id',
  expressAsyncHandler(getProduct))

//deleting a product
productRouter.delete('/:id', isAuth, isAdmin,
  expressAsyncHandler(deleteProduct));

//updating a product
productRouter.put('/:id', isAuth,
  expressAsyncHandler(updateProduct));

//Adding a product goes below
productRouter.post('/', isAuth, isAdmin,
  expressAsyncHandler(addProduct));

productRouter.post('/:id/reviews', isAuth,
  expressAsyncHandler(addProductReview));

export default productRouter;