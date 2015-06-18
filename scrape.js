/* jshint node:true */
'use strict';

var scrapeBands = require('./lib/scrapeBands.js');
var parseURLs = require('./lib/parseURLs.js');
var verifyURL = require('./lib/verifyURL.js')
var scrapeLyrics = require('./lib/scrapeLyrics.js');
var getLyricURLs = require('./lib/getLyricURLs.js')

var urls = ['http://en.wikipedia.org/wiki/List_of_black_metal_bands,_0%E2%80%93K', 'http://en.wikipedia.org/wiki/List_of_black_metal_bands,_L%E2%80%93Z'];

var bandNames = [];

// Scrape the list of BM bands from Wikipedia.
scrapeBands(urls, function (data) {
  bandNames = data;
  // Parse band names into an array of URLs pointing to band pages in Darklyrics.com
  parseURLs(bandNames, function(result) {
    var unverifiedBandURLs = result.sort().reverse();
    var verifiedBandURLs = [];
    verifyURL(unverifiedBandURLs, function (result) {
        console.log(result);
    });
  });
});
