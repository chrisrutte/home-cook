const express = require('express')
const Pot = require('../models/pot')
const router = new express.Router()

// Check if meals are available
const calcAvailableMeals = async (potId) => {
    const pot = await Pot.findById(potId)
    await pot.populate({
        path: 'orders',
        match: { $or:[{ paymentStatus: 'pending' }, { paymentStatus: 'paid' }] }
    }).execPopulate()

    const numMeals = await pot.orders.map(({numMeals}) => numMeals)  // map only orders paid or pending
    const mealSum = await numMeals.reduce((a, b) => a + b, 0)

    return pot.maxMeals - mealSum
}

module.exports = calcAvailableMeals