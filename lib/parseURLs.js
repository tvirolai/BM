/* jshint node:true */
'use strict';

var request = require('request');
var fs = require('fs');

var file = 'List_of_black_metal_bands.txt';
var url = 'http://www.darklyrics.com/';
var outputFile = 'List_of_verified_band_URLS.txt';
var bands = [];

var verifiedUrls = [];

var normalizationMap = {
  'å': 'a',
  'ä': 'a',
  'ă': 'a',
  'ö': 'a',
  '-': '',
  '.': '',
  '\'': '',
  ' ': '',
  'ï': 'i',
  'ó': 'o',
  'ø': 'o',
  'á': 'a',
  'ü': 'u',
  ')': ''
};

function bandlist(callback) {
  fs.readFile(file, 'utf-8', function doneReading(err, contents) {
    if (!err) {
      bands = contents.split('\n');
    }
    callback();
  });
}

function parseUrls(list, callback) {
  var band_urls = [];
  for (var i = 0; i < list.length; i++) {
    var band = normalizer(list[i]);
    var initial = band[0];
    if (! isNaN(initial) ) {
      initial = '19';
    }
    var band_url = url + initial + '\/' + band + '.html';
    band_urls.push(band_url);
  }
  callback(band_urls);
}

function result(list) {
  var percentage = Math.round(verifiedUrls.length / band_urls.length * 100);
  console.log(percentage + ' % (' + verifiedUrls.length + '/' + band_urls.length + ') of the contructed URLs work.');
  var verifiedUrls_as_string = verifiedUrls.join('\n');
  fs.writeFile(outputFile, verifiedUrls_as_string);
}

function normalizer (string) {
  var s = string.toLowerCase();
  var normalizedString = '';
  for (var i = 0; i < s.length; i++) {
    if (normalizationMap[s[i]] !== undefined) {
      normalizedString += normalizationMap[s[i]];
    } else {
      normalizedString += s[i];
    }
  }
  return normalizedString;
}

module.exports = parseUrls;