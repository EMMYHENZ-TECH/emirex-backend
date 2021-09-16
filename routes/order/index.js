const express =require('express')
const { newOrder, getUserOrders, getUserOrdersSingle } = require('../../controllers/orders')
const { userMiddleware,requireSignin } = require('../../common-middlewares')
const router =express.Router()

router.post('/user/order/add',requireSignin,userMiddleware,newOrder)
router.get('/user/order/get',requireSignin,userMiddleware,getUserOrders)
router.get('/user/order/get/:orderid',requireSignin,userMiddleware,getUserOrdersSingle)
module.exports = router