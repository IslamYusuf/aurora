import bcrypt from 'bcryptjs'

import User from '../models/userModel.js';
import { generateToken } from '../utils.js';

export const signin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                cartItems: user.cartItems,
                token: generateToken(user),
            });
            return;
        }
    }
    res.status(401).send({ message: 'Invalid email or password' })
}

export const signout = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        user.cartItems = req.body.cartItems;
        const { cartItmes } = await user.save();
        res.send({ cartItmes })
    }
}

export const signup = async (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    const createdUser = await user.save();
    res.send({
        _id: createdUser._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
    });
}

export const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) res.send(user)
    else {
        res.status(404).send({ message: 'User Not Found' })
    }
}

export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.firstName = req.body.firstName || user.firstName
        user.lastName = req.body.lastName || user.lastName
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser),
        })
    }
}

export const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.send(users);
}

export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if ((user.email === 'admin@example.com') || user.isAdmin) {
            res.status(400).send({ message: 'Can Not Delete Admin User' });
            return;
        }
        const deletedUser = await user.remove();
        res.send({ message: 'User Deleted', user: deletedUser });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}

export const updateAdminProfile = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();
        res.send({ message: 'User Updated', user: updatedUser });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}
