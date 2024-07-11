const express=require('express');
const dotenv=require('dotenv');
const { json } = require('body-parser');
const mongoose=require('mongoose');
const userHandler=require('./userHandler');
const todoHandler=require('./todoHandler');
const app=express();
dotenv.config();

app.use(express.json());

//database connection
mongoose.connect('mongodb://localhost/user_auth')
.then(()=>{
    console.log('Database connection successfull');
})
.catch((err)=>{
    console.log(err);
})

app.use('/user',userHandler);
app.use('/todo',todoHandler);


//default error middleware
const errorHandler=((err,req,res,next)=>{
    if(res.headersSent){
       return next(err);
    }else{
        res.status(500).json({error:err});
    }
})

app.use(errorHandler);

app.listen(3000,()=>{
    console.log('listening on port 3000')
})

