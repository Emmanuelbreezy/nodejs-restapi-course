const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

//USING async & await 
exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw errors;
    }
    const email = req.body.email;
    const name  = req.body.name;
    const password = req.body.password;

    console.log(email,name,password,' ');
    
    try{
    const hashedPw = await bcrypt.hash(password, 12)

    const user = new User({
        email:email,
        password:hashedPw,
        name:name
    });
    const result = await user.save();
    res.status(201).json({message:'User created',userId: result._id})

    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }




}

exports.login = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   let loadedUser;
   User.findOne({email: email})
       .then(user => {
           if(!user){
               const error = new Error('A user with this email could not be found');
               error.statusCode = 401;
               throw error;
           }
           loadedUser = user;
           return bcrypt.compare(password, user.password);

       })
       .then(isEqual => {
           if(!isEqual){
            const error = new Error('wrong password');
            error.statusCode = 401;
            throw error;
           }
           //
           const token = jwt.sign({
               email: loadedUser.email,
               userId: loadedUser._id.toString()
           },'c559b883-cae9-4039-8029-3ced8f27df88',{
               expiresIn:'1h'
           });
          res.status(200).json({
              token: token,
              userId: loadedUser._id.toString(),
              message:'login granted access'
          })
       })
       .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
       })
}