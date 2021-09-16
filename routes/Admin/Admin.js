const express = require('express');
const router = express.Router();
const adminCtrl = require('../../controllers/Admin');
const {requireSignin,adminMiddleware,superAdminMiddleware} =require('../../common-middlewares/index')

router.post("/register",adminCtrl.signup)
router.post("/login",adminCtrl.login)
router.post("/dashboard/:id",adminCtrl.AdminDashboard)
router.get("/all/admin",adminCtrl.AllAdmins)
router.get("/user/request/investment",adminCtrl.Pending)
router.post("/user/verifyinvestor/investment/:id",adminCtrl.verifyinvestor)
router.post("/user/verifyinvestor/declineinvestment/:id",adminCtrl.declineInvestor)
router.get("/user/request/loans",adminCtrl.PendingLoaner)
router.post("/user/verifyLoaner/investment/:id",adminCtrl.verifyloaner)
router.get("/user/request/savingsadd",adminCtrl.PendingSaveAdd)
router.post("/user/verifysavings/investment/:id",adminCtrl.verifysavings)
router.get("/user/requestpayloan/payloanrequest",adminCtrl.PayLoan)
router.post("/user/verifypayloan/loaner/:id",adminCtrl.verifypayloan)
router.get("/user/requestaddtosti/paysaveadd",adminCtrl.stirequest)
router.post("/user/verifyaddtosti/save/:id",adminCtrl.verifysti)

router.get("/user/new/user/unapproved",adminCtrl.newUsers)
router.get("/user/new/user/approved",adminCtrl.UsersActive)
router.get("/user/newUser/decline",adminCtrl.UsersDeclined)

router.post("/user/newUser/:id/approve",adminCtrl.approveNewUser)
router.post("/user/newUser/:id/decline",adminCtrl.disapproveAccount)
router.post("/user/newUser/:id/decline/loan",adminCtrl.declineLoaner)
router.post("/user/newUser/:id/decline/save",adminCtrl.declineSaver)

router.get("/usersthatsaves/savings/activeusers",adminCtrl.savingsIsActive)

router.get("/users/active/investors",adminCtrl.AllInvestorsActive)
router.get("/users/all/investors",adminCtrl.AllInvestors)
router.get("/users/declined/investors",adminCtrl.AllInvestorsdeclined)



router.get("/users/all/loan",adminCtrl.AllLoan)
router.get("/users/all/save",adminCtrl.AllSave)


router.get("/users/all/pending/loan",adminCtrl.AllPendingLoan)
router.get("/users/all/pending/save",adminCtrl.AllPendingSave)

router.get("/users/all/active/loan",adminCtrl.AllActiveLoan)
router.get("/users/all/active/save",adminCtrl.AllActiveSave)

router.get("/users/all/declined/loan",adminCtrl.AllDeclinedLoan)
router.get("/users/all/declined/save",adminCtrl.AllDeclinedSave)


router.post('/users/payinvestment/:id/payuser',requireSignin,adminMiddleware,adminCtrl.payActiveInvestor)

router.post("/user/verifyloan/repayment/:id",adminCtrl.activateNewLoanRepay)
module.exports = router;
