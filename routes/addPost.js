

app.get('/posts/add', (req,res) => {
    res.render('addPost');
})
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