/*jslint node: true */
'use strict';

var fs = require('fs');
var gramophone = require('gramophone');
var input = "../data/testi.txt";

fs.readFile(input, 'utf-8', function read(err, data) {
	if (err) {
		throw err;
	}
	var phrases = gramophone.extract(data, {ngrams: [3, 4, 5, 6, 7, 8, 9], score: true});
	tulosta(phrases);
});

function tulosta(tulos) {
	for (var i = 0; i < tulos.length; i++) {
		console.log(tulos[i].tf + " " + tulos[i].term); 
	}
}