const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    numMeals: {
        type: Number,
        required: true,
        default: 0
    },
    pot: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pot'
    },
    pickupTime: {
        type: Number,
        required: true
    },    
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'pending'      
    }
}, {
    timestamps: true
})

orderSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'order'
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
