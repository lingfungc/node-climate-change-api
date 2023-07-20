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

    $("a", html).each(function () {
      let title = $(this).text();
      // console.log(title);

      // const url = $(this).attr("href");

      if (title.includes("Climate") || title.includes("climate")) {
        let url = $(this).attr("href");
        if (!url.includes("https")) {
          url = newspaperData.base + url;
        }

        // * Below replaceAll() function is not available in browser JavaScript
        // title = title.replaceAll("\n", "").replaceAll("\t", "");

        const regex = /[\n\t]/g; // Matches newline and tab characters globally
        title = title.replace(regex, "");

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
// * Action: Fetch articles from a newspaper from params with async/await function
const getSpecificArticles = async (
  newspaperId,
  newspaperAddress,
  newspaperBase
) => {
  try {
    const response = await axios.get(newspaperAddress);
    const html = response.data;
    const $ = cheerio.load(html);
    let specificArticlesData = [];

    $("a", html).each(function () {
      let title = $(this).text();
      // console.log(title);

      // const url = $(this).attr("href");

      if (title.includes("Climate") || title.includes("climate")) {
        let url = $(this).attr("href");
        if (!url.includes("https")) {
          url = newspaperBase + url;
        }

        // * Below replaceAll() function is not available in browser JavaScript
        // title = title.replaceAll("\n", "").replaceAll("\t", "");

        const regex = /[\n\t]/g; // Matches newline and tab characters globally
        title = title.replace(regex, "");

        specificArticlesData.push({
          source: newspaperId,
          title,
          url,
        });
      }
    });

    // console.log(specificArticlesData);
    return specificArticlesData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const getSpecificArticles = (newspaperId, newspaperAddress, newspaperBase) => {
//   axios.get(newspaperAddress).then((response) => {
//     const html = response.data;
//     const $ = cheerio.load(html);
//     specificArticles = [];

//     $("a", html).each(function () {
//       let title = $(this).text();
//       // console.log(title);

//       // const url = $(this).attr("href");

//       if (title.includes("Climate") || title.includes("climate")) {
//         let url = $(this).attr("href");
//         if (!url.includes("https")) {
//           url = newspaperBase + url;
//         }

//         title = title.replaceAll("\n", "").replaceAll("\t", "");

//         specificArticles.push({
//           source: newspaperId,
//           title,
//           url,
//         });
//       }
//     });
//   });
// };

const newspapers = require("./newspapersData.js");
// console.log(newspapers);

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

  const specificNewspaper = newspapers.find(
    (newspaper) => newspaper.name == newspaperId
  );
  // console.log(specificNewspaper);

  if (!specificNewspaper) {
    return res.status(404).json({ error: "Newspaper not found." });
  }

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
  try {
    specificArticles = await getSpecificArticles(
      newspaperId,
      newspaperAddress,
      newspaperBase
    );

    // console.log(specificArticles);
    res.json(specificArticles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch the articles" });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
