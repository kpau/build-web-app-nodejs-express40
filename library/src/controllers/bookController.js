const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(nav, bookService) {
  const books = [
    {
      _id: 1,
      title: 'War and Preace',
      genre: 'Historycal Fiction',
      author: 'Lev Nikolovayevich Tolstoy',
      bookId: 656,
      read: false,
    }, {
      _id: 2,
      title: 'Les Miserables',
      genre: 'Historycal Fiction',
      author: 'Victor Hugo',
      bookId: 24280,
      read: false,
    }, {
      _id: 3,
      title: 'War and Preace',
      genre: 'Historycal Fiction',
      author: 'Lev Nikolovayevich Tolstoy',
      bookId: 656,
      read: false,
    }, {
      _id: 4,
      title: 'Les Miserables',
      genre: 'Historycal Fiction',
      author: 'Victor Hugo',
      bookId: 24280,
      read: false,
    },
  ];

  async function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);

      const col = await db.collection('books');
      const result = await col.find().toArray();

      res.render('bookListView', {
        title: 'My Library',
        nav,
        books: result,
      });
    } catch (err) {
      debug(err);

      res.render('bookListView', {
        title: 'My Library',
        nav,
        books,
      });
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  async function getById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);

      const col = await db.collection('books');
      const book = await col.findOne({ _id: new ObjectID(id) });

      book.details = await bookService.getBookById(book.bookId);

      res.render('bookView', {
        title: 'My Library',
        nav,
        book,
      });
    } catch (err) {
      debug(err);

      // eslint-disable-next-line no-underscore-dangle
      const book = books.find(val => val._id.toString() === id);

      res.render('bookView', {
        title: 'My Library',
        nav,
        book,
      });
    } finally {
      if (client) {
        client.close();
      }
    }

    res.render('bookView', {
      title: 'My Library',
      nav,
      book: books[id],
    });
  }

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  return { getIndex, getById, middleware };
}

module.exports = bookController;
