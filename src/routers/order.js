const express = require('express')
const Order = require('../models/order')
const Pot = require('../models/pot')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/orders/:id', auth, async (req, res) => {
    const order = new Order({
        ...req.body,
        pot: req.params.id,
        customer: req.user._id
    })
    await order.populate('pot').execPopulate()

    // Check if meals are available
    const calcAvailableMeals = async (potId) => {
        const pot = await Pot.findById(potId)
        await pot.populate('orders').execPopulate()

        const numMeals = await pot.orders.map(({numMeals}) => numMeals)  // map only orders paid or pending
        const mealSum = await numMeals.reduce((a, b) => a + b, 0)
    
        return pot.maxMeals - mealSum
    }

    const availableMeals = await calcAvailableMeals(req.params.id)

    if (availableMeals < order.numMeals){
        return res.status(400).send({ error: `Can't place order, only ${availableMeals} meals available` })
    }

    // Check if order is made before the deadline
    const pot = await Pot.findById(req.params.id)
    const orderDeadline = new Date(pot.date).setHours(pot.orderDeadline)

    if (new Date() > orderDeadline) {
        return res.status(400).send({ error: 'You are too late to place this order' })
    }

    // Check if pickup time is before 
    if (pot.pickupDeadline < order.pickupTime) {
        return res.status(400).send({ error: `Provide a pickup time before ${pot.pickupDeadline}.00` })
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
    // const match = {}
    // const sort = {}

    // if (req.query.sortBy) {
    //     const parts = req.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }

    try {
        // await req.user.populate({
        //     path: 'pots',
        //     match,
        //     options: {
        //         limit: parseInt(req.query.limit),
        //         skip: parseInt(req.query.skip),
        //         sort
        //     }
        // }).execPopulate()
        await req.user.populate('orders').execPopulate()
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