const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Pot = require('../../src/models/pot')
const Order = require('../../src/models/order')

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

const userThreeId = new mongoose.Types.ObjectId()
const userThree = {
    _id: userThreeId,
    name: 'Chris',
    email: 'chris@example.com',
    password: 'myhouse099@@',
    tokens: [{
        token: jwt.sign({ _id: userThreeId }, process.env.JWT_SECRET)
    }]
}

const potOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First pot',
    name: "Burger and chips",
    owner: userOne._id,
    maxMeals: 15,
    price: 40,
    orderDeadline: new Date().getTime() + 1000,
    pickupDeadline: new Date().getTime() + 2000
}

const potTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second pot',
    name: "Bobotie",
    owner: userOne._id,
    maxMeals: 10,
    price: 40,
    orderDeadline: new Date().getTime() + 1000,
    pickupDeadline: new Date().getTime() + 2000    
}

const potThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third pot',
    name: "Bobotie",
    owner: userTwo._id,
    maxMeals: 20,
    price: 40,
    orderDeadline: new Date().getTime() + 1*1000*60*60,
    pickupDeadline: new Date().getTime() + 2*1000*60*60
}

const orderOne = {
    _id: new mongoose.Types.ObjectId(),
    pot: potOne._id,
    customer: userTwo._id,
    pickupTime: new Date().getTime() + 1.5*1000*60*60,
    numMeals: 3,
    paymentStatus: 'pending'
}

const orderTwo = {
    _id: new mongoose.Types.ObjectId(),
    pot: potOne._id,
    customer: userTwo._id,
    pickupTime: new Date().getTime() + 1.5*1000*60*60,
    numMeals: 3,
    paymentStatus: 'pending'
}

const orderThree = {
    _id: new mongoose.Types.ObjectId(),
    pot: potTwo._id,
    customer: userTwo._id,
    pickupTime: new Date().getTime() + 1.5*1000*60*60,
    numMeals: 3,
    paymentStatus: 'pending'
}

const orderFour = {
    _id: new mongoose.Types.ObjectId(),
    pot: potThree._id,
    customer: userOne._id, 
    pickupTime: 14,
    numMeals: 3
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Pot.deleteMany()
    await Order.deleteMany()    
    await new User(userOne).save()
    await new User(userTwo).save()
    await new User(userThree).save()    
    await new Pot(potOne).save()
    await new Pot(potTwo).save()
    await new Pot(potThree).save()
    await new Order(orderOne).save()
    await new Order(orderTwo).save()
    await new Order(orderThree).save() 
    await new Order(orderFour).save()        
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    userThreeId,
    userThree,    
    potOne,
    potTwo,
    potThree,
    orderOne,
    orderTwo,
    orderThree,
    orderFour,
    setupDatabase
}