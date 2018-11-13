var express = require('express');
var mysql = require('mysql');
var bodyParser  = require("body-parser");
var app = express();
var passport = require('passport');
var flash    = require('connect-flash');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'brickhoff',  //your username
  database : 'interview'         //the name of your db
});


require('./config/passport')(passport); // pass passport for configuration

// Passport Configuration
app.use(require("express-session")({
    secret: "Rusty is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.get("/", function(req, res){
   res.render("home"); 
});


// show register form
app.get("/signup", function(req, res){
   res.render("signup", { message: req.flash('signupMessage'), page: 'signup' }); 
});


// handle sign up logic
app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));

// Show login form
app.get("/login", function(req, res){
   res.render("login", { message: req.flash('loginMessage'), page: 'login' }); 
});

// handle login logic
app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

});

// Add logout route
app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged You Out!");
   res.redirect("/");
});






app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has started!!");
});