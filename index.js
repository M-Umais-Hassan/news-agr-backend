const express = require("express");
const cors = require("cors");
const fs = require("fs");
const NewsAPI = require("newsapi");
require("dotenv").config();
const newsapi = new NewsAPI(process.env.API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// TODO: Will move the routes to route folder and make controllers as well

app.get("/newsapi", (req, res) => {
  res.send(`Welcome to News Api!!!`);
});

app.post("/newsapi/headlines", (req, res) => {
  const { queryString, sources, category } = req.body;

  newsapi.v2
    .topHeadlines({
      sources,
      q: queryString,
      category: category,
      language: "en",
      country: "us",
      sortBy: "relevancy",
      page: 1,
    })
    .then((response) => {
      res.send({ data: response?.articles, message: "Success", status: 200 });
    })
    .catch((err) => {
      res.send({ status: 400, message: err?.message });
    });
});

app.post("/newsapi/everything", (req, res) => {
  const { queryString, sources, date } = req.body;

  newsapi.v2
    .everything({
      q: queryString,
      sources,
      from: date,
      to: date,
      language: "en",
      sortBy: "relevancy",
      page: 1,
    })
    .then((response) => {
      res.send({ data: response?.articles, message: "Success", status: 200 });
    })
    .catch((err) => {
      res.send({ status: 400, message: err?.message });
    });
});

// API key had limit, and this data was kind of not changing that often so I have cache it
app.post("/newsapi/sources", (req, res) => {
  var fileData = fs.readFileSync("sources.json", { encoding: "utf-8" });
  var data = JSON.parse(fileData);
  res.send({ data: data?.sources, message: "Success", status: 200 });
});

app.post("/nytimes/all-news", (req, res) => {
  const { queryString, sources, date } = req.body;
  const NY_TIMES_URL =
    "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  const source = sources?.split(",")?.includes("new-york-magazine");
  if (sources && source) return [];
  fetch(`${NY_TIMES_URL}&api-key=${process.env.NY_TIMES_API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("data is here", data);
      res.send("Success");
    })
    .catch((error) => {
      console.error("error is here", error);
      res.send("Failure");
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`APP IS LISTENING ON PORT ${PORT}`));
