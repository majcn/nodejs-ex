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
  router.get('/', ensureLoggedIn, function(req, res, next) {
    var wHolder = app.get('db').collection('wish_holder');
    var wSend = app.get('db').collection('wish_send');


    wSend.findOne({'email': getEmail(req.user)}, function(err, document) {
      wHolder.findOne({'_id': document['to']}, function(err2, document2) {
        var user = {
          'name': document.secret,
          'picture': 'http://images.clipartpanda.com/mechanical-engineer-cartoon-mystery_man_290.jpg' // TODO
        }

        strWish = document2.wish

        res.render('user', { user: user, wish: strWish });
      });
    });
  });

  return router;
}

module.exports = routerProvider;
