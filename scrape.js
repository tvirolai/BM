/* jshint node:true */
'use strict';

var scrapeBands = require('./lib/scrapeBands.js');
var urls = ['http://en.wikipedia.org/wiki/List_of_black_metal_bands,_0%E2%80%93K', 'http://en.wikipedia.org/wiki/List_of_black_metal_bands,_L%E2%80%93Z'];

var bandNames = [];

scrapeBands(urls, function (data) {
	bandNames = data;
	bandNames.forEach(function(item) {
		console.log(item);
	});
});