const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  request = require("request"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  Comment = require("./models/comment"),
  Articles = require("./models/articles"),
  Search = require("./models/search");

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
var url = process.env.DATABASEURL || "mongodb://localhost/news-api";

mongoose.connect(url, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

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
  let category = req.query.dropdown;

  let url = "https://newsapi.org/v2/top-headlines/?q=" + query + "&category=" + category + "&language=en&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      // Update New Articles
      data.articles.forEach(function (n) {
        Search.findOneAndUpdate(n, n, { new: true, upsert: true }, function (err, doc) {
          if (err) {
            console.log(err);
          }
        });
      });

      // Sort and Pass Through Data
      Search.find().sort({ publishedAt: -1 }).exec((err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.render("top-headlines", { data: result })
        }
      });
    }
  });
});

// Top headlines of the day in the US (business)
app.get("/top-headlines", (req, res) => {
  let url = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      // Update New Articles
      data.articles.forEach(function (n) {
        Articles.findOneAndUpdate(n, n, { new: true, upsert: true }, function (err, doc) {
          if (err) {
            console.log(err);
          }
        });
      });

      // Delete Articles Older than 1 Day
      let date = new Date();
      let daysToDeletion = 1;
      let deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

      Articles.deleteMany({ publishedAt: { $lt: deletionDate } }, (err, truncate) => {
        if (err) {
          console.log(err);
        }
      });

      // Sort and Pass Through Data
      Articles.find().sort({ publishedAt: -1 }).exec((err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.render("top-headlines", { data: result })
        }
      });
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

app.listen(process.env.PORT || 4000, () => console.log("Server is Listening on Port : 4000"));