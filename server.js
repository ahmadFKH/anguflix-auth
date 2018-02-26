// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const expressSession=require('express-session');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Authentication middleware
app.use(expressSession({ secret: 'thisIsASecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
//    { passReqToCallback : true},
  function(username, password, done) {
    if ((username === "John") && (password === "password")) {
      return done(null, { username: username, id: 1 });
    } else {
      return done(null, false, "Failed to login.");
    }
  }
));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?err',
}));

// Catch all other routes and return the index file
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/login.html'));
});

app.get('/getUserDetails', function (req, res){
  if (req.isAuthenticated()){
    res.send(req.user);
  } else {
    res.redirect('/login');
  }
});

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  if (req.isAuthenticated()){
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  } else {
    res.redirect('/login');
  }
});

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

 // Catch all other routes and return the index file
app.use((err, req, res, next) => {
    res.status(500).send(err);
  });

const port = process.env.PORT || '3000';
app.set('port', port);
 
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));

