const { model, Schema } = require("mongoose");

const nipSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fullname:{
        type:String,
        ref:"User",
        required:true
    },
    email:{
        type:String,
        ref:"User",
        required:true
    },
    withdrawals:{
        type:Object,
        default:[]
    },
    niphistory:[
        {
            type:Object
        }
    ],
    
    withdrawalRequest:{
        type:Object,
        default:[]
    },
    payments:{
        type:Object,
        default:[]
    },
    earning:{
        type:Number,
        default:0
    },
    refferals:{
        type:Number,
        default:0
    },
    dateJoined:{
        type:Date,
        default:new Date()
    },
    nipStatus:{
        type:Boolean,
        default:false
    },
    requestNip:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:'pending'
    },
    requestWithdraw:{
        type:Boolean,
        default:false
    },
    requestWithdrawStatus:{
        type:String,
    },
    refCode:{
        type:String
    }

})


module.exports=model('nip',nipSchema)