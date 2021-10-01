const { model, Schema } = require("mongoose");

const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    banner:{
        type:String,
        required:true
    },
    likes_count: {
        type: Number,
        default: 0
    },
    comments: [
        {
          type: Schema.Types.ObjectId,
          ref: "Comment"
        }
    ],
    likers_id:{
        type:Array,
    },
    commenter_id:{
        type:Array,
    },
    sharer_id:{
        type:Array,
    },
  

})

let Task= model("nipTask",taskSchema)
Task.aggregate([{ $count: "comments" }]);
module.exports=Task