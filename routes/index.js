var express = require("express");
var router  = express.Router();
var passport= require("passport");
var User    = require("../models/user");
var configAuth = require("../config/auth");
var GoogleStrategy= require('passport-google-oauth20');
var FacebookStrategy = require('passport-facebook');



//landing page
router.get("/",function(req, res){           
 res.render("landing");
});

//customize tshirts
router.get("/customize",function(req, res){           
 res.render("customize/customize");
});

//================
//   AUTH ROUTES
//================


//facebook authentication

var FACEBOOK_APP_ID     = '195102307776689';
var FACEBOOK_APP_SECRET = '8a9ab9fe8264e373f3bfa31763560146';



var fbOpts ={
   clientID:FACEBOOK_APP_ID,
   clientSecret: FACEBOOK_APP_SECRET,
   callbackURL: '/auth/facebook/callback'
};


var fbCallback =  function( accessToken, refreshToken, profile, cb) {
      console.log(profile.id, profile.displayName);
      User.findOne({facebookID:profile.id}).then((currentUser) =>{
          if(currentUser){
            // already have user

             console.log('user is:', currentUser);
             done(null, currentUser);
          } else {
      new User({
          username:profile.displayName,
          facebook:profile.id
      }).save().then((newUser)=>{
         console.log('new user created' +newUser)
         done(null, newUser);
          });
         }
      });
}


passport.use(new FacebookStrategy(fbOpts, fbCallback));

//google authentication
passport.use(
  new GoogleStrategy({
   //option for the google strat

   callbackURL: '/auth/google',
   clientID:     '836768916961-v187ofe5fnpr7gt87hbq85pqdp8ioa0p.apps.googleusercontent.com',
   clientSecret: 'WFxrPr4s0DYN4jQgFholJmwO'
  }, (accessToken, refreshToken, profile, done)=>{
      //check if user already exist in our DB

      User.findOne({googleID:profile.id}).then((currentUser) =>{
          if(currentUser){
            // already have user

             console.log('user is:', currentUser);
             done(null, currentUser);
          } else {


      new User({
          username:profile.displayName,
          googleID:profile.id
      }).save().then((newUser)=>{
         console.log('new user created' +newUser)
         done(null, newUser);
          });
         }
      });
    })
  )

router.get('/google', passport.authenticate('google', {
  scope:['profile']
}));


router.get('/auth/google', passport.authenticate('google'), (req, res)=>{
  res.redirect("/");
})



router.get('/facebook', passport.authenticate('facebook'));


router.get('/auth/facebook/callback',passport.authenticate('facebook'), (req, res)=>{
  // save to DB
  res.redirect("/");

});



// show register form

router.get("/register", function(req, res){  
    res.render("register");
});

// handle signup logic

router.post("/register", function(req, res){
       
       var newUser = new User({username: req.body.username});
       User.register(newUser, req.body.password, function(err, user){
            if(err) {
              console.log(err);              
              req.flash("error", err.message);
              return res.render("register");
            } 
        
        passport.authenticate("local")(req, res, function(){
        
          req.flash("success", "welcome to yehBOok " + user.username);
          res.redirect("/books");
        });


      });

});


//show login form

router.get("/login", function(req, res){
    res.render("login");
}); 

// handling login logic
router.post("/login", passport.authenticate("local",
 {
  successRedirect: "/books",
  failureRedirect: "/login"

}), function(req, res){


});


// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!!");
  res.redirect("/books");
});



function isLoggedIn(req, res, next)
{
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}


module.exports  =  router;





















