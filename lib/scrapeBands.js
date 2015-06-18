/* jshint node:true */
'use strict';

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var bands = [];

function haku(urlList, callback) {
  var outputFile = 'List_of_black_metal_bands.txt';
  var url = '';
  if (urlList.length > 0) {
    url = urlList.pop();
  }
  request(url, function (err, res, body) {
      if (!err) {
          var $ = cheerio.load(body);
          $( '#mw-content-text > table.multicol > tr li > a' ).each(function() {
              var band = $(this).text();
              bands.push(band);
          });
          bands.sort();
          if (urlList.length > 0) {
              haku(urlList, callback);
          } else {
            var bands_as_string = bands.join('\n');
            fs.writeFile(outputFile, bands_as_string, function() {
            console.log('Written ' + bands.length + ' band names to file ' + outputFile);
            callback(bands);
            });
          }
      } else {
          console.log('Error, error.');
      }
  });
}

module.exports = haku;