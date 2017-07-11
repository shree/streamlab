// Packages
var path = require("path");
var fs = require("fs");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Imports
var indexRoutes = require('./routes/index');
var User = require("./models/user");

//Create App //
var app = express();

//View Engine //
app.set("view engine", "html");
app.engine("html", function(path, options, callbacks) {
  fs.readFile(path, 'utf-8', callback);
});

// MONGODB SETUP HERE
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
});

//Middleware (Order Matters!!) //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SECRET || '2cats',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,'../client')));

//Google Login
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.callbackURL || "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    var promise = User.findOne({ id: profile.id }).exec();
    promise.then(function(user) {
      if(user){
        return user
      }else {
        var newUser = new User({
          id: profile.id,
          name: profile.displayName
        });
        return newUser.save();
      }
    })
    .then(function(user) {
      return done(null,user);
    })
    .catch(function(err) {
      return done(err,null);
    });
  }
));
app.get('/auth/google', passport.authenticate('google', { scope: ['email' , 'profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    // Authenticated successfully
    res.redirect('/');
});

//Routes
app.use('/', indexRoutes);

//Error Handling for other requests
app.use(function(err,req,res,next){
  res.status(err.status || 500);
});

//Sockets and Server
var port = process.env.PORT || 8000;
var server = app.listen(port);
var io = require('socket.io').listen(server);
var connections = [];

io.sockets.on('connection', function(socket) {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  //Disconnect
  socket.on('disconnect', function(data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnect: %s sockets connected', connections.length);
  });

  //Send message
  socket.on('send message', function(data) {
    io.sockets.emit('new message', {msg: data.message, user: data.user})
  });

});

// module.exports = app;
// var port = process.env.PORT || 8000;
// app.listen(port,  function() {
//   console.log("Running on port: %s", port);
// });
