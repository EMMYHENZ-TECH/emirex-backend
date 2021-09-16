const {Schema,model} =require('mongoose')



const productSchema =new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    offer:{type:Number},
    size:{ 
        type:Number,
        required:true,
        default:1
    },
    productPictures:[
        {
            img:{
                type:String
            }
        }
    ],
    reviews:[
        {
            userId:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            review:{
                type:String
            }
        }
    ],
    category:{type:Schema.Types.ObjectId,ref:"Category",required:true},
    createdBy:{type:Schema.Types.ObjectId,ref:"Adminq",required:true},
    updatedAt:Date

},{timestamps:true})

module.exports=model("Product",productSchema)