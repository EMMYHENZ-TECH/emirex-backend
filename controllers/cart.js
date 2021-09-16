const Cart = require("../models/Cart");
const Product = require("../models/Product");

// exports.addItemToCart=(req,res)=>{

//     Cart.findOne({user:req.user.id})
//     .exec((error,cart)=>{
//         if(error) return res.status(400).json({message:"herer1",error})
//         if(cart){
//             const product =req.body.cartItems.product
//             console.log(cart)
//             const item=cart.cartItems.find(c=>c.product==product)
//             let condition ,update;
//             if(item){
//                 condition = {"user":req.user.id,"cartItems.product":product}
//                 update ={'$set':{
//                     "cartItems.$":{
//                         ...req.body.cartItems,
//                         quantity:item.quantity+req.body.cartItems.quantity
//                     }
//                 }}

//             }else{

//                 condition = {user:req.user.id}
//                 update ={
//                     '$push':{
//                         "cartItems":req.body.cartItems
//                     }
//                 }

//             }
//             Cart.findOneAndUpdate(condition,update)
//             .exec((error,_cart)=>{
//                 if(error) return res.status(400).json({message:"herer5",error})
//                 if(_cart){
//                     return res.status(201).json({cart:_cart})
//                 }
//             })
//         }
//         else{
//             const cart = new Cart({
//                 user:req.user.id,
//                 cartItems:[req.body.cartItems],
//             })
//             cart.save((error,cart)=>{
//                 if(error) return res.status(400).json({message:"herer6",error})
//                 if(cart){
//                     return res.status(201).json({cart})
//                 }
//             })
//         }
//     })
// }

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}
let continueFunc=false

exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user.id }).exec((error, cart) => {
    if (error) {
      res.status(400).json({ error });
      res.end();
    }
    if (cart) {
      //if cart already exists then update cart by quantity
      let promiseArray = [];

      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          Cart.findOne(
            { user: req.user.id, "cartItems.product": product },
            (err, cart) => {
              if (err) {
                res.status(400).json({ error: err });
                res.end();
              }
              if (cart) {
                const mainCart = cart.cartItems.findIndex(
                  (c) => c.product == product
                  );
                  if(req.body.action=="remove" ){
                    if(cart.cartItems[mainCart].quantity ==1){

                    }else{
                      cart.cartItems[mainCart].quantity=cart.cartItems[mainCart].quantity-1
                    }
                  }if(req.body.action=="add"){
                    cart.cartItems[mainCart].quantity=cart.cartItems[mainCart].quantity+1
                  }
                // cart.cartItems[mainCart].quantity=cart.cartItems[mainCart].quantity+1
                  cart.save((err, data) => {
                    if (err) {
                      res.status(400).json({ error: err.response });
                      res.end();
                    }
                    if(data){
                      continueFunc=false
                      
                      res.end("Added To Cart");
                    }
                  });
              }
            }
          );
        } else {
          continueFunc=true
          condition = { user: req.user.id };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        if(continueFunc==true){
        promiseArray.push(runUpdate(condition, update));
        }
        else{}
      });
      if(continueFunc==true){
        Promise.all(promiseArray)
          .then((response) =>
            res.end("created")
          )
          .catch((error) => {
            res.end("error")
          });
      }
      else{

      }
    } else {
      //if cart not exist then create a new cart
      const cart = new Cart({
        user: req.user.id,
        cartItems: req.body.cartItems,
      });
      cart.save((error, cart) => {
        if (error) {
          res.end("error")
        }
        res.end("added")
      });
    }
  });
};


exports.getCartItems = (req, res) => {
  //const { user } = req.body.payload;
  //if(user){
  Cart.findOne({ user: req.user.id })
    .populate("cartItems.product", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
          if(item.product==null){

          }
          else{
            
            function dataSize() {
              Product.findOne({_id:item.product._id})
             .then((product)=>{
             })
            }
            cartItems[item.product._id.toString()] = {
              _id: item.product._id.toString(),
              name: item.product.name,
              img: item.product.productPictures[0]?item.product.productPictures[0].img:null,
              price: item.product.price,
              qty: item.quantity, 
              size:item.size||item.quantity9
            };
          }
        });
        res.status(200).json({ cartItems });
      }
    });
  //}
};

exports.removeCartItem=(req,res)=>{
  Cart.findOne({user:req.user.id},(err,cart)=>{
    if(err){
      res.status(400).json({
        message:'an error occured'
      })
    }
    if(cart){
      cart.cartItems = cart.cartItems.filter((item)=>{
        return item.product._id !=req.params.productid
      })
      cart.save()
      .then(()=>{
        res.status(200).json({
          message:'item removed successfully'
        })
      })
      .catch(()=>{
        res.status(200).json({
          message:'error removing this item'
        })
      })
    }
  })
}