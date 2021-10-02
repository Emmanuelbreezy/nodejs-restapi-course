const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const feedRoute = require('./routes/feed.route');
const authRoute = require('./routes/auth.route');
const MONGODB_URI = 'mongodb+srv://Emmanuel:B55nWv_-JL2N-Xw@cluster0.wo1wx.mongodb.net/shop';


const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  path.join('images/'));
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() +'-'+ file.originalname);
    }
});

const fileFilter = (req, file,cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype){
        cb(null, true);
    }else{
        cb(null, false);
    }
    
}

app.use(bodyParser.json());
app.use(multer({storage: fileStorage,fileFilter:fileFilter}).single('image'));
app.use('/static/images',express.static(path.join(__dirname, 'images')));


app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/auth',authRoute);
app.use('/api/feed',feedRoute);
app.use((error,req,res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message:message
    });
});

mongoose.connect(MONGODB_URI).then( result => {
    app.listen(8000);
 
}).catch(err => console.log(err))