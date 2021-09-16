const express = require('express');
const { upload } = require('../../common-middlewares');
const router = express.Router();
const userCtrl = require('../../controllers/user');




router.post('/register', userCtrl.signup);
router.get('/users', userCtrl.alluser);
router.delete('/users/:id/delete', userCtrl.deleteaccount);
router.post('/dashboarduser/:id',verifyToken, userCtrl.dashboarduser);
router.post('/verify/', userCtrl.verify);
router.post('/verified/', userCtrl.getverified);
router.put('/register/personal/:id', userCtrl.updatePersonalDetails);
router.put('/personal/:id/newuser1', userCtrl.updateDetails1);
router.put('/personal/:id/newuser/two', userCtrl.updateDetails2);
router.put('/personal/:id/update/email/user', userCtrl.updateEmail);
router.post('/personal/:id/newuser/image/upload',upload.single("image"), userCtrl.uploadimage);
router.post('/login', userCtrl.login);


function verifyToken(req,res,next){
	const bearerHeader =req.headers['authorization']
	if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
		req.token = bearerToken;
		next()
	}else{
		res.sendStatus(403)
	}
}
module.exports = router;