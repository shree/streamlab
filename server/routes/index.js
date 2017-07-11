var path = require('path');
var router = require('express').Router();
var User = require("../models/user");

router.get('/', function(req,res) {
  res.sendFile(path.join(__dirname, '../../client/index.html'));
});

//Get user info if logged in
router.get('/checkLogin', function(req,res) {
  if(req.user) {
    return res.status(200).send(req.user);
  }else{
    return res.status(401).send({});
  }
});

//Save messages to database
router.post('/saveMessages', function(req,res){
  var promise = User.findOne({ id: req.user.id }).exec();
  promise.then(function(user){
    if(req.body.message) {
      user.messages.push(req.body.message);
      user.markModified('messages');
      return user.save();
    }
  })
  .then(function() {
    return res.status(200).send("Saved");
  })
  .catch(function() {
    return res.status(500).send("Did not save message");
  });
});

//Get all users and messages from database
router.get('/getData', function(req,res){
  User.find({}, function(err,users){
    if(err) { return res.status(500).send(err) }
    res.status(200).send(users);
  });
});

//Logout
router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

module.exports = router;
