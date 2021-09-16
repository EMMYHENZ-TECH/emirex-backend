const {Schema,model} = require('mongoose')


const checkoutSchema= new Schema({
    address:{
        type:Boolean,
        default:false
    },
    addressDetails:{
        type:Object,
        default:{}
    },
    deliveryMethod:{
        type:Object,
        default:{}
    },
    paymentMethod:{
        type:Object,
        default:{}
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

})


module.exports=model('Checkout',checkoutSchema) 