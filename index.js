//server creation steps

//import express
const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");



//import dataservice
const dataService = require('./services/data.service')

//json webtoken import
const jwt=require('jsonwebtoken')

//import cors
const cors = require('cors');
const { param } = require("express/lib/application");
const { process_params } = require("express/lib/router");


//create server app using express
const app=express()

//use cors
app.use(cors({
    origin:'http://localhost:4200'
}))
//to parse json data
app.use(express.json())

//resolving API call
//GET - to read data
app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})

//POST - to create data
app.post('/',(req,res)=>{
    res.send("POST REQUEST")
})

//PUT - to update/modify data
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})

//PATCH - to partially update/modify data
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})

//delete - to delete data
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
})

//jwtMiddleware
const jwtMiddleware=(req,res,next)=>{
    try{
        const token=req.headers["access-token"]
        console.log(jwt.verify(token,'secretsecret777777'));
    const data=jwt.verify(token,'secretsecret777777')
    req.currentAcno=data.currentAcno

    next()
 }
 catch{
     res.status(401).json({
         statusCode:402,
         status:false,
         message:"please login!!!"
     })
 }
}


//register api
app.post('/register',(req,res)=>{
    //asynchronous
dataService.register(req.body.uname,req.body.acno,req.body.password)
.then(result=>{
    res.status(result.statusCode).json(result)

})
})

//login api
app.post('/login',(req,res)=>{
dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

//deposit api -  router specific middleware:jwtmiddleware
app.post('/deposit',jwtMiddleware,(req,res)=>{
 dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
 .then(result=>{
    res.status(result.statusCode).json(result)
})
})

//withraw api -   router specific middleware:jwtmiddleware
app.post('/withdraw',jwtMiddleware,(req,res)=>{
     dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
     .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

//transaction api -  router specific middleware:jwtmiddleware
app.post('/transaction',jwtMiddleware,(req,res)=>{
 dataService.transaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })

})

//onDelete api
app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{
dataService.deleteAcc(req.params.acno)
.then(result=>{
    res.status(result.statusCode).json(result)
 
})
})

//set port number
app.listen(3000,()=>{
    console.log("server started at 3000");
})