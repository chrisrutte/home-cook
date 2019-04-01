const express = require('express')
const Pot = require('../models/pot')
const auth = require('../middleware/auth')
const router = new express.Router()

const calcAvailableMeals = require('../lib/calcAvailableMeals')

router.post('/pots', auth, async (req, res) => {

    const orderDeadline = new Date(req.body.orderDeadlineDate).setHours(req.body.orderDeadlineHour)
    const pickupDeadline = new Date(req.body.pickupDeadlineDate).setHours(req.body.pickupDeadlineHour)
    
    const pot = new Pot({
        // ...req.body,
        name: req.body.name,
        maxMeals: req.body.maxMeals,
        price: req.body.price,
        orderDeadline,
        pickupDeadline,
        owner: req.user._id
    })

    // only allow posting before the pickup deadline
    if (new Date().getTime() > pot.orderDeadline) {
        return res.status(400).send({ error: 'Make sure your order deadline is in the past' })
    }

    // only allow post when pickup deadline is after order deadline
    if (pot.pickupDeadline < pot.orderDeadline) {
        return res.status(400).send({ error: 'Make sure your pickup deadline is after your order deadline' })
    }

    try {
        await pot.save()
        res.status(201).send(pot)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
// GET /pots?time=past
router.get('/pots/me', auth, async (req, res) => {
    
    const match = {}
    if (req.query.time === 'past') {
        match['date'] = { $lte: new Date()}
    } else if (req.query.time === 'future') {
        match['date'] = { $gte: new Date()}
    }

    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

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
        // await req.user.populate('pots').execPopulate()
        // await req.user.pots.populate('orders').execPopulate()

        // Add number of paid and pending meals

        await req.user.populate({
            path: 'pots',
            match,
            options: {
                        limit: parseInt(req.query.limit),
                        skip: parseInt(req.query.skip),
                        sort
                    },
            populate: { path: 'orders' }
        }).execPopulate()

        const result = req.user.pots.map(async (pot) => {
            const availableMeals = await calcAvailableMeals(pot._id)
            pot._doc.availableMeals = availableMeals
            pot._doc.orders = pot.orders // not ideal but only way for now to populate orders in final response 
            return pot            
        })
       
        Promise.all(result).then((completed) => res.send(req.user.pots))
        
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/pots/', async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        const pots = await Pot.find()
        res.send(pots)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/pots/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const pot = await Pot.findOne({ _id })

        if (!pot) {
            return res.status(404).send()
        }

        res.send(pot)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/pots/:id', auth, async (req, res) => {
    // only allow if there are no orders yet
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']  // revise bases on params
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const pot = await Pot.findOne({ _id: req.params.id, owner: req.user._id})

        if (!pot) {
            return res.status(404).send()
        }

        updates.forEach((update) => pot[update] = req.body[update])
        await pot.save()
        res.send(pot)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/pots/:id', auth, async (req, res) => {
    // only allow if there are no orders
    try {
        const pot = await Pot.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!pot) {
            res.status(404).send()
        }

        res.send(pot)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router