/* jshint node:true */
'use strict';

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var LanguageDetect = require('languagedetect');
var albumUrlFile = 'List_of_album_lyric_URLS.txt';
var urls = [];
var lyric_url = "";

var lngDetector = new LanguageDetect();

var songCount = 0;

getAlbumUrls();

//getLyrics('http://www.darklyrics.com/lyrics/bethlehem/schattenausderalexanderwelt.html');

function getAlbumUrls () {
    fs.readFile(albumUrlFile, 'utf-8', function doneReading(err, contents) {
        if (!err) {
            urls = contents.split('\n');
            urls.reverse();
        }
				getLyrics(urls.pop());
    });
}

function getLyrics (url) {
	request(url, function (err, res, body) {
		if (! err) {
			var $ = cheerio.load(body);
			var band = $( '#main > div.cntwrap > div > h1' ).text();
			var songs = [];
			$( '#main > div.cntwrap > div > div.lyrics > h3 > a' ).each(function () {
				var songtitle = $(this).text();
				songs.push(songtitle);
			});
			var lyrics = $( '#main > div.cntwrap > div > div.lyrics' ).text();
			band = band.substring(0, band.indexOf('LYRICS')).trim();
			var albumlyrics = {};
		  for (var i = 0; i < songs.length; i++) {
		  	var title = band + '-' + songs[i];
		  	var songlyrics = lyrics.substring(lyrics.indexOf(songs[i]), lyrics.indexOf(songs[i+1]));
		  	if (isEnglish(songlyrics) && hasLyrics(songlyrics)) {
		  		albumlyrics[title] = songlyrics;
		  		saveToFile(band, title, songlyrics);
		  	}
		  }

		  if (urls.length > 0) {
		  	setTimeout(function () {
		  		lyric_url = urls.pop();
		  		console.log("URL is " + lyric_url);
		  		if (function () {
		  			request(lyric_url, function (err, res) {
		  				if (res.statusCode === 200) {
		  					return true;
		  				}
		  			})}) 
		  		{
		  			getLyrics(lyric_url);
		  		} else {
		  			console.log("Jaha.");
		  			getLyrics(urls.pop());
		  		}
		  	}, 10000)
		  } else {
		  	console.log("Done.");
		  }
		//console.log(albumlyrics);
		} else {
			console.log('An error occurred.');
			console.log(url);
			console.log(err);
		}
	});
}

function isEnglish (lyric) {
	var language = lngDetector.detect(lyric, 1);
	language = language[0];
	if (language == undefined) {
		return false;
	}
	if (language.indexOf('english') < 0) {
		return false;
	} else {
		return true;
	}
}

function hasLyrics (lyric) {
	if (lyric.length < 50) {
		return false;
	} else {
		return true;
	}
}

function saveToFile (band, title, lyric) {
	var songtitle = title.substring(title.indexOf('.') + 2).replace(/\s/g, '_').replace(/\.|\'|\"|\:/g, '');
	var filename = band + '-' + songtitle + '.txt';
	fs.writeFile('lyrics/' + filename, lyric);
	songCount += 1;
	console.log(songCount + ". " + filename);
}