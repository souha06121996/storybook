const GoogleStrategy=require('passport-google-oauth20').Strategy;


const mongoose = require('mongoose');
const keys = require('./keys');
require('../models/User');
const User =mongoose.model('users');

module.exports=function(passport){
passport.use(
    new GoogleStrategy({
        clientID:keys.googleClientID,
        clientSecret:keys.googleClientSecret,
        callbackURL:'/auth/google/callback',
        proxy:true
    },(accessToken,refreshToken,profile,done)=>{
        // console.log(accessToken);
        // console.log(profile);


        let image =profile.photos[0].value.substring(0,
            profile.photos[0].value.indexOf('s96'));

         image = ((image.slice(-1)==="=") ? image.slice(0, -1) : image);
            
            const newUser={
                googleID:profile.id,
                firstName:profile.name.givenName,
                lastName:profile.name.familyName,
                email: profile.emails[0].value,
                image:image
            }
            //check for existing user
            User.findOne({
                googleID:profile.id
            }).then(user=>{

            if(user){
                //return user
                done(null,user);

            }else{
                //Create new user
                new User(newUser)
                .save()
                .then(user=> done(null,user))
            }
            }) 
    })
);
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then(user=>done(null,user));
});
}

