const express = require('express');
const router = express.Router();
const blogSvc = require('../blog-service.js');
const streamifier = require("streamifier");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const publicRouter = require("../routes/public.js");
router.use('/public', publicRouter);

//cloudinary
cloudinary.config({ 
    cloud_name: 'dypd4xgsd', 
    api_key: '416493844922892', 
    api_secret: 'hyT9Ji0PUjM-adFdFg81rnQgUww' 
})

const upload = multer(); //Disk storage not used

let ensureLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

//Posts main, this gets all the posts
router.get('/', ensureLogin, (req,res) => {    
    if (req.query.category !== undefined)
    {
        blogSvc.getPostsByCategory(req.query.category)
        .then((data) => {
            res.render("posts", {post: data});
        })
        .catch(() => {
            res.render("posts", {message: "No Posts to display"});
        })
    } 
    else if (req.query.minDate != null && req.query.minDate != "")
    {
        console.log(`minDate search received: ${req.query.minDate}`);
        blogSvc.getPostsByMinDate(req.query.minDate)
        .then((data) => {res.render("posts", {post: data});})
        .catch((error) => {res.render("posts", {error: error});})
    }
    else {
        blogSvc.getPosts()
    .then((data) => {
      if(data.length > 0) {
        res.render("posts", {post: data});
      } else {
        res.render("posts", {message: 'No Posts to display'})
      }
    })
    .catch((error) => {
        res.render("posts", {message: error});
    }) 
    }       
})

// This route shows the addPost view
router.get('/add', ensureLogin, (req,res) => {
    res.render('addPost');
})

// This route adds the post and then redirects to the Posts view
router.post('/add', ensureLogin, upload.single("feature_img"), (req, res) => {
    if(req.file){
      let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                      if(result){
                          resolve(result);
                      } else {
                          reject(error);
                      }
                  }
              );
              streamifier.createReadStream(req.file.buffer).pipe(stream);
          })
      };
      async function upload(req) {
          let result = await streamUpload(req);
          console.log(result)
          return result; 
      }
      upload(req)
      .then((uploaded) => {
          handlePost(uploaded.url)
      });  
      } else {
        handlePost("")
      }
      let handlePost = (image) => {
        req.body.feature_img = image;
        blogSvc.addPost(req.body)
          .then(()=> {
              res.redirect('/posts');
        })            
        .catch((error) => console.log(error))      
        }
});

// This is the route to get the post by the ID
router.get('/:id', ensureLogin, (req, res) => {
    blogSvc.getPostByID(req.params.value)
    .then((data) => {
        viewData = data
        res.render('/', {post: viewData});
    })
    .catch((error)=> {
        res.render('/', {message: error});
    })
})

// This is the route to delete a post by it's id
router.get("/delete/:id", ensureLogin, (req, res) => 
{
  blogSvc.deletePost(req.params.id)
  .then(() => 
  {
    res.redirect("/posts");
  })
  .catch((error) => 
  {
    res.render(('categories', {message: error}));
  })
})

module.exports = router;