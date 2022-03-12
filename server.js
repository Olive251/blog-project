/*****************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Olivia Brown Student ID: 112582192 Date: March 11, 2022
*
* Online (Heroku) URL: https://web322-assignment4-oliviabrown.herokuapp.com/
*
* GitHub Repository URL: https://github.com/Olive251/web322-app/tree/assignment-4
*           !!!(IN THE ASSIGNMENT-PART-4 BRANCH)!!!
*
******************************************************************************/
const xps = require("express");
const handlebars = require('express-handlebars');
const path = require("path");
const bSvc = require("./blog-service.js");
const streamifier = require("streamifier");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stripJs = require('strip-js');

cloudinary.config({ 
    cloud_name: 'dypd4xgsd', 
    api_key: '416493844922892', 
    api_secret: 'hyT9Ji0PUjM-adFdFg81rnQgUww' 
});

const upload = multer(); //Disk storage not used

const app = xps();

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

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

const port = process.env.PORT || 8080;

const cFile = (path.join(__dirname, "data", "categories.json"));
const pFile = (path.join(__dirname, "data", "posts.json"));

//added per assignment instructions
app.use((req,res,next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/,"");
    app.locals.viewingCategory = req.query.category;
    next();
})
app.use(xps.static('public'));

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

app.get('/about', (req,res) => {
    res.render('about');
})
app.get('/posts/add', (req,res) => {
    res.render('addPost');
})
app.get('/public/css/main.css', (req, res) =>{
    res.send()
})
//post route for adding blog posts
app.post('/posts/add', upload.single("featureImage"), (req, res) => {
    
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if(result){
                        console.log(result);
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        })
    }
    async function upload(req) {
        let result = await streamUpload(req); 
        return result; 
    }
    upload(req)
    .then((uploaded) => {
        req.body.featureImage = uploaded.url;
    
        bSvc.addPost(req.body)
        .then(bSvc.getPosts()
            .then((data)=> {
                let address = (data.length) -1;
                res.send(data[address]);
            }))            
        .catch(res.send)       
    })
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
//displays the contents of the posts array
app.get('/posts', (req,res) => {    
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
app.get('/posts/:postID', (req, res) => {
    bSvc.getPostByID(req.params.postID)
    .then((data) => {
        res.render('posts', {post: data});
    })
    .catch((err)=> {
        res.render('posts', {message: err});
    })
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