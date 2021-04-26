const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../models/User.model');
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const rand = function() {
    return Math.random().toString(36).substr(2);
};

const token = function() {
    return rand() + rand() + rand() + rand();
};


router.get('/', (req, res, next) => {
  res.send('index');
});

router.get('/users/me/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        next(createError(404))
      } else {
        res.json(user)
      }
    })
    .catch(err => {
      res.json(err);
    });
});

router.post('/auth/login', (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email })
    .then(user => {
      if (!user) {
        // Error if no user
        res.json({errors: { message: 'Email or password is incorrect' }})
        next(createError(404, { errors: { message: 'Email or password is incorrect' }}))
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              //Error if no password
              res.json({errors: { message: 'Email or password is incorrect' }})
              next(createError(404, { errors: { message: 'Email or password is incorrect' }}))
            } else {
              // JWT generation - only id is passed
              res.json({ 
                access_token: jwt.sign(
                  { id: user._id },
                  process.env.JWT_SECRET || 'changeme',
                  {
                    expiresIn: '1d'
                  }
                ),
                userId: user._id
               })
            }
          })
      }
    })
})

// router.post('/auth/login', (req, res, next) => {
//   const { email, password } = req.body
//   User.find({
//     email: email
//   })
//   .then(user => {
//     if (user.length > 0) {
//       console.log('user found');
//       user.checkPassword(password)
//       .then(match => {
//         console.log('CHECK')
//       })
//       .catch(err => {
//         console.log('NOTCHECK')
//       })
//     }
//     else {console.log('user not found'); res.json(user)}
//     })
//   .catch(err => {
//     res.json(err);
//   });
// })

router.get('/auth/singup', (req, res, next) => {

})

router.post('/auth/singup', (req, res, next) => {
  const { email, password, name, surname, picture, sex, city, age } = req.body;
  User.create({
    email: email,
    password: password,
    name: name, 
    surname: surname, 
    picture: picture,
    sex: sex,
    city: city,
    age: age,
    token: token(),
    active: true
  })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
})

router.post('/auth/upload', (req, res, next) => {
  
})

router.post('/auth/edit', (req, res, next) => {
  
})

router.post('/auth/logout', (req, res, next) => {
  
})

router.get('/auth/loggedin', (req, res, next) => {
  
})


module.exports = router;
