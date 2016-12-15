var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

function getEmail(user) {
  if (user.email) {
    return user.email;
  }

  if (user.emails) {
    return user.emails[0].value
  }

  throw new Error("there is no email for this user")
}

function routerProvider(app) {
  /* GET user profile. */
  router.get('/', ensureLoggedIn, function(req, res, next) {
    var col = app.get('db').collection('wish_holder');
    col.findOne({'email': getEmail(req.user)}, function(err, document) {
      var strWish = '';
      if (document) {
        strWish = document.wish;
      }

      var user = {
        'name': req.user.displayName,
        'picture': req.user.picture,
      };
      res.render('user', { user: user, wish: strWish });
    });
  });

  router.post('/wish', ensureLoggedIn, function(req, res, next) {
    var col = app.get('db').collection('wish_holder');
    col.update({'email': getEmail(req.user)}, {'$set': {'wish': req.body.wish, 'picture': req.user.picture, 'name': req.user.displayName}}, {'upsert': true});
    res.redirect('/user');
  });

  return router;
}

module.exports = routerProvider;
