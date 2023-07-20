// * Create server for the application

const PORT = 8000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// * We are getting all the features/packages from "express"
const app = express();

// * Route: GET "/news"
// * Action: Fetch articles from all newspapers and store them in an array "articles"
const getArticles = (newspaperData) => {
  axios.get(newspaperData.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    articles = [];

    $("a", html).each(function () {
      let title = $(this).text();
      // console.log(title);

      // const url = $(this).attr("href");

      if (title.includes("Climate") || title.includes("climate")) {
        let url = $(this).attr("href");
        if (!url.includes("https")) {
          url = newspaperData.base + url;
        }

        title = title.replaceAll("\n", "").replaceAll("\t", "");

        articles.push({
          source: newspaperData.name,
          title,
          url,
        });
      }
    });
  });
};

// * Route: GET "/news/:newspaperId"
// * Action: Fetch articles from a newspaper from params
const getSpecificArticles = (newspaperId, newspaperAddress, newspaperBase) => {
  axios.get(newspaperAddress).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    specificArticles = [];

    $("a", html).each(function () {
      let title = $(this).text();
      // console.log(title);

      // const url = $(this).attr("href");

      if (title.includes("Climate") || title.includes("climate")) {
        let url = $(this).attr("href");
        if (!url.includes("https")) {
          url = newspaperBase + url;
        }

        title = title.replaceAll("\n", "").replaceAll("\t", "");

        specificArticles.push({
          source: newspaperId,
          title,
          url,
        });
      }
    });
  });
};

const newspapers = [
  {
    name: "guardian",
    address: "https://www.theguardian.co.uk/environment/climate-crisis",
    base: "https://www.theguardian.com",
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "https://www.thetimes.co.uk/article",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "nytimes",
    address: "https://www.nytimes.com/international/section/climate",
    base: "https://www.nytimes.com",
  },
];

let articles = [];
let specificArticles = [];

newspapers.forEach((newspaper) => {
  getArticles(newspaper);
});

// * Setting up the routes and the actions for each routes
app.get("/", (req, res) => {
  // This ".json()" is converting the data from JSON to JavaScript object
  res.json("Welcome to my Climate Change News API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  // console.log(newspaperId);

  // * Get the newspaper climate change page url from the ":newspaperId" params
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  // console.log(newspaperAddress);

  // * Get the newspaper page base in case the url of the articles missing that base
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;
  // console.log(newspaperBase);

  // * Pass the newspaperId (from params), newspaperAddress and newspaperBase to get the newspaper articles
  getSpecificArticles(newspaperId, newspaperAddress, newspaperBase);

  res.json(specificArticles);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
