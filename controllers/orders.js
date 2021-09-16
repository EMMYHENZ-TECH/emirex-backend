const Orders = require('../models/orders')
const securePin = require("secure-pin")


exports.newOrder=(req,res)=>{
    const {orderlist} =req.body
    const orderid  = securePin.generatePinSync(5)
    Orders.findOne({user:req.user.id},(err,order)=>{
        if (err) {
            return res.status(400).json({
                message:"an error occured",
                error:err
            })
        }
        if(!order){
            const neworder =new Orders({
                user:req.user.id,
                orders:[{
                    order:orderid,
                    total:orderlist.total,
                    items:orderlist.items
                }]
            })
            neworder.save()
            .then(()=>{
                res.status(200).json({
                    message:"order received successfully"
                })
            })
            .catch((err)=>{
                res.status(400).json({
                    message:"an error occured",
                    error:err
                })
            })
        }
        if (order) {
            
            order.orders.push({
                order:orderid,
                total:orderlist.total,
                items:orderlist.items
            })

            
            order.save()
            .then(()=>{
                res.status(200).json({
                    message:"order received successfully"
                })
            })
            .catch((err)=>{
                res.status(400).json({
                    message:"an error occured",
                    error:err
                })
            })
        }
    })
}


exports.getUserOrders=(req,res)=>{
    Orders.findOne({user:req.user.id},(err,order)=>{
        if(err){
            return res.status(400).json({
                message:'an error occured'
            })
        }
        if(order){
            return res.status(200).json({
                order:order.orders
            })
        }
        if (!order) {
            return res.status(200).json({
                message:"you do not have any order yet"
            })
            
        }
    })
}
exports.getUserOrdersSingle=(req,res)=>{
    Orders.findOne({user:req.user.id},(err,order)=>{
        if(err){
            return res.status(400).json({
                message:'an error occured'
            })
        }
        if(order){
            return res.status(200).json({
                order:order.orders.filter((order)=>{
                    return order.order ==req.params.orderid
                })
            })
        }
        if (!order) {
            return res.status(200).json({
                message:"you do not have any order yet"
            })
            
        }
    })
}