/*jslint node: true */
'use strict';

var fs = require('fs');
var file = 'List_of_verified_album_URLs.txt';
var getLyrics = require('./getLyricsYO');

function readURLS(input, callback) {
	fs.readFile(input, 'utf-8', function doneReading(err, contents) {
		var list = contents.split("\n");
		callback(list);
	});
}

readURLS(file, stripList);

function stripList(list) {
	console.log("Unedited list contains " + list.length + " items.");
	for (var i = 0; i < list.length; i++) {
		if (list[i].length < 35) {
			list.splice(i, 1);
		}
	}
	console.log("Edited list contains " + list.length + " items.");
}