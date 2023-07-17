// * Create server for the application

const PORT = 8000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// * We are getting all the features/packages from "express"
const app = express();

const getArticles = (newspaperData) => {
  axios.get(newspaperData.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("a", html).each(function () {
      const title = $(this).text();
      // console.log(title);

      // const url = $(this).attr("href");

      if (title.includes("Climate") || title.includes("climate")) {
        let url = $(this).attr("href");
        if (!url.includes("https")) {
          url = nytimesUrl + url;
        }

        articles.push({
          source: newspaperData.name,
          title,
          url,
        });
      }
    });
  });
};

const nytimesUrl = "https://www.nytimes.com";

const newspapers = [
  {
    name: "guardian",
    address: "https://www.thetimes.co.uk/environment/climate-change",
  },
  {
    name: "thetimes",
    address: "https://www.theguardian.co.uk/environment/climate-crisis",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
  },
  {
    name: "nytimes",
    address: "https://www.nytimes.com/international/section/climate",
  },
];

const articles = [];

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

// app.get("/news", (req, res) => {
//   axios
//     .get("https://www.nytimes.com/international/section/climate")
//     .then((response) => {
//       // * Fetch the HTML file from the URL
//       const html = response.data;
//       // console.log(html);

//       // * We use cheerio to pick up elements from the HTML file, and "$" is a cheerio syntax
//       const $ = cheerio.load(html);

//       $("a:contains('Climate')", html).each(function () {
//         const title = $(this).text();
//         console.log(title);

//         let url = $(this).attr("href");
//         if (!url.includes("https")) {
//           url = nytimesUrl + url;
//         }
//         console.log(url);

//         articles.push({
//           title,
//           url,
//         });
//       });
//       res.json(articles);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
