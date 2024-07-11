const mongoose=require('mongoose');


const tokenSchema= mongoose.Schema({
    username:{
      type:String
    },
    token:{
      type:String
    }
  });
  module.exports=tokenSchema;
  