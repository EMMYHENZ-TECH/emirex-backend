// const Order =require('../models/orders')
const Cart = require('../models/Cart')
const User = require('../models/user/User')

exports.placeOrder=(req,res)=>{
    
    User.findById({_id:req.user.id},(err,user)=>{
        if(err){
            return res.status(400).json({
                message:'an error occured'
            })
        }
        if (user) {
            // Cart.findOne({user:user._id},())
        }
        if (!user) {
            return res.status(404).json({
                message:'user does not exist'
            })
        }
    })
}