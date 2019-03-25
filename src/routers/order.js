const express = require('express')
const Order = require('../models/order')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/orders/:id', auth, async (req, res) => {
    const order = new Order({
        ...req.body,
        pot: req.params.id,
        owner: req.user._id
    })

    console.log(order)

    try {
        await order.save()
        res.status(201).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/orders/me', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'pots',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.pots)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/orders/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const order = await Order.findOne({ _id })

        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

// router.delete('/order/:id', auth, async (req, res) => {
//     try {
//         const order = await Order.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

//         if (!pot) {
//             res.status(404).send()
//         }

//         res.send(pot)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router