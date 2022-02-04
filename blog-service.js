//Olivia Brown
//112582192
//obrown11@myseneca.ca
//

const fs = require("fs");

let posts = [];
let categories = [];

//Each function needs to have error hadling


/*
-read the json files and place them into the proper array
-first read and assign the posts file contents to the posts array
-once that succeeds, read and assign cat file contents to its array
-must be async to read the file
*/
let initialize = (pFile, cFile) => 
{
    let pFileRead = false;
    fs.readFile(pFile,'utf8', (err,data) => {
        if(err) throw err;
        posts = (json.Parse(data));
        pFileRead = true;
    })

    if (pFileRead == true)
    {
        fs.readFile(cFile,'utf8', (err,data) => {
            if(err) throw err;
            posts = (json.Parse(data));
        })
    }
}

//read all the posts in posts array
let getPosts = () =>
{
    return posts;
}

//read posts in posts array, taking only the published one
//export function getPublishedPosts()
let getPublishedPosts = () =>
{
    let published = posts.map((post) => {
        if (post.published == true)
        {
            return post;
        }
    })

    return published;
}

//read categories json and put all into categories array
//export function getCategories()
let getCategories = () =>
{
    return categories; 
}

exports.initialize = initialize;
exports.getPosts = getPosts;
exports.getPublishedPosts = getPublishedPosts;
exports.getCategories = getCategories;