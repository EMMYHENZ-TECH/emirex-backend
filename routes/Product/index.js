const express = require('express')
const { createProduct,allProducts,singleProduct} = require('../../controllers/Product')
const router =express.Router()
const { requireSignin, adminMiddleware, upload } = require('../../common-middlewares')

router.post('/product/create',requireSignin,adminMiddleware,upload.single('productPicture'),createProduct)
router.get('/products/all',allProducts)
router.get('/products/:id/single',singleProduct)

module.exports =router