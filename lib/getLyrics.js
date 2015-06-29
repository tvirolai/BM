/*jslint node: true */
'use strict';

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var LanguageDetect = require('languagedetect');

var lngDetector = new LanguageDetect();

var songCount = 0;

module.exports = function getLyrics(urls) {
  var url = urls.pop();
  request(url, function(err, res, body) {
    if (!err) {
      var $ = cheerio.load(body);
      var band = $('#main > div.cntwrap > div > h1').text();
      var songs = [];
      $('#main > div.cntwrap > div > div.lyrics > h3 > a').each(function () {
        var songtitle = $(this).text();
        songs.push(songtitle);
      });
      var lyrics = $( '#main > div.cntwrap > div > div.lyrics' ).text();
      band = band.substring(0, band.indexOf('LYRICS')).trim();
      var albumlyrics = {};
      for (var i = 0; i < songs.length; i++) {
        var songlyrics = "";
        var title = band + '-' + songs[i];
        if (i < songs.length - 1) {
          songlyrics = lyrics.substring(lyrics.indexOf(songs[i]), lyrics.indexOf(songs[i+1]));
        } else {
          songlyrics = lyrics.substring(lyrics.indexOf(songs[i]));
        }
        if (isEnglish(songlyrics) && hasLyrics(songlyrics)) {
          albumlyrics[title] = songlyrics;
          saveToFile(band, title, songlyrics);
        }
      }
      if (urls.length > 0) {
        setTimeout(function () {
          getLyrics(urls);
        }, 10000);
      } else {
        console.log('Done.');
      }
    } else {
      console.log('An error occurred.');
      console.log(url);
      console.log(err);
    }
  });
};

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

function saveToFile(band, title, lyric) {
  var songtitle = title.substring(title.indexOf('.') + 2);
  songtitle = normalize(songtitle);
  band = normalize(band);
  var filename = band + '-' + songtitle + '.txt';
  fs.writeFile('./lyrics/' + filename, lyric);
  songCount += 1;
  console.log(songCount + '. ' + filename);
}

function normalize(string) {
  return string.replace(/\s/g, '_').replace(/\.|\'|\"|\:|#|\/|\(|\)|,/g, '').replace('&', 'and');
}