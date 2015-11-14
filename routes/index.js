var express = require('express');
var router = express.Router();
var http = require('http');
var parser = require('xml2json');
var feed_url = "http://feeds.rebuild.fm/rebuildfm";

/* GET home page. */
router.get('/', function(req, res, next) {
  http.get(feed_url, function(feed_res){
    var body = "";
    feed_res.setEncoding('utf8');

    feed_res.on('data', function(chunk) {
      body += chunk;
    });

    feed_res.on('end', function() {
      var feed_raw_json = parser.toJson(body);
      var feed_json = JSON.parse(feed_raw_json);
      var items = feed_json.rss.channel.item;
      console.log(feed_json.rss.channel.item[0]);

      res.render('index', { items: items});
    });
  }).on('error', function(e) {
    console.log(e.message);
  });
});

module.exports = router;
