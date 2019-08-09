const express = require('express');
const sql = require('mssql');

function router(nav) {
  const bookRouter = express.Router();

  const books = [
    {
      id: 1,
      title: 'War and Preace',
      genre: 'Historycal Fiction',
      author: 'Lev Nikolovayevich Tolstoy',
      read: false,
    }, {
      id: 2,
      title: 'Les Miserables',
      genre: 'Historycal Fiction',
      author: 'Victor Hugo',
      read: false,
    }, {
      id: 3,
      title: 'War and Preace',
      genre: 'Historycal Fiction',
      author: 'Lev Nikolovayevich Tolstoy',
      read: false,
    }, {
      id: 4,
      title: 'Les Miserables',
      genre: 'Historycal Fiction',
      author: 'Victor Hugo',
      read: false,
    },
  ];

  bookRouter.route('/')
    .get(async (req, res) => {
      try {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');

        res.render('bookListView', {
          title: 'My Library',
          nav,
          books: recordset,
        });
      } catch (error) {
        // failback to hardcoded
        res.render('bookListView', {
          title: 'My Library',
          nav,
          books,
        });
      }
    });

  bookRouter.route('/:id')
    .all(async (req, res, next) => {
      const { id } = req.params;

      try {
        const request = new sql.Request();
        const { recordset } = await request
          .input('id', sql.Int, id)
          .query('select * from books where id = @id');

        [req.book] = recordset;
      } catch (error) {
        // failback to hardcoded
        const book = books.find(val => val.id.toString() === id);
        req.book = book;
      }

      next();
    })
    .get((req, res) => {
      res.render('bookView', {
        title: 'My Library',
        nav,
        book: req.book,
      });
    });

  return bookRouter;
}

module.exports = router;
