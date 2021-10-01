const express =require("express");
const cors = require('cors')
const mongoose =require("mongoose")
const {PORT,DB} = require("./config")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


connectmyDB=()=>{
    mongoose.connect(DB,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
        useCreateIndex:true,
    })
    .then(res=>{
        console.log("Connected to Db" + DB)
    })
    .catch(err=>{
        console.log("Error connecting to Db")
        console.log(err)
        setTimeout(()=>{

            connectmyDB()
        },2000)
    })
}
connectmyDB()

app.use("/api/v1/",require("./routes"))
app.use("/api/v1/user",require("./routes/User/Auth"))
app.use("/api/v1/",require("./routes/investmentPlan/investment"))
app.use("/api/v1/",require("./routes/investmentPlan/Transfer/Transfer"))
app.use("/api/v1/",require("./routes/Savings/Savings"))
app.use("/api/v1/",require("./routes/loan/loan"))
app.use("/api/v1/shop/",require("./routes/Category"))
app.use("/api/v1/shop/",require("./routes/Product"))
app.use("/api/v1/shop/",require("./routes/Cart"))
app.use("/api/v1/shop/",require("./routes/Coupon"))
app.use("/api/v1/shop/",require("./routes/checkout"))
app.use("/api/v1/shop/",require("./routes/order"))
app.use("/api/v1/admin/",require("./routes/Admin/Admin"))
app.use("/api/v1/nip/",require("./routes/nip/"))
app.use("/api/v1/task",require("./routes/nip/task"))
const APPPORT = process.env.PORT||PORT
app.listen(APPPORT,()=>{
    console.log(`server started on ${PORT}`)
})