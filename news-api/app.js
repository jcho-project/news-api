const express = require("express");
const app = express();
const request = require("request");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("landing");
});

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

app.get("/top-headlines", (req, res) => {
  let url = "https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      res.render("top-headlines", { data: data });
    }
  });
});

app.get("/sources", (req, res) => {
  let url = "https://newsapi.org/v2/sources?language=en&country=us&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      res.render("sources", { data: data });
    }
  });
});

app.listen(4000, () => console.log("Server is Listening on Port : 4000"));