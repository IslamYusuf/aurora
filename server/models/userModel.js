import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false, required: true},
    cartItems: {type:Array, default:[], required:true},
    stripeInfo:{
        hasStripeAccount:{type: Boolean, default: false, required: true},
        customerId: String,
    },
},{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;