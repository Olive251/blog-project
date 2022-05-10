const express = require('express');
const router = express.Router();
const blogSvc = require('../blog-service.js');
const publicRouter = require("../routes/public.js");
router.use('/public', publicRouter);

let ensureLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// This route gets and displays all the categories.
router.get('/', ensureLogin, (req,res) => {
    blogSvc.getCategories()
    .then((data) => {
      if(data.length > 0) {
        res.render("categories", { category: data});
    }
    else {
        res.render("categories", { message: "no categories here" });
    }
  })
});

// This route displays the interface to add a category
router.get('/add', ensureLogin, (req,res) => {
    res.render('addCategory');
})

// This is the route to add a catgeory. It also redirects to the categories page after submission
router.post('/add', ensureLogin, (req,res) => {
    blogSvc.addCategory(req.body)
    .then(() => {
      res.redirect("/categories");
      })
      .catch((error) =>{
      res.render('categories', {message: error});
    })
})

// This is the route to delete a category by it's id
router.get("/delete/:id", ensureLogin, (req, res) => 
{
  blogSvc.deleteCategory(req.params.id)
  .then(() => 
  {
    res.redirect("/categories");
  })
  .catch((error) => 
  {
    res.render(('categories', {message: error}));
  })
})

module.exports = router;