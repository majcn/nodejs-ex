var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

function routerProvider(app) {
  /* GET user profile. */
  router.get('/', ensureLoggedIn, function(req, res, next) {
    var col = app.get('db').collection('test');
    var wish = col.findOne({'email': req.user.email})
    res.render('user', { user: req.user, wish: wish });
  });

  router.post('/wish', ensureLoggedIn, function(req, res, next) {
    var col = app.get('db').collection('test');
    col.update({'email': req.user.email}, {'$set': {'wish': req.body.wish}}, {'upsert': true});
    res.render('user', { user: req.user });
  });
}

module.exports = routerProvider;
