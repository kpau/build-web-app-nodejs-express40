const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const debug = require('debug')('app:authRoutes');

function routes(nav) {
  const authRouter = express.Router();

  authRouter.route('/signUp')
    .post(async (req, res) => {
      debug(req.body);

      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      let client;
      try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const collection = db.collection('users');
        const user = { username, password };

        const results = await collection.insertOne(user);
        debug(results);

        req.login(results.ops[0], () => {
          res.redirect('/auth/profile');
        });
      } catch (error) {
        debug(error);
      }

      client.close();
    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        title: 'Sign In',
        nav,
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }));

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      debug(req.user);
      res.json(req.user);
    });

  return authRouter;
}

module.exports = routes;
