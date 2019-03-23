const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    mealCount: {
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
        required: true,
        ref: 'Pot'
    },    
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

// mealCount
// pickupTime
