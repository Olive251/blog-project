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

let initialize = (pFile, cFile) =>
{
    return new Promise((resolve, reject) => {
        fs.promises.readFile(pFile, 'utf8')
        .then((data) => {
            posts = JSON.parse(data);
            //console.log(`Posts has ${posts.length} records`);
            if (posts.length > 0){
                fs.promises.readFile(cFile, 'utf8')
                .then((data) => {
                    categories = JSON.parse(data);
                    //console.log(`Categories has ${categories.length} records.`)
                    if(categories.length > 0)
                    {
                        resolve(`Initialization complete with ${posts.length} records in posts, and ${categories.length} records in categories`);
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
            reject('No data found in categories')
        } 
        else {resolve(categories)}
    })
}

//read all the posts in posts array
let getPosts = () =>
{
    return new Promise((resolve, reject) => {
        if (posts.length === 0)
        {reject('No data found in posts')}
        else {resolve(posts)}
    })
}

//read posts in posts array, taking only the published one
let getPublishedPosts = () =>{
    return new Promise((resolve, reject) => {
        let published = [];
        if (!posts.length <= 0)
        {
            for (i=0;i<posts.length;i++)
            {
                if (posts[i].published === true)
                {
                    published.push(posts[i]);
                }
            }
            if (!published.length <=0)
            {
                resolve(published);
            } else 
            {reject("No published posts found")}
        } else 
        {reject('No data found in posts')}
    })
}

//Must return a promise
//if postData.published is undefined, explicityly set it to false, otherwise it should be set to true since "published" is triggered by a checkbox in form
//explicitly set id property to be the length of the posts array +1
//push the updated postData object onto the posts array and resolve the promise with the updated postData val
//use function in the post /posts/add route before redirecting to the /posts route
let addPost = (postData) => {

    //set published property
    if(postData.published == undefined)
    {
        postData.published = false;
    } else postData.published = true;

    //post id = length of array + 1
    postData.id = posts.length + 1;

    posts.push(postData);

}



exports.initialize = initialize;
exports.getPosts = getPosts;
exports.getPublishedPosts = getPublishedPosts;
exports.getCategories = getCategories;
exports.addPost = addPost;