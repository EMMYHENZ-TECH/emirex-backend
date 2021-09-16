const { updateProfile,resetpassword, reset, resetPasswordChange} = require('../controllers')

const router =require('express').Router()

router.put('/update/profile/:id',updateProfile)
router.post('/password/reset-request',resetpassword)
router.post('/password/reset/:token',reset)
router.post('/password/change/:token',resetPasswordChange)
module.exports=router