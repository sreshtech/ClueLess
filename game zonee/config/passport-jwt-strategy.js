const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require ('passport-jwt').ExtractJwt;
const User = require('../models/user');
const env = require('./environment');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}

passport.use(new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload._id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.error('Error in finding user from JWT', error);
      return done(error, false);
    }
  }));
  

module.exports=passport;