/* jshint node:true */
"use strict";

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

var file = 'List_of_black_metal_bands.txt';
var url = "http://www.darklyrics.com/";
var bands = [];
var band_urls = [];
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

function parseUrls() {
	for (var i = 0; i < bands.length; i++) {
		var band = normalizer(bands[i]);
		var initial = band[0];
		if (! isNaN(initial) ) {
			initial = "19";
		}
		var band_url = url + initial + "\/" + band + ".html";
		band_urls.push(band_url);
	}
	band_urls.forEach(function (url, index) {
		verify_URL(url, index);
	})
};

function result () {
	var percentage = Math.round(verifiedUrls.length / band_urls.length * 100);
	console.log(percentage + " % (" + verifiedUrls.length + "/" + band_urls.length + ") of the contructed URLs work.");
	var verifiedUrls_as_string = verifiedUrls.join('\n');
	fs.writeFile('List_of_verified_band_URLS.txt', verifiedUrls_as_string);
}

function verify_URL (url, index) {
	request(url, function (err, res) {
		if (res.statusCode === 200) {
			console.log(url + " works!");
			verifiedUrls.push(url);
			if (index == band_urls.length - 1) {
				result();
			}
		} else {
			console.log(url + " does not exist.");
		}
	});
}

function normalizer (string) {
	var s = string.toLowerCase();
	var normalizedString = '';
	for (var i = 0; i < s.length; i++) {
		if (normalizationMap[s[i]] != undefined) {
			normalizedString += normalizationMap[s[i]];
		} else {
			normalizedString += s[i];
		}
	}
	return normalizedString;
}

bandlist(parseUrls);