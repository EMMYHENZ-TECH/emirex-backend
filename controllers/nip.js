const Nip=require('../models/nip/nip')
const User =require('../models/user/User')
const moment =require('moment')
let referralCodeGenerator = require('referral-code-generator')
exports.requestToJoinNip=(req,res)=>{
    const {fullname,email}=req.body
    let userid=req.params.id
    Nip.findOne({user:userid},(err,nip)=>{
        if(err){
           
            return res.status(400).json({
                message:'an error occured'
            })
        }
        if(nip){
            return res.status(200).json({
                message:'you cuurently have a nip account'
            })
        }
        if(!nip){
            User.findOne({_id:userid},(err,user)=>{
                let email=user.email
                let newNip=new Nip({
                    user:user._id,
                    fullname:user.fullname,
                    email:user.email,
                    requestNip:true,
                    refCode:referralCodeGenerator.custom('lowercase', 6, 6, email)
                })
                newNip.payments.push(req.body)

                newNip.save()
                .then(()=>{
                    return res.status(200).json({
                        message:'you cuurently have a nip account'
                    })
                })
                .catch(err=>{
                    
                    return res.status(400).json({
                        message:'an error occured'
                    })
                    
                })
            })
            
        }
    })
}


exports.pendingNipRequest=(req,res)=>{
    Nip.find({requestNip:true},(err,users)=>{
        if(err){
            return res.status(400).json({
                message:'unknown error occured'
            })
        }
        if(users){
            return res.status(200).json({
                users
            })
        }
    })
}


exports.allUsersNip=(req,res)=>{
    Nip.find({},(err,nips)=>{
        if(err){
            return res.status(400).json({
                message:"an unknown error coocred"
            })
        }
        if(nips){
            return res.status(200).json({
                nips
            })
        }
    })
}
exports.pendingUsersNip=(req,res)=>{
    Nip.find({status:'pending'},(err,nips)=>{
        if(err){
            return res.status(400).json({
                message:"an unknown error coocred"
            })
        }
        if(nips){
            return res.status(200).json({
                nips
            })
        }
    })
}
exports.approvedUsersNip=(req,res)=>{
    Nip.find({status:'approved'},(err,nips)=>{
        if(err){
            return res.status(400).json({
                message:"an unknown error coocred"
            })
        }
        if(nips){
            return res.status(200).json({
                nips
            })
        }
    })
}
exports.declinedUsersNip=(req,res)=>{
    Nip.find({status:'declined'},(err,nips)=>{
        if(err){
            return res.status(400).json({
                message:"an unknown error occured"
            })
        }
        if(nips){
            return res.status(200).json({
                nips
            })
        }
    })
}
exports.singleUserNip=(req,res)=>{
    Nip.findOne({user:req.user.id},(err,nip)=>{
        if(err){
            return res.status(400).json({
                message:"an unknown error coocred"
            })
        }
        if(nip){
            return res.status(200).json({
                nip
            })
        }
    })
}

exports.requestWitdraw=(req,res)=>{
    Nip.findOne({user:req.user.id})
    .then((nip)=>{
        nip.requestWithdraw=true
        nip.requestWithdrawStatus='pending'
        nip.withdrawalRequest.push({
            ...req.body,
            fullname:nip.fullname,
            email:nip.email
        })
        nip.save()
        .then(()=>{
            return res.status(200).json({
                message:'successfully requested withdrawal'
            })
        })
        .catch(()=>{
            return res.status(400).json({
                message:'an error occured'
            })
        })
    })
}

exports.verifyUserNip=(req,res)=>{
    Nip.findOne({_id:req.params.id},(err,nip)=>{
        if(err){
            return res.status(400).json({
                message:'could not approve'
            })
        }else if(nip){
            if(nip.payments.refcode !== ""){
                if(nip.payments.refcode === "" || typeof nip.payments.refcode === undefined){

                }else{
                    console.log(nip.payments.refcode)
                    Nip.findOne({refCode:nip.payments.refcode},(err,user)=>{
                        if(user){
                            user.refferals+=1000
                            user.save()
                        }else{
    
                        }
                    })

                }
            }
            nip.nipStatus=true
            nip.earning=nip.earning+500
            nip.status="approved"
            
            let tempObj={
                message:'account activated successfully',
                amount:'2000',
                date:moment().format('MMMM Do YYYY, h:mm:ss a'),
                fullname:nip.fullname,
                email:nip.email
            }
            nip.niphistory.push(tempObj)
            nip.save()
            .then(()=>{
                return res.status(200).json({
                    message:'successfully approved nip account'
                })
            })

        }
    })
}

exports.verifyUserNipWithdrawal=(req,res)=>{
    Nip.findOne({_id:req.params.id},(err,nip)=>{
        if(err){
            return res.status(400).json({
                message:'could not approve'
            })
        }else if(nip){
            let {source,amount}=req.body
            nip.requestWithdraw=false
            let lamount=parseInt(amount)
            console.log(lamount)
            if(source=='ref'){
                if(lamount<=nip.refferals && nip.refferals >=5000 ){
                    nip.refferals=nip.refferals-lamount
                    let tempObj={
                        message:'account paid refferal earning',
                        amount:lamount,
                        date:moment().format('MMMM Do YYYY, h:mm:ss a'),
                        fullname:nip.fullname,
                        email:nip.email
                    }
                    nip.niphistory.push(tempObj)
                    nip.save()
            .then(()=>{
                return res.status(200).json({
                    message:'successfully approved nip withdrawal'
                })
            })
                }else{
                    return res.status(200).json({
                        message:'insufficient funds'
                    })
                }
            }
            if(source=='earn'){
                if(lamount<=nip.earning && nip.earning>=10000){
                    nip.earning=nip.earning-lamount
                    let tempObj={
                        message:'account paid activities earning',
                        amount:lamount,
                        date:moment().format('MMMM Do YYYY, h:mm:ss a'),
                        fullname:nip.fullname,
                        email:nip.email
                    }
                    nip.niphistory.push(tempObj)
                    nip.save()
            .then(()=>{
                return res.status(200).json({
                    message:'successfully approved nip withdrawal'
                })
            })
                }else{
                    return res.status(200).json({
                        message:'insufficient funds'
                    })
                }
            }
            

        }
    })
}

exports.allWithdrawals=(req,res)=>{
    Nip.find({requestWithdraw:true},(err,nips)=>{
        if(err){
            return res.status(400).json({
                message:"an unknown error coocred"
            })
        }
        if(nips){
            return res.status(200).json({
                nips
            })
        }
    })
}

