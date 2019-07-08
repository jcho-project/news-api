const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(4000, () => console.log("Server is Listening on Port : 4000"));