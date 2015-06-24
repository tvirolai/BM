/* jshint node:true */
'use strict';

var request = require('request');
var cheerio = require('cheerio');
var lyricsURLs = [];
var total = 0;

var debug = 0;

module.exports = function getLyricURLs(list, callback) {
  if (list.length > total) {
    total = list.length;
  }
  var url = list.pop();
  var bandName = '';
  var numberOfAlbums = 0;
  //
  debug++;
  console.log('Retrieving URL no. ' + debug + ' / ' + total + '.');
  //

  if (url === undefined) {
    lyricsURLs = stripList(lyricsURLs);
    callback(lyricsURLs);
  } else {
    request(url, function (err, res, body) {
      if (!err) {
        if (res.statusCode === 200) {
          var $ = cheerio.load(body);
          bandName = $( '#main > div.cntwrap > div > h1').text();
          bandName = bandName.substring(0, bandName.lastIndexOf(' '));
          $( '#main > div.cntwrap > div a' ).each(function () {
            var link = $(this).attr('href');
            var parsedUrl = 'http://www.darklyrics.com' + link.substring(2, link.indexOf('#'));
            if (lyricsURLs.indexOf(parsedUrl) < 0) {
              numberOfAlbums += 1;
              lyricsURLs.push(parsedUrl);
            }
          });
        }
        if (numberOfAlbums === 0) {
          numberOfAlbums = 'No';
          bandName = '\'' + url.substring((url.lastIndexOf('\/') + 1), url.lastIndexOf('.')) + '\'';
        }
        console.log(numberOfAlbums + ' albums found for ' + bandName.toUpperCase());

        //
        console.log('=========================================');
        //
        getLyricURLs(list, callback);
      } else {
        console.log('An error occurred.');
      }
    });
  }
};

// This function strips invalid URLs from the list
function stripList(list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].length < 35) {
      list.splice(i, 1);
    }
  }
  return list;
}