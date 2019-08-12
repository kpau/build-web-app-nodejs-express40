const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      let client;
      try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const collection = db.collection('users');
        const user = await collection.findOne({ username });
        if (user.password === password) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        debug(error);
        done(error, false);
      }

      client.close();
    },
  ));
};
