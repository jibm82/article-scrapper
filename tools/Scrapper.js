const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const URL_FOR_SCRAPPING = "https://www.newyorker.com/latest";
const db = require("../models");

class Scrapper {
  static perform() {
    return new Scrapper().perform();
  }

  perform() {
    return new Promise((resolve, reject) => {
      axios
        .get(URL_FOR_SCRAPPING)
        .then(response => {
          const $ = cheerio.load(response.data);
          const articles = [];

          $(".River__list___2_45v li").each((i, article) => {
            articles.push(this.articleData($(article)));
          });

          db.Article.insertMany(
            articles,
            { ordered: false },
            (err, newArticles) => {
              if (err) {
                reject(err);
              }

              resolve(articles);
            }
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  articleData(article) {
    return {
      author: this.author(article),
      author_url: this.author_url(article),
      image: this.image(article),
      publish_date: this.publish_date(article),
      summary: this.summary(article),
      title: this.title(article),
      url: this.url(article)
    };
  }

  author(article) {
    return cleanText(
      article.find(".Byline__by___37lv8 a.Link__link___3dWao  ").text()
    );
  }

  author_url(article) {
    return fullUrl(
      article.find(".Byline__by___37lv8 a.Link__link___3dWao  ").attr("href")
    );
  }

  image(article) {
    const srcset = article.find("picture source:nth-child(2)").attr("srcset");

    return srcset.split(" ")[0];
  }

  publish_date(article) {
    let date = moment(article.find("h6").text());

    if (!date.isValid()) {
      date = moment();
    }

    return date.format();
  }

  summary(article) {
    return cleanText(article.find("h5").text());
  }

  title(article) {
    return cleanText(article.find("h4").text());
  }

  url(article) {
    return fullUrl(
      article
        .find("h4")
        .parent()
        .attr("href")
    );
  }
}

function cleanText(text) {
  return text.replace(/[\r\n\t]/g, "").trim();
}

function fullUrl(url) {
  return `${URL_FOR_SCRAPPING}${url}`;
}

module.exports = Scrapper;
