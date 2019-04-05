const request = require('supertest')
const app = require('../src/app')
const Pot = require('../src/models/pot')
const Order = require('../src/models/order')
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

test('Should not create orders for past pots', async () => {
    const response = await request(app)
    .post(`/orders/${potThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        "numMeals": 2,
        "pickupHour": moment().get('hour') + 2,
        "pickupDate": moment().set({'hours': 0, 'minutes': 0, 'seconds': 0, 'milliseconds': 0})
    })
    .expect(400)
    const order = await Order.findById(response.body._id)
    expect(order).toBeNull()
})

test('Should not create orders without being logged in', async () => {
    const response = await request(app)
    .post(`/orders/${potThree._id}`)
    // .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        "numMeals": 2,
        "pickupHour": moment().get('hour') + 2,
        "pickupDate": moment().set({'hours': 0, 'minutes': 0, 'seconds': 0, 'milliseconds': 0})
    })
    .expect(401)
    const order = await Order.findById(response.body._id)
    expect(order).toBeNull()
})

test('Should not show orders for other customer', async () => {
    await request(app)
        .get(`/order/${orderTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
})



// Should not show orders for other cooks
// Should calcAvailableMeals correctly 

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

