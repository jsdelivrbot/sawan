var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var flash         = require("connect-flash");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var Book          = require("./models/book");
var seedDB        = require("./seeds.js"); // in lecture it is ".seed" only and it's not working here
var Comment       = require("./models/comment");
var User          = require("./models/user.js");
var methodOverride= require("method-override");
var path          = require('path');
var indexRoutes   = require("./routes/index");
var webshot       = require('webshot');
var commentRoutes = require("./routes/comments");
var Route         = require("./routes/route");
var GoogleStrategy= require('passport-google-oauth20');
var cookieSession = require('cookie-session');





app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: ['babludblu']
}));

//initaialize passport
app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user) =>{
     done(null, user);
    })
  }); 





//--------------------------------------------------------------------------------------------------------------------------

//mongoose.connect("mongodb://localhost/mohit");  
//mongoose.connect("mongodb://lucky:lucky1234@ds161790.mlab.com:61790/mohit_startup");  
mongoose.connect("mongodb://lucky:lucky1234@ds147190.mlab.com:47190/mohit_custom_tshirt");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs"); 


app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//--------------------------------------------------------------------------------------------------------------------------

// seedDB(); // seed the database




app.use(express.static(path.join(__dirname, 'client')))

// PASSPORT CONFIGURATION

app.use(require("express-session")({
       
       secret:          "irodov",
       resave:           false,
       saveUnintialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 
app.use(function(req, res, next){
   res.locals.currentUser    = req.user;
   res.locals.error          = req.flash("error");
   res.locals.success        = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(Route);
app.use("/books/:id/comments",commentRoutes);


// app.listen(3000, function(){
//   console.log("SERVER IS STARTED");
// });


app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})