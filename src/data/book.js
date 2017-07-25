
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const superagent = require('superagent')
require('superagent-charset')(superagent)
const async = require('async');

const urlList = require('.urls')
let num = 1;
let urlId = num  //第几本书+1
let url = urlList[urlId - 1]  //url地址
let total = 0 //总章节数
let id = 0 //计数器
const chapters = 10 //爬取多少章

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'book2',
  port: 3306
})

//去除前后空格和&nbsp;转义字符
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '').replace(/&nbsp;/g, '')
}

//将Unicode转汉字
function reconvert(str) {
  str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
    return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
  });
  return str
}

function fetchUrl(url, callback, id) {
  superagent.get(url)
    .charset('gbk')   //该网站用了gbk编码，用到了superagent-charset
    .end(function (err, res) {
      let $ = cheerio.load(res.text)
      const arr = []
      const content = reconvert($("#content").html())
      //分析结构后分割html
      const contentArr = content.split('<br><br>')
      contentArr.forEach(elem => {
        const data = trim(elem.toString())
        arr.push(data)
      })
      const obj = {
        id: id,
        err: 0,
        bookName: $('.footer_cont a').text(),
        title: $('.bookname h1').text(),
        content: arr.join('-')  //由于需要保存至mysql中，不支持直接保存数组，所以将数组拼接成字符串，取出时再分割字符串即可
      }
      callback(null, obj)  
    })
}

// function saveToMysql(results){
//   result.some(function(result){
//     pool.query('insert into book' + table + ' set ?',result ,function(err,result1){
//       if(err) throw err
//       console.log('insert' result.id +'success')
//       if(result.id === results.length){
//         //写入完成，开始爬取下一本书
//         urlId++;
//         url = urlList[urlId - 1];
//         table++;
//         id=0;
//         console.log('第'+urlId+'本书');
//         main(url);
//         return true;
//       }
//     })
//   })
// }
function resp(results){
  results.some(function (result) {
      if (result.id == results.length) {  //写入完成后开始爬取下一本书
        urlId++
        url = urlList[urlId - 1]
        table++
        id = 0
        console.log(`第${urlId}本书`)
        main(url)
        return true
      }
  })
  response.send(results);
}

function main(url){
  superagent.get(url)
      .charset('gbk')
      .end(function (err, res) {
        var $ = cheerio.load(res.text);
        let urls = []
        total = $('#list dd').length
        console.log(`共${$('#list dd').length}章`)
        $('#list dd').each(function (i, v) {
          if (i < chapters) {
            urls.push('http://www.zwdu.com' + $(v).find('a').attr('href'))
          }
        })

        async.mapLimit(urls, 10, function (url, callback) {
          id++
          fetchUrl(url, callback, id) //需要对章节编号，所以通过变量id来计数
        }, function (err, results) {
          resp(results)
        })
      })
}

app.get('/', function (req, response, next) {
  main(url)
})

app.listen(3378, function () {
  console.log('server listening on 3378')
})