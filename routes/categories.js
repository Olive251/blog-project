const express = require('express');
const router = express.Router();
const bSvc = require('../blog-service.js');

router.get('/',  (req,res) => {
    bSvc.getCategories()
    .then((data) => {
        res.render('categories', {category: data});
    })
    .catch((error) =>{
        res.render('categories', {message: error});
    })
})

module.exports = router;