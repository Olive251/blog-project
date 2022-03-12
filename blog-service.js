/*****************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Olivia Brown Student ID: 112582192 Date: March 11, 2022
*
* Online (Heroku) URL:
*
* GitHub Repository URL: https://github.com/Olive251/web322-app/tree/assignment-5
*           !!!(IN THE ASSIGNMENT-5 BRANCH)!!!
*
******************************************************************************/
const fs = require("fs");
const helpers = require('./helpers/blogSvc-helpers.js');

let posts = [];
let categories = [];

let initialize = (pFile, cFile) =>
{
    return new Promise((resolve, reject) => {
        fs.promises.readFile(pFile, 'utf8')
        .then((data) => {
            posts = JSON.parse(data);
            if (posts.length > 0){
                fs.promises.readFile(cFile, 'utf8')
                .then((data) => {
                    categories = JSON.parse(data);
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
        if (!helpers.verifyArray(posts))//(posts.length === 0)
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
        if (!helpers.verifyArray(posts))
        {
            reject('No posts found')
        }
        else 
        {
            for (i=0;i<posts.length;i++)
            {
                if (helpers.dateStrComp(posts[i].postDate, minDateStr))
                {
                    console.log(helpers.dateStrComp(posts[i].postDate, minDateStr));
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

        if (!helpers.verifyArray(posts))
        {
            reject('Nothing found')
        }
        else {
            for (i=0;i<posts.length;i++)
            {
                if (posts[i].id == searchID) selection = posts[i]
            }
            if (selection == undefined) reject(`No post found with ID "${searchID}"`);
            else console.log(selection); resolve(selection);
        }
    })
}

let getPublishedPosts = () =>{
    return new Promise((resolve, reject) => {
        
        let published = [];
        if (helpers.verifyArray(posts))
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

let getPublishedPostsByCat = async(cat) =>  {
    let selection = [];
    let published = await getPublishedPosts();
    if (typeof(published) == "string") return published;

    published.forEach(post => {
        if (post.category === cat)    {
            selection.push(post);
        }
    })
    return selection;
}

let addPost = (postData) => {
    console.log('Adding post...');
    return new Promise((resolve, reject) => {
        if (postData.published == undefined) postData.published = false;
        else postData.published = true;

        //prepping date
        pDate = new Date();
        var dd = String(pDate.getDate()).padStart(2, '0');
        var mm = String(pDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = pDate.getFullYear();

        postData.postDate = `${yyyy}-${mm}-${dd}`;
        postData.id = posts.length + 1;
        posts.push(postData);

        if (postData.id > posts.length) reject("Error! Post not added!");
        else{
            console.log(`Post ${postData.id} has been added to posts`)
            resolve(posts);  
        }
    })
}

exports.getPostByID = getPostByID;
exports.getPostsByMinDate = getPostsByMinDate
exports.getPostsByCategory = getPostsByCategory;
exports.initialize = initialize;
exports.getPosts = getPosts;
exports.getPublishedPosts = getPublishedPosts;
exports.getPublishedPostsByCat = getPublishedPostsByCat;
exports.getCategories = getCategories;
exports.addPost = addPost;