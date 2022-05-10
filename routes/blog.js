const express = require('express');
const router = express.Router();
const blogSvc = require('../blog-service.js');
const publicRouter = require("../routes/public.js");
router.use('/public', publicRouter);

router.get('/', async(req,res) => {
    let viewData = {};

    try{
        let posts = [];
        //checking for category query
        if(req.query.ccategory) posts = await blogSvc.getPublishedPostsByCat(req.query.category);
        else posts = await blogSvc.getPublishedPosts();
        //sorting posts by date
        posts.sort((a,b) => new Date(b.post_date) - new Date(a.post_date));
        //get latest post
        let post = posts[0];
        //storing post(s) to be passed to the view
        viewData.posts = posts;
        viewData.post = post;
    }
    catch(err) {viewData.message="no results";}

    try{
        let categories = await blogSvc.getCategories();

        //store categories in viewData
        viewData.categories = categories;
    }
    catch(err){viewData.categoriesMessage = "no results";}

    res.render("blog", {data: viewData});
})

router.get('/:id', async(req,res) =>  {
    let viewData = {};

    try{
        let posts = [];

        if(req.query.category) posts = await blogSvc.getPublishedPostsByCat(req.query.cateogy);
        else posts = await blogSvc.getPublishedPosts();

        posts.sort((a,b) => new Date(b.post_date) - new Date(a.post_date))
        viewData.posts=posts;
    }
    catch(err){
        viewData.message="no results";
    }
    //getting post by id
    try{
        viewData.post = await blogSvc.getPostByID(req.params.id);
    }
    catch(err){
        viewData.message = "no results";
    }
    //getting category list
    try{
        let categories = await blogData.getCategories();
        viewData.categories = categories;
    }
    catch(err){
        viewData.categoriesMessage = "no results";
    }
    res.render("blog", {data: viewData});
})

module.exports = router;