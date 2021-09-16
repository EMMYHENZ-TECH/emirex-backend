const {Schema,model} = require("mongoose")
const  uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-extra');
const AdminSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    phonenumber:{
        type:String,
        required:true,
        trim:true
    },
    residentialAddress:{
        type:String,
        required:true,
        trim:true
    },
    nearestBusStop:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:Object,
    },
    town:{
        type:String,
        required:true,
        trim:true
    },
    State:{
        type:String,
        required:true,
        trim:true
    },
    country:{
        type:String,
        required:true,
        trim:true
    },
    DateOfBirth:{
        type:String,
        required:true,
        trim:true
    },
    stateOfOrigin:{
        type:String,
    },
    idNumber:{
        type:String,
        required:true,
        trim:true
    },
    idType:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    AdminType:{
        type:String,
        required:true
    },
    regNoAdmin:{
        type:String,
        required:true
    },
    activityLogs:[
        {
            type: Object,
            default:{}
        } 
    ],
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },
    accesscode:{
        type:String,
        unique:true
    },
    referralsEarning:{
        type:Number,
        default:0
    },
    referralsUsers:[
        {
            type:Object,
        }
    ],
    role:{
        type:String,
        default:"admin"
    },
    notifications:[
        {
            type:Object,
        }
    ]

},{ timestamps: true })


AdminSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomString().toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};


AdminSchema.plugin(uniqueValidator);
module.exports=model("admin",AdminSchema);

