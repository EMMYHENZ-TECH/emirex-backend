const express = require('express')
const { createCategory,getCategories, singleCategoryProducts } = require('../../controllers/category')
const { requireSignin, adminMiddleware } = require('../../common-middlewares/')
const router =express.Router()


router.post('/category/create',requireSignin,adminMiddleware,createCategory)
router.get('/category/getCategory',getCategories)
router.get('/category/singleCategoryProducts/:slug',singleCategoryProducts)

module.exports =router