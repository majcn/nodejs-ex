var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

function getEmail(user) {
  if (data.email) {
    return data.email;
  }

  if (user.emails) {
    return data.emails[0].value
  }

  throw new Error("there is no email for this user")
}

function routerProvider(app) {
  /* GET user profile. */
  router.get('/', ensureLoggedIn, function(req, res, next) {
    var col = app.get('db').collection('test');
    var wish = col.findOne({'email': getEmail(req.user)})
    var strWish = ''
    if (wish) {
      strWish = wish.wish
    }
    console.log(wish)
    res.render('user', { user: req.user, wish: strWish });
  });

  router.post('/wish', ensureLoggedIn, function(req, res, next) {
    var col = app.get('db').collection('test');
    col.update({'email': getEmail(req.user)}, {'$set': {'wish': req.body.wish}}, {'upsert': true});
    res.redirect('/user');
  });

  return router;
}

module.exports = routerProvider;
