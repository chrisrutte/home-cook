const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    result: {
        type: String,
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },    
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    }
}, {
    timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
