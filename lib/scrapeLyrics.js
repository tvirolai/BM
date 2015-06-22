/*jslint node: true */
'use strict';

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var LanguageDetect = require('languagedetect');
var albumUrlFile = './data/List_of_album_lyric_URLS.txt';
var urls = [];
var lyric_url = '';

var lngDetector = new LanguageDetect();

var songCount = 0;

//getLyrics('http://www.darklyrics.com/lyrics/bethlehem/schattenausderalexanderwelt.html');

module.exports = function getLyrics(url) {
  request(url, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      console.log("URL " + url + " works!");
      var $ = cheerio.load(body);
      var band = $( '#main > div.cntwrap > div > h1' ).text();
      var songs = [];
      $('#main > div.cntwrap > div > div.lyrics > h3 > a').each(function () {
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
      } else {
      console.log('An error occurred.');
      console.log(url);
      console.log(err);
    }
  });
}

function isEnglish(lyric) {
  var language = lngDetector.detect(lyric, 1);
  language = language[0];
  if (language === undefined) {
    return false;
  }
  if (language.indexOf('english') < 0) {
    return false;
  } else {
    return true;
  }
}

function hasLyrics(lyric) {
  if (lyric.length < 50) {
    return false;
  } else {
    return true;
  }
}

function saveToFile (band, title, lyric) {
  var band = band.replace(/\s/g, '_').replace(/\.|\'|\'|\:|\/|\(|\)|,/g, '');
  var songtitle = title.substring(title.indexOf('.') + 2).replace(/\s/g, '_').replace(/\.|\'|\'|\:|\/|\(|\)|,/g, '');
  var filename = band + '-' + songtitle + '.txt';
  fs.writeFile('lyrics/' + filename, lyric);
  songCount += 1;
  console.log(songCount + '. ' + filename);
}