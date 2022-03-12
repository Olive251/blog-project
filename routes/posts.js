const express = require('express');
const router = express.Router();
const bSvc = require('../blog-service.js');
const streamifier = require("streamifier");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

//cloudinary
cloudinary.config({ 
    cloud_name: 'dypd4xgsd', 
    api_key: '416493844922892', 
    api_secret: 'hyT9Ji0PUjM-adFdFg81rnQgUww' 
})

const upload = multer(); //Disk storage not used

//Posts main
router.get('/', (req,res) => {    
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
// /posts/add
router.get('/add', (req,res) => {
    res.render('addPost');
})
router.post('/add', upload.single("featureImage"), (req, res) => {
    
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
//variable
router.get('/:postID', (req, res) => {
    bSvc.getPostByID(req.params.postID)
    .then((data) => {
        res.render('posts', {post: data});
    })
    .catch((err)=> {
        res.render('posts', {message: err});
    })
})

module.exports = router;