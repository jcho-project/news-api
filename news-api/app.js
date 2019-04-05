const express = require("express");
const app = express();
const request = require("request");

app.set("view enging", "ejs");

app.get("/", (req, res) => {
  let url = "https://newsapi.org/v2/everything?q=lg&from=2019-04-04&to=2019-04-04&sortBy=popularity&apiKey=0444a705c51c45ad8ef8e13241bf99a4";

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      res.send(data);
    }
  });
});

app.listen(4000, () => "Server is Listening on Port : 4000");