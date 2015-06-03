/* jshint node:true */
"use strict";

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var urls = ["http://en.wikipedia.org/wiki/List_of_black_metal_bands,_0%E2%80%93K", "http://en.wikipedia.org/wiki/List_of_black_metal_bands,_L%E2%80%93Z"];
var bands = [];

function haku (callback) {
    for (var i = 0; i < urls.length; i++) {
        request(urls[i], function (err, res, body) {
            var $ = cheerio.load(body);
            $( "#mw-content-text > table.multicol > tr li > a" ).each(function (index, element) {
                var band = $(this).text()
                bands.push(band);
            });
            bands.sort();
            if (callback) {
                callback();
            }
        });
    }
};

function tulosta () {
    console.log(bands);
}

function tallenna () {
    var bands_as_string = bands.join('\n');
    fs.writeFile('List_of_black_metal_bands.txt', bands_as_string);
}

haku(tallenna);