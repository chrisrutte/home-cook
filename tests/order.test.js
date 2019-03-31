const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/order')
const { userOneId, userOne, userTwo, userTwoId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Test', async () => {

})

// Should not create orders for past pots
// Should not show orders for other customer
// Should not show orders for other cooks
// Should not create orders without being logged in

// const request = require('supertest')
// const app = require('../src/app')
// const Pot = require('../src/models/pot')
// const {
//     userOneId,
//     userOne,
//     userTwoId,
//     userTwo,
//     potOne,
//     potTwo,
//     potThree,
//     setupDatabase
// } = require('./fixtures/db')

// beforeEach(setupDatabase)

// test('Should create pot for user', async () => {
//     const response = await request(app)
//         .post('/pots')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             mealCount: 14,
//             name: "Pizza",
//             description: "Lekker eet"
//         })
//         .expect(201)
//     const pot = await Pot.findById(response.body._id)
//     expect(pot).not.toBeNull()
// })