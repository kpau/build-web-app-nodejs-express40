const express = require('express');

function router(nav) {
  const bookRouter = express.Router();

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

  bookRouter.route('/')
    .get((req, res) => {
      res.render('bookListView', {
        title: 'My Library',
        nav,
        books,
      });
    });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;

      res.render('bookView', {
        title: 'My Library',
        nav,
        book: books[id],
      });
    });

  return bookRouter;
}

module.exports = router;
