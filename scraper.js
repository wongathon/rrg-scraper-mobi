const request = require('request')
const cheerio = require('cheerio')
const rp = require('request-promise') 
const htmlToMobi = require('html-to-mobi')

const path = 'https://palegreendot.net/'

rp(path).then( html => {
  let $ = cheerio.load(html)
  let pathExt = []
  $('a.post-link').each((i, element)=>{
    let a = element.attribs.href
    pathExt.unshift(a)
    //console.log(a)
  })

  return pathExt
    
}).then( res => {
  let newPaths = []
  let pathS = path.slice(0, -1)

  res.forEach(element => {
    newPaths.push(pathS + element)
  })

  return newPaths

}).then( res => {

  var articles = []
  
  res.forEach(link => {
    var article = rp(link).then( html => {
      var data = {}
      let $ = cheerio.load(html)
      let arty = $('article.post')
      
      data.title = arty.find('h1.post-title').text()
      data.content = arty.find('div.post-content').html()


      //console.log(data.title)
      articles.push(data)

      //console.log(articles.length)

    }).catch(err => {
      console.log('fail2!')
    })  
    
    article.then(dat => {
      console.log(articles.length)
    })

  })//forEach

  //return articles

}).then( res => {
  console.log(res)

  // var bookData = {

  //   'title'    : 'Seattle RRG Scrape',
  //   'creator'  : 'Andrew W',
  //   'publisher': 'noone',
  //   'subject'  : 'guides',

  //   'sections' : [{
  //     'title' : 'Posts',
  //     'articles' : result // [{title, content},{}]
  //   }]
  // }

  // htmlToMobi.create(bookData, {
  //   target : '.' //create folder
  // })
})

.catch( err => {
  console.log("fail!")
})


