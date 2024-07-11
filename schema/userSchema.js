const mongoose=require('mongoose');
const { type } = require('os');

const userSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  } ,
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:['active','inactive'],
  },
  todos:[

    ///user er modda sudu todo id ta rakta hole aita
    /*{
      type:mongoose.Types.ObjectId,
      ref:"Todo"
      
    }*/
    
    //user er modda full todo rakhla aita(recommanded)
    
    {
    title:{
      type: String,
      require: true

  },
  description:String,
  status:{
      type:String,
      enum:['active','inactive'],
  },
  date:{
      type:Date,
      default:Date.now
  }
}

  ]
});

module.exports=userSchema;