const express = require('express');
const router = express.Router();
const nipCtrl = require('../../controllers/nip');
const { requireSignin,userMiddleware,adminMiddleware } = require('../../common-middlewares');
router.post('/join/:id',nipCtrl.requestToJoinNip)
router.get('/dashboard/user',requireSignin,userMiddleware,nipCtrl.singleUserNip)
router.get('/allUsersNip',nipCtrl.allUsersNip)
router.get('/pendingUsersNip',nipCtrl.pendingUsersNip)
router.get('/approvedUsersNip',nipCtrl.approvedUsersNip)
router.get('/declinedUsersNip',nipCtrl.declinedUsersNip)
router.post('/request/withdrawal',requireSignin,nipCtrl.requestWitdraw)
router.post('/verify/:id/nip',requireSignin,adminMiddleware,nipCtrl.verifyUserNip)
router.post('/verify/:id/nip/pay',requireSignin,adminMiddleware,nipCtrl.verifyUserNipWithdrawal)
router.get('/pending/nip/withdrawals',nipCtrl.allWithdrawals)
module.exports=router