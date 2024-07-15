const passport= require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_call_back_url
    },

    function(accessToken, refreshToken, profile, done) {
        // Find a user
        User.findOne({ email: profile.emails[0].value }).then(user => {
          if (user) {
            // If found, set this user as req.user
            return done(null, user);
          } else {
            // If not found, create the user as req.user
            return User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString('hex')
            });
          }
        }).then(newUser => {
          // Return the newly created user
          return done(null, newUser);
        }).catch(err => {
          // Handle errors
          console.error('Error in Google strategy passport:', err);
          return done(err);
        });
      }
      

));

module.exports=passport;