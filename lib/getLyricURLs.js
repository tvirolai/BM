/* jshint node:true */
'use strict';

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var relativeURLs = [];
var lyricsURLs = [];
var urlListFile = 'List_of_verified_band_URLS.txt';
var urls = [];

var debug = 0;

module.exports = function getLyricURLs(list, callback) {
  var url = list.pop();
  //
  debug++;
  console.log("Retrieving URL no. " + debug + ".");
  console.log(list.length + " URLs to go.");
  //

  if (url === undefined) {
    callback(lyricsURLs);
  } else {
    request(url, function (err, res, body) {
      if (!err) {
        if (res.statusCode === 200) {
          var numberOfAlbums = 0;
          var $ = cheerio.load(body);
          var bandName = $( "#main > div.cntwrap > div > h1").text();
          bandName = bandName.substring(0, bandName.lastIndexOf(' '));
          $( "#main > div.cntwrap > div a" ).each(function (index, element) {
            var link = $(this).attr('href');
            var parsedUrl = 'http://www.darklyrics.com' + link.substring(2, link.indexOf('\#'));
            if (lyricsURLs.indexOf(parsedUrl) < 0) {
              numberOfAlbums += 1;
              lyricsURLs.push(parsedUrl);
            }
          });
        }
        if (numberOfAlbums === undefined) {
          numberOfAlbums = "No";
          bandName = "\'" + url.substring((url.lastIndexOf('\/') + 1), url.lastIndexOf('.')) + "\'";
        }
        console.log(numberOfAlbums + " albums found for " + bandName.toUpperCase());

        //
        console.log("=========================================");
        //

        getLyricURLs(list, callback);
      } else {
        console.log("An error occurred.");
      }
    });
  }
}