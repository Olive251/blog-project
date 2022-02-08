/*****************************************************************************
****
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
******************************************************************************
**/


const xps = require("express");
const res = require("express/lib/response");
const path = require("path");
const bSvc = require("./blog-service.js");

const app = xps();

app.use(xps.static("./views/"));

const port = 8080;

const cFile = (path.join(__dirname, "data", "categories.json"));
const pFile = (path.join(__dirname, "data", "posts.json"));


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
})
app.get('/about', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
})

//displays records in posts array where published == true
app.get('/blog', (req,res) => {
    res.send(bSvc.getPublishedPosts());
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
        console.log(`App is listening at http://localhost:${port}`);
    })
})
.catch((message) =>{
    console.log(message);
})