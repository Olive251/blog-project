const express = require('express');
const router = express.Router();
const blogSvc = require('../blog-service.js');
const publicRouter = require("../routes/public.js");
router.use('/public', publicRouter);

router.get('/',  (req,res) => {
    blogSvc.getCategories()
    .then((data) => {
        res.render('categories', {category: data});
    })
    .catch((error) =>{
        res.render('categories', {message: error});
    })
})

module.exports = router;