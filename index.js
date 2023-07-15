// * Create server for the application

const PORT = 8000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// * We are getting all the features/packages from "express"
const app = express();

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
