const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morganDebug = require('morgan-debug');
const path = require('path');
const bodyParser = require('body-parser');
const cookiesParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;
const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' },
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use(morganDebug('http', 'tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookiesParser());
app.use(session({ secret: 'library' }));
require('./src/config/passport')(app);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.use(express.static(path.join(__dirname, 'public/')));
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
