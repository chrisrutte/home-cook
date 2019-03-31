const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const potRouter = require('./routers/pot')
const orderRouter = require('./routers/order')
const transactionRouter = require('./routers/transaction')

// const User = require('./models/user')
// const Pot = require('./models/pot')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(potRouter)
app.use(orderRouter)
app.use(transactionRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const Pot = require('./models/pot')

// const potId = '5c975607741b6a496854fe39'

// const availableMeals = (potId) => {
//     const pot = Pot.findById(potId)
//     pot.populate('orders').exec(function (err, pot) {
//         if (err) return handleError(err)

//         const numMeals = pot.orders.map(({ numMeals }) => numMeals)
//         const mealSum = numMeals.reduce((a, b) => a + b, 0)

//         console.log(mealSum)
//         return mealSum
//     })
//     // 
// }

