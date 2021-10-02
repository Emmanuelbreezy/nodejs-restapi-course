const express = require('express');
const { body} = require('express-validator');

const feedController = require('../controller/feed.controller');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/create-post',isAuth,[
    body('title')
       .trim()
       .isLength({min:7}),
    body('content')
        .trim()
        .isLength({min:7}),
],
feedController.createPost);


router.get('/posts',isAuth,feedController.getPosts);
router.get('/post/:postId',isAuth,feedController.getSinglePost);


router.put('/post/:postId',isAuth,[
        body('title')
        .trim()
        .isLength({min:7}),
    body('content')
         .trim()
         .isLength({min:7}),
], feedController.updatePost)

router.delete('/post/:postId',isAuth,feedController.deletePost);

module.exports = router;