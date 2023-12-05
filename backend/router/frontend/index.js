const express=require('express');
const jwt=require('jsonwebtoken');
const User=require('../../database/mongodb/Schema/users');
const frontend=express.Router();
frontend.post('/authenticate', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
            } else {
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        user.generateAutho()
                            .then(user => {
                                res.json({ success: true, message: 'Authentication succeeded.', autho: user.autho, type: user.type });
                            })
                            .catch(err => {
                                throw err;
                            });
                    } else {
                        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
                    }
                });
            }
        })
        .catch(err => {
            throw err;
        });
});
frontend.post('/register',async(req,res)=>{
    try{
        var newUser=new User({
            email:req.body.email,
            password:req.body.password,
            type:req.body.type
        });
        await newUser.generateAutho();
        await newUser.save();
        res.json({success:true,message:'Register successed',autho:newUser.autho,type:newUser.type});
    }
    catch(err){
        res.status(401).json({success:false,message:'Register failed'+err});
    }
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