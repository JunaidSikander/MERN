const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/User');

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
};

//Authorization
passport.use(new JwtStrategy({
    jwrFromRequest : cookieExtractor,
    secretOrKey : 'Junaid'
},(payload, done) => {
    User.findById({_id: payload.sub}, (err,user) => {
       if(err)
           return done(err,false);
       if(user)
           return done(null,user);
       else
           return done(null,false);
    });
}));

//Authenticated Local Strategy using username and password
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username},(err,user) => {
        //Something went wrong with database
        if(err)
            return done(err);
        //if no user exist
        if(!user)
            return done(null,false);
        // check if passowrd is correct
        user.comparePassword(password,done);
    })
}));
