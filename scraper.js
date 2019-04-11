const request = require('request');
const cheerio = require('cheerio');
const rp = require('request-promise');
const htmlToMobi = require('html-to-mobi');

const baseURL = 'https://palegreendot.net/';

rp(baseURL)
  .then(html => {
    let $ = cheerio.load(html);
    let pathExt = [];
    $('a.post-link').each((i, element) => {
      let a = element.attribs.href;
      pathExt.unshift(a);
    });

    return pathExt;
  })
  .then(res => {
    let newPaths = [];
    let pathS = baseURL.slice(0, -1);

    res.forEach(element => {
      newPaths.push(pathS + element);
    });

    return newPaths;
  })
  .then(res => {
    var articles = [];

    res.forEach(link => {
      var article = rp(link)
        .then(html => {
          var data = {};
          let $ = cheerio.load(html);

          // try removing imgs...
          $('img').each(function() {
            $(this).remove();
          });

          let arty = $('article.post');

          data['title'] = arty.find('h1.post-title').text();
          data['author'] = 'no-one';
          data['content'] = arty.find('div.post-content').html();

          return data;
        })
        .catch(err => {
          console.log('fail2!' + err);
        });

      articles.push(article);
    }); //forEach

    return articles;
  })
  .then(res => {
    Promise.all(res)
      .then(vals => {
        console.log('scraped! Converting to mobi...');
        vals.shift();

        for (var i = 0; i < vals.length; i++) {
          if (vals[i].title === 'December 18 2017 RRG Notes') {
            console.log(vals[i]);
          }
        }

        var bookData = {
          title: 'Seattle-RRG-Scrape',
          creator: 'Andrew W',
          publisher: 'noone',
          subject: 'guides',

          sections: [
            {
              title: 'Posts',
              articles: vals // [{title, content},{}]
            }
          ]
        };

        htmlToMobi.create(bookData, {
          target: '.' //create folder
        });
      })
      .catch(err => {
        console.log('fail! ' + err);
      });
  })
  .catch(err => {
    console.log('fail! ' + err);
  });
