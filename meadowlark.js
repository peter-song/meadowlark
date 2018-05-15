/**
 * Created by songzhongkun on 2018/5/4.
 */
const path = require('path');
const express = require('express');

const {getFortune} = require('./lib/fortune');

const credentials = require('./credentials.js');

// 设置 handlebars 视图引擎
const handlebars = require('express3-handlebars').create({defaultLayout: 'main'});

const app = express();

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.set('port', process.env.PORT || 4000);
app.engine('handlebars', handlebars.engine);

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.get('/', function (req, res) {
  // res.type('text/plain');
  // res.send('Meadowlark Travel');
  res.render('home');
});

app.get('/about', function (req, res) {
  // res.type('text/plain');
  // res.send('About Meadowlark Travel');
  // res.render('about');
  res.render('about', {
    fortune: getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
});

app.get('/tours/hood-river', function (req, res) {
  res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function (req, res) {
  res.render('tours/request-group-rate');
});

// 定制404页面
app.use(function (req, res) {
  // res.type('text/plain');
  // res.status(404);
  // res.send('404 - Not Found');
  res.status(404);
  res.render('404');
});

// 定制 500 页面
app.use(function (err, req, res, next) {
  console.error(err.stack);
  // res.type('text/plain');
  // res.status(500);
  // res.send('500 - Server Error');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
