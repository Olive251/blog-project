/*****************************************************************************
****
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Olivia Brown Student ID: 112582192 Date: Feb 4, 2022
*
* Online (Heroku) URL: https://agile-bastion-97856.herokuapp.com/
*
* GitHub Repository URL: https://github.com/Olive251/web322-app
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

/*let initialize = async (pFile, cFile) => 
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
}*/

let initialize = (pFile, cFile) =>
{
    return new Promise((resolve, reject) => {
        fs.readFile(pFile, 'utf8')
        .then((data) => {
            posts = JSON.parse(data);
            if (length.posts > 0){
                fs.readFile(cFile, 'utf8')
                .then((data) => {
                    categories = JSON.parse(data);
                    if(length.categories > 0)
                    {
                        resolve(`Initialization complete with ${length.posts} records in posts, and ${length.categories} records in categories`);
                    } else {
                        reject(`Initialization failed. No data found.`);
                    }
                })
                .catch((err) => {
                    reject(`Initialization failed!\nERROR: ${err}`);
                })
            } else{
                reject(`Initialization failed! No data found.`);
            }
        })
        .catch((err) => {
            reject(`Initialization failed!\nERROR: ${err}`);
        })
    })
}

let getCategories = () =>
{
    return new Promise((resolve, reject) => {
        if (categories.length === 0)
        {
            reject('No data found')
        } 
        else {resolve(categories)}
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