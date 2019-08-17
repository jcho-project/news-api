const express = require("express");
const app = express();
const mongoose = require("mongoose");
const request = require("request");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const Comment = require("./models/comment");

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "security",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// EXPRESS : BODY PARSER : METHOD OVERRIDE CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// FLASH CONFIG
app.use(flash());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// MONGOOSE CONFIG
var url = "mongodb://localhost/news-api";

mongoose.connect(url, { useNewUrlParser: true });

// ===========================================
// INDEX ROUTES
// ===========================================

// Landing Page
app.get("/", (req, res) => {
  res.render("landing");
});

// Search for news (english)
app.get("/search", (req, res) => {
  let query = req.query.search;
  let url = "https://newsapi.org/v2/everything/?q=" + query + "&language=en&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      res.render("search", { data: data });
    }
  });
});

// Top headlines of the day in the US (business)
app.get("/top-headlines", (req, res) => {
  let url = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      res.render("top-headlines", { data: data });
    }
  });
});

// List of sources
app.get("/sources", (req, res) => {
  let url = "https://newsapi.org/v2/sources?language=en&country=us&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      res.render("sources", { data: data });
    }
  });
});

// ===========================================
// AUTHENTICATION ROUTES
// ===========================================

// Show register form
app.get("/register", (req, res) => {
  res.render("register");
});

// Sign up logic
app.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err.message);
      req.flash("error", err.message);
      // return res.render("register");
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to the News-API " + user.username);
      res.redirect("/");
    });
  });
});

// Show login form
app.get("/login", (req, res) => {
  res.render("login");
});

// Login logic
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/",
    failureRedirect: "/login"
  }), (req, res) => { });

// Logout logic
app.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you Out!");
  res.redirect("/");
});

// CREATE ROUTE TEST

// // Test data
// let personalNews = [{ title: "Test", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg", article: "Test Article" }];

// // Add personal news
// app.get("/personal", (req, res) => {
//   res.render("personal", { personalNews: personalNews });
// });

// // Post personal news
// app.post("/personal", (req, res) => {
//   let title = req.body.title;
//   let image = req.body.image;
//   let article = req.body.article;

//   let newPersonal = { title: title, image: image, article: article }

//   personalNews.push(newPersonal);

//   res.redirect("/personal");
// });

// // New personal news form
// app.get("/personal/new", (req, res) => {
//   res.render("new");
// });

app.listen(process.env.PORT || 4000, () => console.log("Server is Listening on Port : 4000"));