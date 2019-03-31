const express = require('express')
const Transaction = require('../models/transaction')
const Order = require('../models/order')
// const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/transactions', async (req, res) => {

    const transaction = new Transaction({
        result: req.body.result,
        order: req.body.order
    })

    const order = await Order.findOne({ _id: transaction.order })

    if (transaction.result === '000.000.000') {
        order.paymentStatus = 'paid'
    } else if (transaction.result === '000.200.000') {
        // do nothing
    } else { 
        if (order.paymentStatus === 'paid') {

        } else { order.paymentStatus = 'failed' }
    }

    
    try {
        await transaction.save()
        await order.save()
        res.status(201).send(transaction)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router