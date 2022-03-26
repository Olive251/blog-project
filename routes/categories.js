const express = require('express');
const router = express.Router();
const blogSvc = require('../blog-service.js');
const publicRouter = require("../routes/public.js");
router.use('/public', publicRouter);

router.get('/',  (req,res) => {
    blogSvc.getCategories()
    .then((data) => {
        res.render('categories', {message: "Unable to load categories"});
    })
    .catch((error) =>{
        res.render('categories', {message: error});
    })
})
router.get('/add', (req,res) => {
    res.render('addCategory');
})
router.post('/add', (req,res)=> {
    blogSvc.addCategory(req.body)
    .then(
        blogSvc.getCategories()
        .then((data) => {
            res.render('categories', {message: "Unable to load categories"});
        })
        .catch((error) =>{
            res.render('categories', {message: error});
    })) 
})

module.exports = router;