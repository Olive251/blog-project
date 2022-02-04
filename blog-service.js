//Olivia Brown
//112582192
//obrown11@myseneca.ca
//

const fs = require("fs");

let posts = [];
let categories = [];

//Each function needs to have error hadling


/*
-reads json files and puts them into arrays
-added the awaits because categories array was loading as empty first time categories is loaded
*/
let initialize = async (pFile, cFile) => 
{
    await fs.promises
        .readFile(pFile, 'utf8')
        .then( async (data) => {
            posts = JSON.parse(data);
            await fs.promises 
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

let getCategories = () =>
{
    if (length.categories === 0)
    {return "No results returned"}
    return categories; 
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
    let published = [];

    for (i=0;i<posts.length;i++)
    {
        if (posts[i].published === true)
        {
            published.push(posts[i]);
        }
    }
    return published;
}



exports.initialize = initialize;
exports.getPosts = getPosts;
exports.getPublishedPosts = getPublishedPosts;
exports.getCategories = getCategories;