/*****************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Olivia Brown Student ID: 112582192 Date: Feb 4, 2022
*
* Online (Heroku) URL: https://agile-bastion-97856.herokuapp.com/
*
* GitHub Repository URL: https://github.com/Olive251/web322-app
*
******************************************************************************/
const xps = require("express");
const path = require("path");
const bSvc = require("./blog-service.js");
const streamifier = require("streamifier");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dypd4xgsd', 
    api_key: '416493844922892', 
    api_secret: 'hyT9Ji0PUjM-adFdFg81rnQgUww' 
});

const upload = multer(); //Disk storage not used

const app = xps();

app.use(xps.static("./views/"));

const port = process.env.PORT || 8080;

const cFile = (path.join(__dirname, "data", "categories.json"));
const pFile = (path.join(__dirname, "data", "posts.json"));

//ROUTES
//**********************************************/
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
})
app.get('/about', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
})
app.get('/posts/add', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'addPost.html'));
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
//displays the contents of the posts array
app.get('/posts', (req,res) => {
    bSvc.getPosts()
    .then((message) => {
        res.send(message);
    })
    .catch((message) => {
        res.send(message);
    })
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