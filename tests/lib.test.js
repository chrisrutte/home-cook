const request = require('supertest')
const app = require('../src/app')
const Pot = require('../src/models/pot')
const Order = require('../src/models/order')
const calcAvailableMeals = require('../src/lib/calcAvailableMeals')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    potOne,
    potTwo,
    potThree,
    orderOne,
    orderTwo,
    orderThree,
    orderFour,
    setupDatabase
} = require('./fixtures/db')
const moment = require('moment')

beforeEach(setupDatabase)

test('Should calculate available meals correctly', async () => {
    const availableMeals = await calcAvailableMeals(potOne._id)
    expect(availableMeals).toBe(15 - 3 - 3)
})

