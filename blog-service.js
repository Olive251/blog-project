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
    fs.promises
        .readFile(pFile, 'utf8')
        .then((data) => {
            posts = JSON.parse(data);
            fs.promises
                .readFile(cFile, 'utf8')
                .then((data) => {
                    categories = JSON.parse(data);
                })
                .catch((err) => {
                    console.log(`ERROR: ${err}`);
                })
        })
        .catch((err) => {
            console.log(`ERROR: ${err}`);

        })
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
//TODO add error handling if categories array is empty
let getCategories = () =>
{
    return categories; 
}

exports.initialize = initialize;
exports.getPosts = getPosts;
exports.getPublishedPosts = getPublishedPosts;
exports.getCategories = getCategories;