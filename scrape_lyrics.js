/* jshint node:true */
'use strict';

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var relative_urls = [];
var lyrics_urls = [];
var urlListFile = 'List_of_verified_band_URLS.txt';
var urls = [];

getBandUrls();

function getBandUrls () {
    fs.readFile(urlListFile, 'utf-8', function doneReading(err, contents) {
        if (!err) {
            urls = contents.split('\n');
        }
        haku(parseURLs);
    });
}

function haku (callback) {
    var pageCount = 0;
    for (var i = 0; i < urls.length; i++) {
        request(urls[i], function (err, res, body) {
            if (!err) {
                var $ = cheerio.load(body);
                pageCount += 1;
                console.log(pageCount + " / " + urls.length + " pages scraped...");
                $( "#main > div.cntwrap > div a" ).each(function (index, element) {
                    var link = $(this).attr('href');
                    relative_urls.push(link);
                });
                relative_urls.sort();
                if (pageCount == urls.length) {
                    if (callback) {
                        callback();
                    }
                }
            } else {
                console.log('Error, error.');
            }

        });

    }
}


function parseURLs () {
    relative_urls.forEach(function (value, index) {
        var parsed_url = 'http://www.darklyrics.com' + value.substring(2, value.indexOf('\#'));
        if (lyrics_urls.indexOf(parsed_url) < 0) {
            console.log('Writing: ' + parsed_url);
            lyrics_urls.push(parsed_url);
        }
        if (index == relative_urls.length - 1) {
            var urls_as_string = lyrics_urls.join('\n');
            fs.writeFile('List_of_album_lyric_URLS.txt', urls_as_string);
            console.log(lyrics_urls.length + ' album URLs written to file.');
        }
    });
}