//Online (Heroku) URL: https://assignment6-web322-obrown.herokuapp.com/

//INCLUDES
const express = require("express");
const handlebars = require('express-handlebars');
const path = require("path");
const blogSvc = require("./blog-service.js");
const stripJs = require('strip-js');
const clientSessions = require('client-sessions')
const authData = require('./auth-service')
//routers
const aboutRouter = require("./routes/about.js");
const postsRouter = require("./routes/posts.js");
const blogRouter = require("./routes/blog.js");
const categoriesRouter = require("./routes/categories.js");
const publicRouter = require("./routes/public.js");
const loginRouter = require("./routes/login.js")
/**************************************************************************/
//handlebars setup
const hbs = handlebars.create({
    extname: '.hbs',
    //handlebars custom helpers
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
        },
        formatDate: function(dateObj)
        {
            let year = datObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
        }
    }
})
//express setup
const app = express();
app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
//added per assignment instructions
app.use((req,res,next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/,"");
    app.locals.viewingCategory = req.query.category;
    next();
})
// Added client sessions setup for assignment 6 - auth
app.use(clientSessions({
  cookieName: "session",
  secret: "web322_assignment6",
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60,
}))
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
})

//LOGIN
//**********************************************/
module.exports.ensureLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

const port = process.env.PORT || 8080;

//storage for data
const cFile = (path.join(__dirname, "data", "categories.json"));
const pFile = (path.join(__dirname, "data", "posts.json"));

//ROUTES
//**********************************************/
app.get('/', async(req,res) => {
    let viewData = {};

    try{
        let posts = [];
        //checking for category query
        if(req.query.category) posts = await blogSvc.getPublishedPostsByCategory(req.query.category);
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

app.use('/about', aboutRouter);
app.use('/posts', postsRouter);
app.use('/blog', blogRouter);
app.use('/categories', categoriesRouter);
app.use('/public', publicRouter);
app.use('/login', loginRouter);

//404 error handler
app.use((req,res) => {
    res.status(404).render('404');
    
})
//initializes posts and categories arrays before activating server
blogSvc.initialize(pFile, cFile)
.then(authData.initalize)
.then((message) => {
    console.log(message);
    app.listen(port, () =>{
        console.log(`App is listening at ${port}`);
    })
})
.catch((message) =>{
    console.log(message);
})

