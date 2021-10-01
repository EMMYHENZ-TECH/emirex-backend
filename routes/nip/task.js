const express = require('express')
const router =express.Router()
const {createTask,getTasks,singleTask,like,comment,deleteTask,share}=require('../../controllers/task')
const {upload}=require('../../common-middlewares/')
const { requireSignin,userMiddleware,adminMiddleware } = require('../../common-middlewares');

router.post('/create',upload.single("banner"),createTask)
router.get('/',getTasks)
router.get('/singleTask/:id',singleTask)
router.post('/like/:id',requireSignin,like)
router.post('/comment/:id',requireSignin,comment)
router.post('/share/:id',share)
router.delete('/delete/:id',requireSignin,deleteTask)
module.exports=router