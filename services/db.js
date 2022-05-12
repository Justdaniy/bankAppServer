//database connection


//import mongoose
const mongoose = require('mongoose')

//connection string to serve with db
mongoose.connect('mongodb://localhost:27017/bankServer',{
    useNewUrlParser:true
})

//create model
const User=mongoose.model('User',{
    acno:Number,
    uname:String,
    password:String,
    balance:Number,
    transaction:[]
})
//export model
module.exports={
    User
}