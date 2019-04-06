const express = require("express");
const app = express();
const request = require("request");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  let date = new Date();
  let today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
  let query = req.query.search;
  let url = "https://newsapi.org/v2/everything/?q=" + query + "&language=en&from=" + today + "&to=" + today + "&sortBy=relevancy&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      res.render("search", { data: data });
    }
  });
});

app.listen(4000, () => console.log("Server is Listening on Port : 4000"));