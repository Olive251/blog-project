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

//update to send JSON formatted string containing all posts in posts.json with published==true
app.get('/blog', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'blog.html'));
})

//json string all posts in posts.json
app.get('/posts', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'posts.html'));
})

//json string categories in categories.json
app.get('/categories', (req,res) => {
    bSvc.initialize(pFile, cFile);
    res.send(bSvc.getCategories());

})

//add 404 error handler
app.use((req,res) => {
    res.status(404).send('ERROR: 404! Page not found.');
})

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
})