const request = require('supertest')
const app = require('../src/app')
const calcAvailableMeals = require('../src/lib/calcAvailableMeals')
const {
    potOne,
    potTwo,
    potThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should calculate available meals correctly', async () => {
    const availableMeals = await calcAvailableMeals(potOne._id)
    expect(availableMeals).toBe(9) // 15-3-3
})

