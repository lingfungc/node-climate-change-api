// * Create server for the application

const PORT = 8000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// * We are getting all the features/packages from "express"
const app = express();

// * Setting up the routes and the actions for each routes
app.get("/", (req, res) => {
  // This ".json()" is converting the data from JSON to JavaScript object
  res.json("Welcome to my Climate Change News API");
});

app.get("/news", (req, res) => {
  axios
    .get("https://www.nytimes.com/international/section/opinion")
    .then((response) => {
      const html = response.data;
      console.log(html);
    });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
