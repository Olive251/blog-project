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
export function initialize(pFile, cFile) 
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
export function getAllPosts()
{
    return posts;
}

//read posts in posts array, taking only the published one
export function getPublishedPosts()
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
export function getCategories()
{
    return categories; 
}