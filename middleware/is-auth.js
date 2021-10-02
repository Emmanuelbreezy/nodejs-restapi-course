const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
   const authHeader = req.get('Authorization');
   if(!authHeader){
        const error = new Error('not authenticated');
        error.statusCode = 401;
        throw error;
   }
   const token = authHeader.split(' ')[1];
   let decodedToken;

   try{
       decodedToken = jwt.verify(token, 'c559b883-cae9-4039-8029-3ced8f27df88');
   }catch(err){
       err.statusCode = 500;
       throw 500;
   }

   if(!decodedToken){
        const error = new Error('not authenticated');
        error.statusCode = 401;
        throw error;
   }
   req.userId = decodedToken.userId;
   next()
};