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

router.get('/users/delete/:id/:token', (req, res, next) => {
  User.findOneAndRemove({_id: req.params.id, token: req.params.token})
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.json(err);
    });
});

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

router.post('/users/edit/:id/:token', (req, res, next) => {
  
  const { email, name, surname, picture, sex, city, age } = req.body;

  User.findOneAndUpdate({ _id: req.params.id, token: req.params.token}, {
    email: email,
    name: name, 
    surname: surname, 
    picture: picture,
    sex: sex,
    city: city,
    age: age,
  },)
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.json(err);
    });
});

router.post('/auth/logout', (req, res, next) => {
  
})

router.get('/auth/loggedin', (req, res, next) => {
  
})


module.exports = router;
