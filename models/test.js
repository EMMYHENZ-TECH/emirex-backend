// var mongoose = require("mongoose");
// var DiscountCodesSchema = mongoose.Schema({
//   code: { type: String, require: true, unique: true },
//   isPercent: { type: Boolean, require: true, default: true },
//   amount: { type: Number, required: true }, // if is percent, then number must be ≤ 100, else it’s amount of discount
//   expireDate: { type: String, require: true, default: "" },
//   isActive: { type: Boolean, require: true, default: true },
// });
// DiscountCodesSchema.pre("save", function (next) {
//   var currentDate = new Date();
//   this.updated_at = currentDate;
//   if (!this.created_at) {
//     this.created_at = currentDate;
//   }
//   next();
// });
// var Discounts = mongoose.model("DiscountCodes", DiscountCodesSchema);
// module.exports = Discounts;



// let isExistDiscount = false
// do {
// let myDiscountCode = coupongenerator()
// let newDiscountCode = new DiscountCode({
// code: myDiscountCode,
// isPercent: false,
// amount: [{ IRT: 5000 }, { USD: 5 }, { EUR: 5 }],
// expireDate: ‘’,
// isActive: true
// })
// newDiscountCode.save(function (err) {
// if (err) {
// if (err.name === ‘MongoError’ && err.code === 11000) {
// // Duplicate code detected
// isExistDiscount = true;
// }
// }
// res.send({
// //success message render
// })
// })
// }
// while (isExistDiscount);
// …