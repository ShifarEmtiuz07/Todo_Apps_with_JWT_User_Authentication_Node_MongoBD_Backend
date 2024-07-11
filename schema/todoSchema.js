const mongoose= require('mongoose');
const { type } = require('os');
const { title } = require('process');

const todoSchema=mongoose.Schema({
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
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }
});

///instance method

todoSchema.methods={
    findActive: function(){
        return mongoose.model('Todo').find({status:'active'});
    },
    deleteByTitle: function(){
        return mongoose.model('Todo').deleteOne({title:'learn js'});
    }
}

///static methods
 todoSchema.statics={
    findByWord:function(){
        return this.find({title:/node/i});
    }
 }

 ///queryhelper
todoSchema.query={
    byLanguage:function(language){
        return this.find({title: new RegExp(language,'i')});
    }
}


module.exports=todoSchema;