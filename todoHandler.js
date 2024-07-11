const express=require('express');
const mongoose=require('mongoose')
const router=express.Router();
const todoSchema=require('./schema/todoSchema');
const checkLogin=require('./middleware/chechLogin');
const userSchema = require('./schema/userSchema');

const Todo= new mongoose.model('Todo',todoSchema);
const User= new mongoose.model('User',userSchema);


//get  todo by instance method
/////
router.get('/a', async (req,res)=>{
    const todo= new Todo();
    const data = await todo.findActive()
    .then((data)=>{
        res.status(200).json({
            result:data,
            message:'Todo get successfully !'
        })
        

    })
    .catch((err)=>{
        res.status(500).json({
            error:'There was a server side error'
        })

    })
    
});
/////

///get  todo by statics method
router.get('/findword', async(req,res)=>{
    const data= await Todo.findByWord()
    .then((data)=>{
        res.status(200).json({
            result:data,
            message:'Todo get successfully !'
        })
        

    })
    .catch((err)=>{
        res.status(500).json({
            error:'There was a server side error'
        })

    })
})
////

///get todo by queryHelper
router.get('/queryHelper', async(req,res)=>{
    const data= await Todo.find().byLanguage('mongo')
    .then((data)=>{
        if(data>'0'){
            res.status(200).json({
            result:data,
            message:'Todo get successfully !'
        })}else{
            res.status(200).json({
                message:'No data found !'
            })
        }
        
        

    })
    .catch((err)=>{
        res.status(500).json({
            error:'There was a server side error'
        })

    })

})


//get all the TODOS
router.get('/',checkLogin, async (req,res)=>{
    await Todo.find({status:'active'}).select({
        _id:0,
        __v:0
    }).limit(4)
    .populate('userId','name username -_id')
    .then((data)=>{
        res.status(200).json({
            result:data,
            message:'Todo get successfully !'
        })
        

    })
    .catch((err)=>{
        res.status(500).json({
            error:'There was a server side error'
        })

    })
});

//GET A TODO by ID
router.get('/:id',async (req,res)=>{
   const data= await Todo.find({_id:req.params.id})
    .then((data)=>{
        res.status(200).json({
            result:data,
            message:'Todo get successfully !'
        })
        
    })
    .catch(()=>{
        res.status(500).json({
            error:'There was a server side error'
        })
    })

});

//POST a TODO
router.post('/',checkLogin, async (req,res)=>{

    const newTodo= new Todo({
        ...req.body,
        userId:req.userId
    });

    await newTodo.save()
    await User.updateOne(
        {_id:req.userId},
        { $push :{
            todos: [
                {
                    title:req.body.title,
                    description:req.body.description,
                    status:req.body.status
                }
            ]
        }
    }
  )
    .then(()=>{
        res.status(200).json({
            message:'Todo was inserted successfully !'
        })
    })
    .catch((err)=>{
        res.status(500).json({
            error:'There was a server side error'
        })
    })




});

//post multiple todo
router.post('/all', async (req,res)=>{
    //const newTodo=new Todo(req.body);
    await Todo.insertMany(req.body)
    .then(()=>{
        res.status(200).json("Todos were inserted successfully")
    })
    .catch((err)=>{
        res.status(500).json("There was a server side error") ;
    })

       /* await Todo.insertMany(req.body,(err)=>{
            if(err){
                res.status(500).json("There was a server side error") ;
            }
            else{
                res.status(200).json("Todos were inserted successfully")
            }
        })*/
});


//put todo
router.put('/:id', async (req,res)=>{
    const result= await Todo.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            status: req.body.status
        }
     },{
        new:true
     }).
     then((result)=>{
        res.status(200).json({
            data:result,
            message:'Todo was updated successfully'});
     })
     .catch(()=>{
        res.status(500).json("There was a server side error") ;
     })
});

////////
router.delete('/del', async(req,res)=>{
    const todo= new Todo();
    await todo.deleteByTitle()
    .then(()=>{
        res.status(200).json({
           
            message:'Todo was deleted successfully'});
     })
     .catch(()=>{
        res.status(500).json("There was a server side error") ;
     })
    
}) 


///////

//delete todo

router.delete('/:id', async (req,res)=>{
 await Todo.deleteOne({_id:req.params.id})
 .then(()=>{
    res.status(200).json({
       
        message:'Todo was deleted successfully'});
 })
 .catch(()=>{
    res.status(500).json("There was a server side error") ;
 })
});


//delete instance method





module.exports=router;


