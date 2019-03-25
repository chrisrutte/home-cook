const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const potRouter = require('./routers/pot')
const orderRouter = require('./routers/order')

const User = require('./models/user')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(potRouter)
app.use(orderRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const main = async () => {

    const user = await User.findById('5c9755f2741b6a496854fe37')
    await user.populate('pots').execPopulate()

    console.log(user.pots)
}

main()