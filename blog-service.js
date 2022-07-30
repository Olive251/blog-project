
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

var Post = sequelize.define('Post', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  post_date: Sequelize.DATE,
  feature_img: Sequelize.STRING,
  published: Sequelize.BOOLEAN
});

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
    });

Post.belongsTo(Category, {foreignKey: 'category'});

/*==========- Exports -==========*/
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => 
            resolve('Database synced successfully')
        )
        .catch(() => 
        reject('Database failed to sync'))
        }
    )
};
module.exports.getPosts = () => {
    return new Promise((resolve, reject) =>
    {
      Post.findAll()
        .then((data) => 
          resolve(data)
        ).catch((error) => 
          reject(`Unable to retrieve posts because ${error}`)
        )}
    )
}
module.exports.getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
        where: {
            category: category
        }
    }).then( data => {
        resolve(data);
    }).catch(() => {
        reject("no categories returned");
    });
});
}
module.exports.getPostsByMinDate = (minDateString) =>
{
  const { gte } = Sequelize.Op;

  return new Promise((resolve, reject) => {
      Post.findAll({
          where: {
              post_date: {
                  [gte]: new Date(minDateStr)
                }
          }
      }).then( data => {
          resolve(data);
      }).catch((err) => {
          reject("no results returned");
      });
  });
}

module.exports.getPostByID = (id) => 
{

  return new Promise((resolve, reject) => {
    Post.findAll({
        where: {
            id: id
        }
    }).then( data => {
        resolve(data[0]);
    }).catch((err) => {
        reject("no results returned");
    });
});

module.exports.getPublishedPosts = () =>
{
    return new Promise((resolve,reject) => {
        try{
            let posts = Post.findAll({
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
module.exports.getPublishedPostsByCategory = (category) => 
{
    return new Promise((resolve, reject) => {
      Post.findAll({
        where: {
          published: true,
          category: category
        }
      })
      .then((data) => resolve(data))
      })
      .catch(() => reject("unable to find any posts with that category"))

}

module.exports.addPost = (postData) =>
{
  return new Promise((resolve, reject) => {
    postData.published = postData.published ? true : false;

    for (var prop in postData) {
        if (postData[prop] === '')
        postData[prop] = null;
    }

    postData.post_date = new Date();

    Post.create(postData).then(() => {
        resolve();
    }).catch((e) => {
        reject(`unable to create post because ${e}`);
    });

});

module.exports.getCategories = () => 
{
    return new Promise((resolve, reject) => {
            Category.findAll()
            .then((data) => resolve(data))
            .catch(() => reject('Unable to get the categories'))
})}

module.exports.addCategory = (categoryData) =>
{
  console.log('category data is', categoryData)
    return new Promise((resolve,reject) => {
      for(let prop in categoryData){
        console.log(categoryData)
          if(categoryData[prop] == "")
          {
            categoryData[prop] = null;
          }
        }
        Category.create(categoryData)
        .then(() => resolve())
        .catch(() => reject("Unable to add category"))
        }
    )
}

module.exports.deletePost = (id) => 
{
  return new Promise((resolve, reject) => 
  {
    Post.destroy({
      where: {
        id: id
      }
    })
    .then(() => 
    {
      resolve()
    })
    .catch(() => 
    {
      reject("can't delete the post")
    })
  })
}

module.exports.deleteCategory = (id) => 
{
  return new Promise((resolve, reject) => 
  {
    Category.destroy({
    where: {
      id: id
    }
  })
  .then(() => 
  {
    resolve()
  })
  .catch(() => 
  {
    reject("can't delete the Category")
    })
  })
}
