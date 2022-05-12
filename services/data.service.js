//json webtoken import
const req = require('express/lib/request')
const jwt=require('jsonwebtoken')

//import db
const db=require('./db')

//database
database={
    1000:{acno:1000,uname:"ajith",password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,uname:"ismail",password:1001,balance:5000,transaction:[]},
    1002:{acno:1002,uname:"sami",password:1002,balance:5000,transaction:[]},
    1003:{acno:1003,uname:"bijo",password:1003,balance:5000,transaction:[]}
  
  }


    //register
   const register=(uname, acno, password)=>{
     
    //asynchronous
     return db.User.findOne({acno})
     .then(user=>{
    //  console.log(user);
     if (user) {
      //user already exist
      return { 
        statusCode:401,
        status:false,
        message:"account already exist"
      }
    } else{
      const newUser=new db.User(
        {
        acno,
        uname,
        password,
        balance:0,
        transaction:[]
      })
      newUser.save()
      return {
        statusCode:200,
        status:true,
        message:"successfully registered..please login"
      }
    }
     })
      }

      //login
const login=(acno,pswd)=>{
  
  //user entered acno and pswd
  
return db.User.findOne({acno,password:pswd})
.then(user=>{
  // console.log(user);
  if(user){
    currentUser=user.uname
    currentAcno=acno //to assign acno into currentAcno to to get the acno of login person to know whose transaction history is needed
  //token generate
  const token= jwt.sign({
    currentAcno:acno
  },'secretsecret777777')
    return {
      statusCode:200,
      status:true,
      message:"login successfull",
      currentAcno,
      currentUser,
      token
  }
}
else{
  
  return  {
    statusCode:401,
    status:false,
    message:"invalid credential!!!"
  }}
})
}

//deposit
const deposit=(acno,pswd,amt)=>{
  

  var amount=parseInt(amt)
  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if (user) {
      user.balance+= amount
   user.transaction.push({   //to insert type and amount into transaction array we use push method
     type:"credit",
     amount:amount
   })
   user.save()
   return {
    statusCode:200,
    status:true,
    message:amount +"succesfully credited...and new balance is: "+  user.balance

  } 
    }else{ return  {
      statusCode:402,
      status:false,
      message:"incorrect password!!!"
    }}
  })
}

//withdraw
const withdraw=(req,acno,pswd,amt)=>{
  var amount=parseInt(amt)

  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if (req.currentAcno!=acno) {
      return{
        statusCode:422,
      status:false,
      message:"operation denied!!!"
      }
    }
    if (user) {
      if (  user.balance>amount) {
        user.balance -= amount
        user.transaction.push({
          type:"debit",
          amount:amount
        })
        user.save()
     //     console.log(database);
  
      return {
        statusCode:200,
        status:true,
        message:amount +"succesfully debited...and new balance is: "+  user.balance
  
      } 
      }
      else {
        return {
          statusCode:422,
          status:false,
          message:"user doesnt exist!!!"
        }
      }
    }
    
  })
}


//transaction
const transaction=(acno)=>{
  return db.User.findOne({acno})
  .then(user=>{
    if (user) {
      return  {
        statusCode:200,
        status:true,
        transaction:user.transaction
      } 
    }
    else{
      return  {
        statusCode:402,
        status:false,
        message:"user doesnt exist!!!"
      }
    }
  })  
  }

  //deleteAcc
  const deleteAcc=(acno)=>{
    return db.User.deleteOne({acno})
    .then(user=>{
      if (!user) {
        return  {
          statusCode:401,
          status:false,
          message:"operation failed!!!"
        } 
      }
      else{
        return  {
          statusCode:200,
          status:true,
          message:"Account number"+acno+"deleted succussfully"
        }
      }
    })  
    }
  

      //export
      module.exports={
        register,
        login,
        deposit,
        withdraw,
        transaction,
        deleteAcc
      }