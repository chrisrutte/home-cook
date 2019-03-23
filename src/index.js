const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const potRouter = require('./routers/pot')
const orderRouter = require('./routers/order')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(potRouter)
app.use(orderRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})