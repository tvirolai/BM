/* jshint node:true */
'use strict';

var request = require('request');

module.exports = function verifyURL(url) {
  request(url, function (err, res) {
    if (res.statusCode === 200) {
      console.log(url + ' works!');
      return true;
    } else {
      console.log(url + ' does not exist.');
      return false;
    }
  });
}