const express=require('express');
const jwt=require('jsonwebtoken');
const User=require('../../database/mongodb/Schema/users');
const Query=require('../../database/mongodb/Schema/queries');
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
            name:req.body.name,
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
// frontend.use((req,res,next)=>{
//     var autho=req.body.autho||req.query.autho||req.headers['x-access-token'];
//     if(autho){
//         jwt.verify(autho,process.env.SECRET,(err,decoded)=>{
//             if(err){
//                 return res.json({success:false,message:'Failed to authenticate token.'});
//             }else{
//                 req.decoded=decoded;
//                 next();
//             }
//         });
//     }else{
//         return res.status(403).send({
//             success:false,
//             message:'No token provided.'
//         });
//     }
// })

frontend.get('/users', (req, res) => {
    try {
        const type = req.query.type;
        const name = req.query.name;

        let query = { type: { $in: ['driver', 'worker'] } };

        if (type) {
            query.type = type;
        }

        if (name) {
            query.name = { $regex: new RegExp(name), $options: 'i' };
        }

        User.find(query, 'name type History total').then(users => {
            res.json({ success: true, message: 'Get users succeeded', users: users });
        }).catch(err => {
            throw err;
        });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Get users failed' + err });
    }
});

frontend.delete('/queries/:id',(req,res)=>{
    try{
        const id=req.params.id;
        Query.findByIdAndDelete(id).then(query=>{
            res.json({success:true,message:'Delete queries succeeded',query:query});
        }).catch(err=>{
            throw err;
        });
    }
    catch(err){
        res.status(401).json({success:false,message:'Delete queries failed'+err});
    }
})
frontend.put('/queries/:id',(req,res)=>{
    try{
        const id=req.params.id;
        Query.findByIdAndUpdate(id,{$set:{status:true}}).then(query=>{
            res.json({success:true,message:'Update queries succeeded',query:query});
        }).catch(err=>{
            throw err;
        });
    }
    catch(err){
        res.status(401).json({success:false,message:'Update queries failed'+err});
    }
});
frontend.post('/queries',(req,res)=>{
    try{
        const newQuery=new Query({
            user:req.body.user,
            description:req.body.description
        });
        newQuery.save().then(query=>{
            User.findByIdAndUpdate(req.body.user,{$push:{queries:query._id}}).then(user=>{
                res.json({success:true,message:'Post queries succeeded',query:query});
            }).catch(err=>{
                throw err;
            });
        }).catch(err=>{
            throw err;
        });
    }
    catch(err){
        res.status(401).json({success:false,message:'Post queries failed'+err});
    }
})

frontend.get('/queries',(req,res)=>{
    try{
        const status=false;
        const queries=Query.find({status:status}).populate('user','name email').then(queries=>{
            res.json({success:true,message:'Get queries succeeded',queries:queries});
        }).catch(err=>{
            throw err;
        });
    }
    catch(err){
        res.status(401).json({success:false,message:'Get queries failed'+err});
    }
})
module.exports=frontend;