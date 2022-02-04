/*****************************************************************************
****
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Olivia Brown Student ID: 112582192 Date: Feb 4, 2022
*
* Online (Heroku) URL: ________________________________________________________
*
* GitHub Repository URL: ______________________________________________________
*
******************************************************************************
**/

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
    if (categories.length === 0)
    {return "No data found."}
    return categories; 
}

//read all the posts in posts array
let getPosts = () =>
{
    if (posts.length === 0) return "No data found.";
    else return posts;
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
    if (published.length === 0) return "No data found.";
    else return published;
}



exports.initialize = initialize;
exports.getPosts = getPosts;
exports.getPublishedPosts = getPublishedPosts;
exports.getCategories = getCategories;