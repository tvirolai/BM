/* jshint node:true */
'use strict';

var request = require('request');
var fs = require('fs');
var verifiedURLs = [];
var outputFile = './data/List_of_verified_band_URLs.txt';

module.exports = function verifyURL(urls, callback) {
  if (urls.length === 0) {
    var verifiedUrlsAsString = verifiedURLs.join('\n');
    fs.writeFile(outputFile, verifiedUrlsAsString, function() {
      console.log(verifiedURLs.length + " verified band URLs written to " + outputFile);
    });
    callback(verifiedURLs);
  }
  else {
    var url = urls.pop();
    request(url, function (err, res) {
      if (!err) {
        if (res.statusCode === 200) {
          console.log(url + ' works!');
          verifiedURLs.push(url);
          verifyURL(urls, callback);
        } else {
          console.log(url + ' does not exist.');
          verifyURL(urls, callback);
        }
      } else {
        throw err;
      }
    });
  }
};