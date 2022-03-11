/*****************************************************************************
****
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Olivia Brown Student ID: 112582192 Date: March 11, 2022
*
* Online (Heroku) URL: https://web322-assignment3-oliviabrown.herokuapp.com/
*
* GitHub Repository URL: 
*           !!!(IN THE ASSIGNMENT-PART-4 BRANCH)!!!
*
******************************************************************************/
const fs = require("fs");

let posts = [];
let categories = [];

//Each function needs to have error hadling

let verifyArray = (array) =>
{
    let verification;
    if (array.length < 1) verification = false;
    else verification = true;

    return verification;
}

let dateStrComp = (postDate, searchDate) =>
{
    let pDate = new Date(postDate);
    let sDate = new Date(searchDate);
    return (pDate >= sDate);
}

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
                    reject(`Initialization failed!\n${err}`);
                })
            } else{
                reject(`Initialization failed! No data found.`);
            }
        })
        .catch((err) => {
            reject(`Initialization failed!\n${err}`);
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

let getPosts = () =>
{
    return new Promise((resolve, reject) => {
        if (posts.length === 0)
        {reject('No posts found')}
        else {resolve(posts)}
    })
}

let getPostsByCategory = (categoryID) => {
    return new Promise((resolve, reject) => {
        selection = [];
        if (!verifyArray(posts))//(posts.length === 0)
        { reject('No posts found')}
        else
        {
            for (i=0;i<posts.length;i++)
            {
                if (posts[i].category == categoryID) {
                    selection.push(posts[i]);
                }
            }
            if (selection.length < 1){
                reject(`No posts found in categoryID "${categoryID}"`);
            }
            else {
                resolve(selection);
            }
        }
    })
}

let getPostsByMinDate= (minDateStr) => 
{
    return new Promise ((resolve, reject) => {
        selection = [];
        if (!verifyArray(posts))
        {
            reject('No posts found')
        }
        else 
        {
            for (i=0;i<posts.length;i++)
            {
                if (dateStrComp(posts[i].postDate, minDateStr))
                {
                    console.log(dateStrComp(posts[i].postDate, minDateStr));
                    selection.push(posts[i]);
                }
            }
            if (selection.length < 1) reject(`No posts found after ${minDateStr}`)
            else resolve(selection);
        }
    })
}

let getPostByID = (searchID) => 
{
    return new Promise((resolve, reject) =>{
        let selection;

        if (!verifyArray(posts))
        {
            reject('No data found in posts')
        }
        else {
            for (i=0;i<posts.length;i++)
            {
                if (posts[i].id == searchID)
                {
                    selection = posts[i]
                }
            }
            if (selection == undefined)
            {
                reject(`No post found with ID "${searchID}"`);
            } else {
                resolve(selection);
            }
        }
    })
}

let getPublishedPosts = () =>{
    return new Promise((resolve, reject) => {
        
        let published = [];
        if (verifyArray(posts))
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

let addPost = (postData) => {
    console.log('Adding post...');
    return new Promise((resolve, reject) => {
        if (postData.published == undefined)
        {
            postData.published = false;
        } 
        else postData.published = true;

        postData.id = posts.length + 1;
        posts.push(postData);
        console.log(`Post ${postData.id} has been added to posts`)

        resolve(getPosts());

        
    })
}

exports.getPostByID = getPostByID;
exports.getPostsByMinDate = getPostsByMinDate
exports.getPostsByCategory = getPostsByCategory;
exports.initialize = initialize;
exports.getPosts = getPosts;
exports.getPublishedPosts = getPublishedPosts;
exports.getCategories = getCategories;
exports.addPost = addPost;