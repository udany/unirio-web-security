let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
require('../util/General');

let app = express();

app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

// Add all routes
let glob = require('glob');
let pattern = path.join(__dirname, 'routes', '*.js');
let routeFiles = glob.sync(pattern);

for (let file of routeFiles) {
    let route = require(file);
    app.use(route.path, route.router);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
