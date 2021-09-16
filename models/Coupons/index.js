const {Schema,model} = require('mongoose')


const couponSchema= new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        unique:true,
        required:true
    },
    isPercent:{
        type:Boolean
    },
    isAmount:{
        type:Boolean
    },
    amount:{
        type:Number
    },
    percentage:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true,
    }
})


module.exports=model('Coupon',couponSchema) 