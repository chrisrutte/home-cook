const mongoose = require('mongoose')

const potSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mealCount: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Pot = mongoose.model('Pot', potSchema)

module.exports = Pot

// potSchema.virtual('orders', {
//     ref: 'Order',
//     localField: '_id',
//     foreignField: 'pot'
// })

// address
// price
// date
// pick up start
// pick up end