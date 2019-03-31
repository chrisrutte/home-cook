const express = require('express')
const Order = require('../models/order')
const Pot = require('../models/pot')
const auth = require('../middleware/auth')
const router = new express.Router()
const moment = require('moment')

const calcAvailableMeals = require('../lib/calcAvailableMeals')

router.post('/orders/:id', auth, async (req, res) => {
    console.log(req.params.id)
    const pickupTime = new Date(req.body.pickupDate).setHours(req.body.pickupHour)

    const order = new Order({
        numMeals: req.body.numMeals,
        pickupTime,
        pot: req.params.id,
        customer: req.user._id,
        paymentStatus: 'pending'
    })

    await order.populate('pot').execPopulate()

    const availableMeals = await calcAvailableMeals(req.params.id)

    if (availableMeals < order.numMeals){
        return res.status(400).send({ error: `Can't place order, only ${availableMeals} meals available` })
    }

    // Check if order is made before the orderDeadline
    const pot = await Pot.findById(req.params.id)

    if (new Date().getTime() > pot.orderDeadline) {
        return res.status(400).send({ error: 'You are too late to place this order' })
    }

    // Check if pickup time is before the pickupDeadline
    if (pot.pickupDeadline < order.pickupTime) {
        return res.status(400).send({ error: `Provide a pickup time before ${moment(pot.pickupDeadline).calendar()}` })
    }

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
router.get('/orders/me/customer', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'orders',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.orders)
    } catch (e) {
        res.status(500).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc

// Gets one order. To be used by the customer only
router.get('/orders/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const order = await Order.findOne({ _id: req.params.id, customer: req.user._id })

        if (!order) {
            return res.status(404).send()
        }

        console.log(order)

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