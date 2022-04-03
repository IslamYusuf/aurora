import express from 'express';
import expressAsyncHandler from 'express-async-handler'

import data from '../data.js';
import User from '../models/userModel.js';
import { isAuth, isAdmin } from '../utils.js';
import {
    deleteUser, getAllUsers, getUser, signin,
    signout, signup, updateAdminProfile,
    updateUserProfile
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/seed',
    expressAsyncHandler(async (req, res) => {
        //await User.remove({});
        const createdUsers = await User.insertMany(data.users);
        res.send({ createdUsers });
    })
)

userRouter.post('/signin',
    expressAsyncHandler(signin))

userRouter.post('/signout',
    expressAsyncHandler(signout))

userRouter.post('/signup',
    expressAsyncHandler(signup))

userRouter.get('/:id', expressAsyncHandler(getUser))

userRouter.put('/profile', isAuth,
    expressAsyncHandler(updateUserProfile))

userRouter.get('/', isAuth, isAdmin,
    expressAsyncHandler(getAllUsers));

userRouter.delete('/:id', isAuth, isAdmin,
    expressAsyncHandler(deleteUser));

userRouter.put('/:id', isAuth, isAdmin,
    expressAsyncHandler(updateAdminProfile));

export default userRouter;