const express = require('express');
const router = express.Router();
const bSvc = require('../blog-service.js');

//Posts main
router.get('/', (req,res) => {    
    if (req.query.category !== undefined)
    {
        bSvc.getPostsByCategory(req.query.category)
        .then((data) => {
            res.render('posts', {post: data});
        })
        .catch((message) => {
            res.render('posts', {error: message});
        })
    } 
    else if (req.query.minDate !== undefined)
    {
        console.log(`minDate search received: ${req.query.minDate}`);
        bSvc.getPostsByMinDate(req.query.minDate)
        .then((data) => {res.render('posts', {post: data});})
        .catch((error) => {res.render('posts', {error: error});})
    }
    else {
        bSvc.getPosts()
    .then((data) => {
            res.render('posts', {post: data} );
    })
    .catch((error) => {
        res.render('posts', {message: error});
    }) 
    }       
})
router.get('/:postID', (req, res) => {
    bSvc.getPostByID(req.params.postID)
    .then((data) => {
        res.render('posts', {post: data});
    })
    .catch((err)=> {
        res.render('posts', {message: err});
    })
})

module.exports = router;