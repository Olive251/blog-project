const express = require('express');
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const publicRouter = require("../routes/public.js");
router.use('/public', publicRouter);
const authData = require("../auth-service")

//cloudinary
cloudinary.config({ 
  cloud_name: 'dypd4xgsd', 
  api_key: '416493844922892', 
  api_secret: 'hyT9Ji0PUjM-adFdFg81rnQgUww' 
})

const upload = multer(); //Disk storage not used

//Posts main, this gets all the posts
router.get("/", (req,res) => {
  res.render("login");
})

router.get("/register", (req,res) => {
  res.render("register");
})

router.post("/register", (req,res) => {
  authData.registerUser(req.body)
    .then(() => res.render("register", {successMessage: "User created" } ))
    .catch((error) => res.render("register", {errorMessage: error, userName: req.body.userName }) )
});

router.post("/", (req,res) => {
  req.body.userAgent = req.get('User-Agent');
  console.log(req.body)
  authData.checkUser(req.body)
    .then((user) => {
      req.session.user = {
      userName: user.userName, // authenticated user's userName
      email: user.email, // authenticated user's email
      loginHistory: user.loginHistory, // authenticated user's loginHistory
      }
      res.redirect("/posts");
    })
    .catch((error) => res.render("/register", {errorMessage: error, userName: req.body.userName }) )
});

router.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

router.get("/userHistory", (req, res) => {
  res.render("userHistory");
});

module.exports = router;