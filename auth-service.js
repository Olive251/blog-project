
// Online (Heroku) URL: https://assignment6-web322-obrown.herokuapp.com/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

let userSchema = new Schema({
  "userName": {
    "type": String,
    "unique": true
  },
  "password": String,
  "email": String,
  "loginHistory": [{
    "dateTime": Date,
    "userAgent": String,
  }]
})

let User; // to be defined on new connection (see initialize)

module.exports.initalize = function(){
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection("mongodb+srv://dbuser:admin@senecaweb.v2jyk.mongodb.net/web322_assignment6?retryWrites=true&w=majority");

    db.on('error', (error) => {
      reject(error); //reject the promise with the provided error
    });
    db.once('open', () => {
      User = db.model("users", userSchema);
      resolve();
    })
  })
}

module.exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    if(userData.password !== userData.password2)
    reject("Passwords are not identical");

      bcrypt.hash(userData.password, 10)
      .then((hash) => {
        userData.password = hash;
        
        let newUser = new User(userData);
    
        newUser.save((error) => {
          if(error && error.code === 11000) {
            reject("This user name has already been taken");
          } else if (error && error.code !== 11000) {
            reject(`There was an error creating the user" ${error}`)
          } else {
            resolve();
          }
      })  
    })
    .catch((error) =>{
      reject(`There was an error encrypting the password, error: ${error}`);
    });
  })
}

module.exports.checkUser = (userData) => {
  return new Promise((resolve, reject) => {
    User.find({userName: userData.userName})
    .exec()
    .then((users) => {
      bcrypt.compare(userData.password, users[0].password)
      .then((res) => 
      {
        if(res == true){
          users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
          
          User.update(
            {userName: users[0].userName },
            {$set: { loginHistory: users[0].loginHistory } },
            {multi: false}
          )
          .exec()
          .then(() => {
            resolve(users[0])
          })
          .catch((error) => {
            reject(`There was an error verifying the user: ${error}`)
          })
        } else {
          reject(`Incorrect Password for user: ${userData.userName}`)
        }
        })
    })
    .catch(() => {
      reject(`Unable to find user: ${userData.userName}`)
    })
  })
}
