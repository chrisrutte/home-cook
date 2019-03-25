const express = require('express')
const Pot = require('../models/pot')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/pots', auth, async (req, res) => {
    const pot = new Pot({
        ...req.body,
        owner: req.user._id
    })

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
router.get('/pots/me', auth, async (req, res) => {
    const match = {}
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
        await req.user.populate('pots').execPopulate()
        // req.user.populate('pots')
        console.log(req.user)
        res.send(req.user)
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