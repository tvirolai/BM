/* jshint node:true */
/*jshint multistr: true */
'use strict';

var scrapeBands = require('./lib/scrapeBands');
var parseURLs = require('./lib/parseURLs');
var getLyricURLs = require('./lib/getLyricURLs');
var getLyrics = require('./lib/getLyrics');
var fs = require('fs-extra');

var dataDir = './data/';
var lyricDir = './lyrics/';
var outputFileForAlbumURLs = './data/List_of_verified_album_URLs.txt';
var urls = ['http://en.wikipedia.org/wiki/List_of_black_metal_bands,_0%E2%80%93K', 
'http://en.wikipedia.org/wiki/List_of_black_metal_bands,_L%E2%80%93Z'];

// If folders for lyrics (./lyrics/) and data (./data/) do not exist, they are created.
fs.ensureDir(dataDir, function (err) {
  if (!err) {
    console.log('Directory ' + dataDir + ' exists.');
  } else {
    console.log('An error occurred with data directory (' + dataDir + ').');
  }
});
fs.ensureDir(lyricDir, function (err) {
  if (!err) {
    console.log('Directory ' + lyricDir + ' exists.');
  } else {
    console.log('An error occurred with lyric directory (' + lyricDir + ').');
  }
});

// Scrape the list of BM bands from Wikipedia.
scrapeBands(urls, function (data) {
  var bandNames = data;
  // Parse band names into an array of URLs pointing to band pages in Darklyrics.com
  parseURLs(bandNames, function (result) {
    var unverifiedBandURLs = result.sort().reverse();
    // Iterate through the array of band URLs
    // Check if each URL works and get the album URLs of each that works
    getLyricURLs(unverifiedBandURLs, function (lyricURLs) {
      var verifiedUrlsAsString = lyricURLs.join('\n');
      fs.writeFile(outputFileForAlbumURLs, verifiedUrlsAsString, function() {
        console.log(lyricURLs.length + ' album URLs written to file \'' + outputFileForAlbumURLs + '\'.');
      });
      // Scrape the lyrics for each album and save them to file.
      var estimatedScrapeTime = (lyricURLs.length * 10 / 60 / 60).toFixed(1);
      console.log('\nScraping lyrics into files. Each album is retrieved at an interval of 10 seconds. \
This will take approximately ' + estimatedScrapeTime + ' hours.\n');
      getLyrics(lyricURLs.reverse());
    });
  });
});
