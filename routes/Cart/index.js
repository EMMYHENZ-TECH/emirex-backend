const express = require('express')
const { addItemToCart,getCartItems,removeCartItem } = require('../../controllers/cart')
const {userMiddleware,requireSignin} =require('../../common-middlewares')
const router =express.Router()


router.post('/user/cart/addtocart',
requireSignin,
userMiddleware,
addItemToCart)
router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);
router.delete("/user/removeItem/:productid", requireSignin, userMiddleware, removeCartItem);

module.exports =router