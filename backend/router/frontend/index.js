const express=require('express');
const jwt=require('jsonwebtoken');
const User=require('../../database/mongodb/Schema/users');
const frontend=express.Router();
frontend.post('/authenticate',(req,res)=>{
    User.findOne({email:req.body.email},(err,user)=>{
        if(err) throw err;
        if(!user){
            res.json({success:false,message:'Authentication failed. User not found.'});
        }else if(user){
            user.comparePassword(req.body.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    user.generateAutho((err,user)=>{
                        if(err) throw err;
                        res.json({success:true,message:'Authentication successed.',autho:user.autho,type:user.type});
                    });
                }else{
                    res.json({success:false,message:'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});
frontend.use((req,res,next)=>{
    var autho=req.body.autho||req.query.autho||req.headers['x-access-token'];
    if(autho){
        jwt.verify(autho,process.env.SECRET,(err,decoded)=>{
            if(err){
                return res.json({success:false,message:'Failed to authenticate token.'});
            }else{
                req.decoded=decoded;
                next();
            }
        });
    }else{
        return res.status(403).send({
            success:false,
            message:'No token provided.'
        });
    }
})
module.exports=frontend;