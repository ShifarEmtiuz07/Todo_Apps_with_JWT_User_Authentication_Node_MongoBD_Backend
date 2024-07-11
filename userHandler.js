const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken'); 
const router=express.Router();
const userSchema=require('./schema/userSchema');
const tokenSchema=require('./schema/tokenSchema');
const checkLogin=require('./middleware/chechLogin')

const User= new mongoose.model('User',userSchema);
const Token= new mongoose.model('Token',tokenSchema);



//get
router.get('/get', checkLogin, async(req,res)=>{
    //console.log(req.username);
    //console.log(req.userId);

   const data= await User.find()
   //.populate('todos')
    .then((data)=>{
        res.status(200).json({
            "All user":data,

        })
    })
    .catch((err)=>{
        res.status(500).json({
            'error':'there was a server side error'
        })
    })
})



//signup
router.post('/signup', async(req,res)=>{
    const hashedPassword= await bcrypt.hash(req.body.password,10);
    const newUser= new User({
       
        name:req.body.name,
        username:req.body.username,
        password:hashedPassword,
    });
     await newUser.save()
    .then(()=>{
        res.status(200).json({message:'Signup Successfully'})
    })
    .catch(()=>{
        res.status(500).json({Error:'Signup failed... There was a server side error'});
    })
})

//login 
router.post('/login', async (req,res)=>{

     try{
        const user= await User.find({username:req.body.username})
    if(user && user.length>0){

        const isValidPassword= await bcrypt.compare(req.body.password, user[0].password);
        if(isValidPassword){
            //generate token
            const token=jwt.sign({
                username:user[0].username,
                userId:user[0]._id,

            },process.env.JWT_SECRET,{
                expiresIn:'5 days'
            });

            //save token into database
           const j_token= new Token({token, username:user[0].username});

           await j_token.save()

            .then(()=>{
                res.status(200).json({
                'access token': token,
                'message': 'Login successfull'
            });

            })
            .catch(()=>{
                res.status(401).json({
                    error:'token do not save!'
                })
               // console.log('token do not save')
            })

            /*res.status(200).json({
                'access token': token,
                'message': 'Login successfull'
            });*/



        }else{
            res.status(401).json({
                error:'Authentication failed 1!'
            })
        }


    }else{
        res.status(401).json({
            error:'Authentication failed.user not found !'
        })
    }
}



    catch{
        res.status(401).json({
            error:'Authentication failed 2 !'
        });
    }
   
});

















module.exports=router;