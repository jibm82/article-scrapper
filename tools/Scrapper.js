const axios = require("axios");
const cheerio = require("cheerio");
const URL_FOR_SCRAPPING = "https://www.esquire.com/";

class Scrapper {
  static perform() {
    return new Scrapper().perform();
  }

  perform() {
    return new Promise((resolve, reject) => {
      axios.get(URL_FOR_SCRAPPING).then(response => {
        const $ = cheerio.load(response.data);
        let results = [];

        $(".full-item").each((i, item) => results.push(this.result($(item))));

        resolve(results);
      });
    });
  }

  result(item) {
    return {
      author: this.author(item),
      author_url: this.author_url(item),
      image: this.image(item),
      publish_date: this.publish_date(item),
      summary: this.summary(item),
      title: this.title(item),
      url: this.url(item)
    };
  }

  author(item) {
    return cleanText(item.find("span.byline-name").text());
  }

  author_url(item) {
    return item.find("a.byline-name").attr("href");
  }

  image(item) {
    return item.find(".lazyimage").attr("data-src");
  }

  publish_date(item) {
    return item.find(".publish-date").attr("data-publish-date");
  }

  summary(item) {
    return cleanText(item.find(".item-title").text());
  }

  title(item) {
    return cleanText(item.find(".item-title").text());
  }

  url(item) {
    return item.find("a").attr("href");
  }
}

function cleanText(text) {
  return text.replace(/[\r\n\t]/g, "").trim();
}

module.exports = Scrapper;
