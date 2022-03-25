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
const Sequelize = require('sequelize');
const {Op} = require('@sequelize/core');
const { post } = require("./routes/public.js");
var sequelize = new Sequelize('d2i1s7q7ks7ps0', 'ykaoydftxgedxx', '7a0ec7447c58b452373ba7f627e9a0fdf7bcf607effa4e054fd2c919c0687288', 
{
    host: 'ec2-3-231-254-204.compute-1.amazonaws.com', 
    dialect: 'postgres', 
    port: 5432, 
    dialectOptions: {
        ssl: { rejectUnauthorized: false } 
    },
    query: { raw: true }
});

var Post = sequelize.define('post', {
    post_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    body: {
        type: Sequelize.TEXT
    },
    title: {
        type: Sequelize.STRING
    },
    post_date: {
        type: Sequelize.DATE
    },
    feature_img: {
        type: Sequelize.STRING
    },
    published: {
        type: Sequelize.BOOLEAN
    }
});

var Category = sequelize.define('category', {
    category_id: {
        type: Sequelize.INTEGER,
        primaryKey:true
    },
    category: {
        type: Sequelize.STRING
    }
});

Post.belongsTo(Category, {foreignKey: 'category_id'});

/*==========- Exports -==========*/
module.exports.initialize = async() => {
    return new Promise((resolve, reject) => {
        try{
            await sequelize.sync({});
            resolve('Database synced');
        }
        catch{
            reject('Database failed to sync');
        }
    })
};
module.exports.getAllPosts = async() => {
    return new Promise((resolve, reject) =>
    {
        try{
            let posts = await Post.findAll()
            resolve(posts);
        }
        catch{
            reject('Unable to retrieve posts');
        }
    })
}
module.exports.getPostsByCategory = async (searchCategory) => {
    return new Promise((resolve, reject) =>
    {
        try{
            let posts = await Post.findAll({
                where: {
                    category: searchCategory
                }
            })
            if (posts.length < 1) reject(`No posts in ${searchCategory}`)
            else resolve(posts);
        }
        catch{
            reject(`There was a problem locating posts in the "${searchCategory}" category`);
        }
    })
}
module.exports.getPostsByMinDate = async(minDateString) =>
{
    return new Promise((resolve, reject) => 
    {
        try{
            let posts = await Post.findAll({
                where: {
                    postDate: {[Op.gte]: new Date(minDateString)}
                }
            })
            if (posts.length < 1) reject(`No posts made on or after ${minDateString}`);
            else resolve(posts);
        }
        catch {
            reject(`There was a problem locating posts made on or after ${minDateString}`);
        }
    })
}
module.exports.getPostsByMinDate = async(searchId) => 
{
    return new Promise((resolve, reject) =>
    {
        try{
            let post = await Post.findAll({
                where: {
                    post_id: searchId
                }
            })
            resolve(post);
        }
        catch{
            reject(`Unable to find post with ID "${searchId}"`);
        }
    })
}
module.exports.getPublishedPosts = async() =>
{
    return new Promise((resolve,reject) => {
        try{
            let posts = await Post.findAll({
                where: {
                    published: true
                }
            })
            resolve(posts);
        }
        catch{
            reject('Unable to load published posts')
        }
    })
}
module.exports.getPublishedPostsByCategory = async(searchCategory) => 
{
    return new Promise((resolve,reject) => {
        try{
            let published = [];
            let posts = getPublishedPosts();
            posts.forEach(post => {
                if(post.published)
                {
                    published.push(post);
                }
            })
            resolve(published);
        }
        catch{
            reject(`Unable to retrieve published posts in category ${searchCategory}`);
        }
    })
}
module.exports.addPost = async(postData) =>
{
    return new Promise((resolve, reject) => {
        try{
            postData.published = (postData.published)? true : false;
            Post.create({
                title: postData.title,
                body: postData.body,
                postData: new Date(),
                feature_img: postData.featureImage,
                published: postData.published,
                category_id: postData.category
            })
            resolve(`"${postData.title}" saved`);    
        }
        catch{
            reject(`Unable save "${postData.title}"`);
        }
    })
}