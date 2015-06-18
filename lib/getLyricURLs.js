/* jshint node:true */
'use strict';

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var relativeURLs = [];
var lyricsURLs = [];
var urlListFile = 'List_of_verified_band_URLS.txt';
var urls = [];

module.exports = function getLyricURLs (list, callback) {
  var pageCount = 0;
  for (var i = 0; i < urls.length; i++) {
      request(urls[i], function (err, res, body) {
          if (!err) {
              var $ = cheerio.load(body);
              pageCount += 1;
              console.log(pageCount + " / " + urls.length + " pages scraped...");
              $( "#main > div.cntwrap > div a" ).each(function (index, element) {
                  var link = $(this).attr('href');
                  relativeURLs.push(link);
              });
              relativeURLs.sort();
              if (pageCount == urls.length) {
                  if (callback) {
                      callback();
                  }
              }
          } else {
              console.log('Error, error.');
          }

      });

  }
}

function parseURLs () {
  relativeURLs.forEach(function (value, index) {
      var parsed_url = 'http://www.darklyrics.com' + value.substring(2, value.indexOf('\#'));
      if (lyricsURLs.indexOf(parsed_url) < 0) {
          console.log('Writing: ' + parsed_url);
          lyricsURLs.push(parsed_url);
      }
      if (index == relativeURLs.length - 1) {
          var urls_as_string = lyricsURLs.join('\n');
          fs.writeFile('List_of_album_lyric_URLS.txt', urls_as_string);
          console.log(lyricsURLs.length + ' album URLs written to file.');
      }
  });
}