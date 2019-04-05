const request = require('supertest')
const app = require('../src/app')
const Pot = require('../src/models/pot')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    potOne,
    potTwo,
    potThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create pot for user', async () => {
    const response = await request(app)
        .post('/pots')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            mealCount: 14,
            name: "Pizza",
            description: "Lekker eet",
            price: 40,
            orderDeadlineHour: 22,
            orderDeadlineDate: new Date(),
            pickupDeadlineHour: 23,
            pickupDeadlineDate: new Date(),
        })
        .expect(201)
    const pot = await Pot.findById(response.body._id)
    expect(pot).not.toBeNull()
})

test('Should fetch user pots', async () => {
    const response = await request(app)
        .get('/pots/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users pots', async () => {
    const response = await request(app)
        .delete(`/pots/${potOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const pot = await Pot.findById(potOne._id)
    expect(pot).not.toBeNull()
})

test('Should only update own pots', async () => {
    const response = await request(app)
        .patch(`/pots/${potOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const pot = await Pot.findById(potOne._id)
    expect(pot).not.toBeNull()
})

// should only delete pots when no orders 
// should not create pots in the past
// if past and future pots endpoints, check if they pick the right orders