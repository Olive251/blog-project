/*****************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Olivia Brown Student ID: 112582192 Date: March 11, 2022
*
* Online (Heroku) URL:
*
* GitHub Repository URL: https://github.com/Olive251/web322-app/tree/assignment-5
*           !!!(IN THE ASSIGNMENT-5 BRANCH)!!!
*
******************************************************************************/
const express = require("express");
const handlebars = require('express-handlebars');
const path = require("path");
const bSvc = require("./blog-service.js");
const streamifier = require("streamifier");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stripJs = require('strip-js');
//router includes
const aboutRouter = require("./routes/about.js");
const postsRouter = require("./routes/posts.js");
const blogRouter = require("./routes/blog.js");
const addPostRouter = require("./routes/addPost.js");
//cloudinary
cloudinary.config({ 
    cloud_name: 'dypd4xgsd', 
    api_key: '416493844922892', 
    api_secret: 'hyT9Ji0PUjM-adFdFg81rnQgUww' 
})
//multer setup
const upload = multer(); //Disk storage not used
//handlebars setup
const hbs = handlebars.create({
    extname: '.hbs',
    //custom helpers
    helpers: {
        navLink: (url, options) => {
            return'<li' +
                ((url == app.locals.activeRoute)? 'class="active"':"") +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: (lvalue, rvalue, options) => {
            if (isArgumentsObject.length < 3){
                throw new Error(`Handlbars helper "EQUAL" needs 2 parameters`);
            }
            if (lvalue != rvalue){
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: (context) => {
            return stripJs(context);
        }
    }
})
//express setup
const app = express();
app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));
//added per assignment instructions
app.use((req,res,next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/,"");
    app.locals.viewingCategory = req.query.category;
    next();
})

const port = process.env.PORT || 8080;

const cFile = (path.join(__dirname, "data", "categories.json"));
const pFile = (path.join(__dirname, "data", "posts.json"));


//ROUTES
//**********************************************/
app.get('/', async(req,res) => {
    let viewData = {};

    try{
        let posts = [];
        //checking for category query
        if(req.query.ccategory) posts = await bSvc.getPublishedPostsByCat(req.query.category);
        else posts = await bSvc.getPublishedPosts();
        //sorting posts by date
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
        //get latest post
        let post = posts[0];
        //storing post(s) to be passed to the view
        viewData.posts = posts;
        viewData.post = post;
    }
    catch(err) {viewData.message="no results";}

    try{
        let categories = await bSvc.getCategories();

        //store categories in viewData
        viewData.categories = categories;
    }
    catch(err){viewData.categoriesMessage = "no results";}

    res.render("blog", {data: viewData});
})

app.use('/about', aboutRouter);
app.use('/posts', postsRouter);

app.get('/public/css/main.css', (req, res) =>{
    res.send()
})

app.get('/blog', async(req,res) => {
    let viewData = {};

    try{
        let posts = [];
        //checking for category query
        if(req.query.ccategory) posts = await bSvc.getPublishedPostsByCat(req.query.category);
        else posts = await bSvc.getPublishedPosts();
        //sorting posts by date
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
        //get latest post
        let post = posts[0];
        //storing post(s) to be passed to the view
        viewData.posts = posts;
        viewData.post = post;
    }
    catch(err) {viewData.message="no results";}

    try{
        let categories = await bSvc.getCategories();

        //store categories in viewData
        viewData.categories = categories;
    }
    catch(err){viewData.categoriesMessage = "no results";}

    res.render("blog", {data: viewData});
})

app.get('/blog/:id', async(req,res) =>  {
    let viewData = {};

    try{
        let posts = [];

        if(req.query.category) posts = await bSvc.getPublishedPostsByCat(req.query.cateogy);
        else posts = await bSvc.getPublishedPosts();

        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate))
        viewData.posts=posts;
    }
    catch(err){
        viewData.message="no results";
    }
    //getting post by id
    try{
        viewData.post = await bSvc.getPostByID(req.params.id);
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
//displays the contents of the categories array
app.get('/categories',  (req,res) => {
    bSvc.getCategories()
    .then((data) => {
        res.render('categories', {category: data});
    })
    .catch((error) =>{
        res.render('categories', {message: error});
    })
})
//404 error handler
app.use((req,res) => {
    res.status(404).render('404');
    
})
//initializes posts and categories arrays before activating server
bSvc.initialize(pFile, cFile)
.then((message) => {
    console.log(message);
    app.listen(port, () =>{
        console.log(`App is listening at ${port}`);
    })
})
.catch((message) =>{
    console.log(message);
})