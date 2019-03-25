const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Pot = require('../../src/models/pot')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: 'myhouse099@@',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const potOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First pot',
    name: "Burger and chips",
    owner: userOne._id,
    mealCount: 15
}

const potTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second pot',
    name: "Bobotie",
    owner: userOne._id,
    mealCount: 10
}

const potThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third pot',
    name: "Bobotie",
    owner: userTwo._id,
    mealCount: 20
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Pot.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Pot(potOne).save()
    await new Pot(potTwo).save()
    await new Pot(potThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    potOne,
    potTwo,
    potThree,
    setupDatabase
}