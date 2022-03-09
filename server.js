/*****************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Olivia Brown Student ID: 112582192 Date: Feb 18, 2022
*
* Online (Heroku) URL: https://web322-assignment3-oliviabrown.herokuapp.com/
*
* GitHub Repository URL: https://github.com/Olive251/web322-app
*           !!!(IN THE ASSIGNMENT-PART-3 BRANCH)!!!
*
******************************************************************************/
const xps = require("express");
const handlebars = require('express-handlebars');
const path = require("path");
const bSvc = require("./blog-service.js");
const streamifier = require("streamifier");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;




//cloudinary settings
cloudinary.config({ 
    cloud_name: 'dypd4xgsd', 
    api_key: '416493844922892', 
    api_secret: 'hyT9Ji0PUjM-adFdFg81rnQgUww' 
});

//multer settings
const upload = multer(); //Disk storage not used

//app using express
const app = xps();

//handlebars helpers
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
                throw new Error("Handlbars Helper EQUAL needs 2 parameters");
            }
            if (lvalue != rvalue){
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
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

//ROUTES
//**********************************************/
app.get('/', (req,res) => {
    res.render('about');
})
app.get('/about', (req,res) => {
    res.render('about');
})
app.get('/posts/add', (req,res) => {
    res.render('addPost');
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
                        rejects(error);
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
    upload(req) //should add means of handle if photo not uploaded
    .then((uploaded) => {
        req.body.featureImage = uploaded.url;
    
        bSvc.addPost(req.body)
        .then(bSvc.getPosts()
            .then((message)=> {
                res.send(message);
            }))            
        .catch(res.send)        
    })
})
//displays records in posts array where published == true
app.get('/blog', (req,res) => {
    bSvc.getPublishedPosts()
    .then((message) => {
        res.send(message);
    })
    .catch((message) => {
        res.send(message);
    })
})
app.get('/posts/:postID', (req, res) => {
    bSvc.getPostByID(req.params.postID)
    .then((message) => {
        res.send(message);
    })
    .catch((message)=> {
        res.send(message);
    })
})
//displays the contents of the posts array
app.get('/posts', (req,res) => {    
    if (req.query.category !== undefined)
    {
        bSvc.getPostsByCategory(req.query.category)
        .then((message) => {res.send(message);})
        .catch((message) => {res.send(message);})
    } 
    else if (req.query.minDate !== undefined)
    {
        console.log(`minDate search received: ${req.query.minDate}`);
        bSvc.getPostsByMinDate(req.query.minDate)
        .then((message) => {res.send(message);})
        .catch((message) => {res.send(message);})
    }
    else {
        bSvc.getPosts()
    .then((message) => {
        res.send(message);
    })
    .catch((message) => {
        res.send(message);
    }) 
    }       
})

//displays the contents of the categories array
app.get('/categories',  (req,res) => {
    bSvc.getCategories()
    .then((message) => {
        res.send(message);
    })
    .catch((message) =>{
        res.send(message);
    })
})
//404 error handler
app.use((req,res) => {
    res.status(404).send('ERROR: 404! Page not found.');
    
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