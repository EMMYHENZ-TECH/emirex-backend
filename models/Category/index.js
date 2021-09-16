const {Schema,model} = require('mongoose')


const categorySchema= new Schema({
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
    parentId:{
        type:String
    }
})


module.exports=model('Category',categorySchema) 