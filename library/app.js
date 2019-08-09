const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morganDebug = require('morgan-debug');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' },
];

const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);
app.use(morganDebug('http', 'tiny'));
app.use(express.static(path.join(__dirname, 'public/')));

// load from node_modules
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.set('views', './src/views');
app.set('view engine', 'pug');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'My Library',
    nav,
  });
});

app.get('/html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/pug', (req, res) => {
  res.render('template.pug', {
    title: 'My Library',
    list: ['a', 'b'],
  });
});

app.get('/ejs', (req, res) => {
  res.render('template.ejs', {
    title: 'My Library',
    list: ['a', 'b'],
  });
});

app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});
