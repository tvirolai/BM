#!/usr/bin/env python
# -*- coding: utf-8 -*

import os
import csv
import operator


class Analyzer(object):

    def __init__(self):
        lyricPath = './lyrics/'
        namePath = './data/'
        self.lyrics = self.lyricsAsCSV(lyricPath)
        self.names = {}
        namesAsString = self.readFiles(
            namePath, 'infernalNames.txt', 'namesForTheDevil.txt')
        for x in namesAsString.split('\n'):
            self.names[x] = 0

    def lyricsAsCSV(self, path):
        csv_columns = ["ID", "BAND", "SONG", "LYRICS"]
        files = os.listdir(path)
        lyricsDicts = []
        for i, file in enumerate(files):
            record = {}
            band = file[0:file.index('-')]
            song = file[file.index('-') + 1:-4]
            file = path + file
            with open(file, 'rt') as f:
                lyrics = f.read()
                lyrics = self.cleanLyrics(lyrics)
            record["ID"] = i
            record["BAND"] = band
            record["SONG"] = song
            record["LYRICS"] = lyrics
            lyricsDicts.append(record)
        return lyricsDicts

    def cleanLyrics(self, lyrics):
        lyrics = lyrics.lower()
        if ("webmaster@darklyrics.com") in lyrics:
            lastIndex = lyrics.index("submits")
            lyrics = lyrics[0:lastIndex]
        return lyrics

    def readFiles(self, path, *args):
        files = []
        if len(args) == 0:
            files = os.listdir(path)
        else:
            for arg in args:
                files.append(arg)
        fileContents = ""
        for file in files:
            file = path + file
            with open(file, 'rt') as f:
                content = f.read()
                fileContents += content
        return fileContents

    def countNames(self):
        hits = {}
        for x in self.lyrics:
            hitCount = 0
            if not x["BAND"] in hits:
                hits[x["BAND"]] = hitCount
            for n in self.names:
                hitCount = x["LYRICS"].count(self.normalize(n))
                hits[x["BAND"]] += hitCount
        sortedHits = sorted(hits.items(),
                            key=operator.itemgetter(1), reverse=True)
        for line in sortedHits:
            print(line[0] + ": " + str(line[1]))

    def normalize(self, string):
        return string.lower()

if __name__ == '__main__':
    analyzer = Analyzer()
    analyzer.countNames()
    #lyrics = readFiles(lyricPath)
