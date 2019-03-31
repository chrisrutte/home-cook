const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const potRouter = require('./routers/pot')
const orderRouter = require('./routers/order')
const transactionRouter = require('./routers/transaction')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(potRouter)
app.use(orderRouter)
app.use(transactionRouter)

module.exports = app

