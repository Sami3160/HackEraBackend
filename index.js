const express=require("express")
require('dotenv').config()
const cors = require('cors')
const UserRoutes=require("./Routes/User")
const ProductRoutes=require("./Routes/Product")
const CategoryRouter=require("./Routes/Category")
const connectMongoDB = require("./config/connection")

const app=express()
const URI=process.env.MONGODB_URI
const port= process.env.PORT || 8000 
connectMongoDB(URI)

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoutes)
app.use("/api", CategoryRouter);
app.use("/api", ProductRoutes)


app.listen(port,()=>{
    console.log("Server started");   
})
