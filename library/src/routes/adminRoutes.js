const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const books = [
  {
    title: 'War and Preace',
    genre: 'Historycal Fiction',
    author: 'Lev Nikolovayevich Tolstoy',
    read: false,
  }, {
    title: 'Les Miserables',
    genre: 'Historycal Fiction',
    author: 'Victor Hugo',
    read: false,
  }, {
    title: 'War and Preace',
    genre: 'Historycal Fiction',
    author: 'Lev Nikolovayevich Tolstoy',
    read: false,
  }, {
    title: 'Les Miserables',
    genre: 'Historycal Fiction',
    author: 'Victor Hugo',
    read: false,
  },
];

function router() {
  const adminRouter = express.Router();

  adminRouter.route('/')
    .get(async (req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      let client;
      try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const response = await db.collection('books').insertMany(books);
        res.json(response);
      } catch (err) {
        debug(err);
      } finally {
        if (client) {
          client.close();
        }
      }
    });

  return adminRouter;
}

module.exports = router;
