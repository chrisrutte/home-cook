const mongoose = require('mongoose')

const potSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    maxMeals: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        required: false
    },
    orderDeadline: {
        type: Number,
        required: true
    },
    pickupDeadline: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

potSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'pot'
})

const Pot = mongoose.model('Pot', potSchema)

module.exports = Pot

// address
// price
// date
// pickupStart
// pickupEnd
// active
// lastOrder

