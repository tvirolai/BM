#!/usr/bin/env python
# -*- coding: utf-8 -*

import os
import operator
import math
import argparse
from matplotlib import pyplot as plt


class Analyzer(object):

    def __init__(self):
        lyricPath = './lyrics/'
        namePath = './data/'
        self.lyrics = self.lyricsAsDict(lyricPath)
        self.names = {}
        self.hellNames = {}
        namesAsString = self.readFiles(
            namePath, 'infernalNames.txt', 'namesForTheDevil.txt')
        hellNamesAsString = self.normalize(self.readFiles(
            namePath, 'namesForHell.txt'))
        for x in namesAsString.split('\n'):
            self.names[x] = 0
        for x in hellNamesAsString.split('\n'):
            self.hellNames[x] = 0

        self.averageNumberOfNames, self.averageNumberOfHellNames\
            = self.countAverages()

        self.bandsDistances, self.listOfAverageNumbersOfNames,\
            self.listOfAverageNumbersOfHellNames, self.listOfBandNames,\
            self.listOfTopIndeces = self.calculateSatanicFactor()

    def printSatanFreq(self):
        print("Most evil names:")
        for i, x in enumerate(self.printDictSortedByValue(
                self.averageNumberOfNames)):
            index = i + 1
            print(str(index) + ".", self.printableBandNames(x[0]), x[1])

    def printHellFreq(self):
        print("Most Hell names:")
        for i, x in enumerate(self.printDictSortedByValue(
                self.averageNumberOfHellNames)):
            index = i + 1
            print(str(index) + ".", self.printableBandNames(x[0]), x[1])

    def printSatanicFactor(self):
        print("Most satanic bands:")
        for i, x in enumerate(self.printDictSortedByValue(
                self.bandsDistances)):
            index = i + 1
            print(str(index) + ".", self.printableBandNames(
                x[0]), round((x[1]), 2))

    def plotAllBands(self):
        self.scatterplotWithoutLabels(self.listOfAverageNumbersOfHellNames,
                                      self.listOfAverageNumbersOfNames)

    def plotTopBands(self, number=5):
        # This function plots the number of bands specified in the argument.
        # Or 5 if no argument is provided.
        index = number - 1
        listOfTopIndeces = []

        for i, band in enumerate(self.printDictSortedByValue(
                self.bandsDistances)):
            bandIndex = self.listOfBandNames.index(band[0])
            listOfTopIndeces.append(bandIndex)
            if i >= index:
                break

        FILTEREDlistOfAverageNumbersOfNames = []
        FILTEREDlistOfAverageNumbersOfHellNames = []
        FILTEREDlistOfBandNames = []

        for index in listOfTopIndeces:
            FILTEREDlistOfAverageNumbersOfNames.append(
                self.listOfAverageNumbersOfNames[index])
            FILTEREDlistOfAverageNumbersOfHellNames.append(
                self.listOfAverageNumbersOfHellNames[index])
            FILTEREDlistOfBandNames.append(self.listOfBandNames[index])

        self.scatterplot(FILTEREDlistOfAverageNumbersOfHellNames,
                         FILTEREDlistOfAverageNumbersOfNames,
                         FILTEREDlistOfBandNames)

    def countAverages(self):
        # Total number of mentions of Devil / band
        hits = {}

        # Total number of songs of each band
        songs = {}

        # Total number of Hell names / band
        hellNameHits = {}

        averageNumberOfNames = {}
        averageNumberOfHellNames = {}

        for x in self.lyrics:
            hitCount = 0
            hellNameHitCount = 0
            if not x["BAND"] in hellNameHits:
                hellNameHits[x["BAND"]] = 0
            if not x["BAND"] in hits:
                hits[x["BAND"]] = hitCount
            if not x["BAND"] in songs:
                songs[x["BAND"]] = 1
            if x["BAND"] in songs:
                songs[x["BAND"]] += 1
            for n in self.names:
                hitCount = x["LYRICS"].count(self.normalize(n))
                hits[x["BAND"]] += hitCount
            for y in self.hellNames:
                hellNameHitCount = x["LYRICS"].count(self.normalize(y))
                hellNameHits[x["BAND"]] += hellNameHitCount

        for band in songs:
            songCount = songs[band]
            nameCount = hits[band]
            hellNameCount = hellNameHits[band]
            averageNumberOfNames[band] = self.bandAverage(nameCount, songCount)
            averageNumberOfHellNames[band] = self.bandAverage(hellNameCount,
                                                              songCount)
        return averageNumberOfNames, averageNumberOfHellNames

    # Below are helper functions not to be accessed directly

    def calculateSatanicFactor(self):

        listOfAverageNumbersOfNames = []
        listOfAverageNumbersOfHellNames = []
        listOfBandNames = []
        listOfTopIndeces = []

        bandsDistances = {}

        for band in self.averageNumberOfNames:
            listOfBandNames.append(band)
            listOfAverageNumbersOfNames.append(self.averageNumberOfNames[band])
            listOfAverageNumbersOfHellNames.append(
                self.averageNumberOfHellNames[band])

        for i, band in enumerate(listOfBandNames):
            bandsDistances[band] = self.distanceFromOrigin(
                listOfAverageNumbersOfNames[i],
                listOfAverageNumbersOfHellNames[i])

        return bandsDistances, listOfAverageNumbersOfNames,\
            listOfAverageNumbersOfHellNames, listOfBandNames, listOfTopIndeces

    def scatterplot(self, xaxis, yaxis, labels):
        plt.scatter(xaxis, yaxis)
        plt.axis([0, 3, 0, 3])
        for label, xaxis_value, yaxis_value in zip(labels, xaxis, yaxis):
            plt.annotate(self.printableBandNames(label),
                         xy=(xaxis_value, yaxis_value),
                         xytext=(-50, 5),
                         textcoords='offset points')
        plt.title("Most satanic Black Metal bands")
        plt.xlabel("Average mentions of Hell / song")
        plt.ylabel("Average mentions of Satan / song")
        plt.show()

    def scatterplotWithoutLabels(self, xaxis, yaxis):
        plt.scatter(xaxis, yaxis)
        plt.axis([0, 3, 0, 3])
        plt.title("Satanic scatterplot")
        plt.xlabel("Average mentions of Hell / song")
        plt.ylabel("Average mentions of Satan / song")
        plt.show()

    def distanceFromOrigin(self, x, y):
        return math.sqrt(pow(x, 2) + pow(y, 2))

    def printableBandNames(self, string):
        return string.replace('_', ' ')

    def lyricsAsDict(self, path):
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
        # This function takes a string (an individual song) and returns it
        # stripped of metadata.
        lyrics = lyrics.lower()
        if ("webmaster@darklyrics.com") in lyrics:
            lastIndex = lyrics.index("submits")
            lyrics = lyrics[0:lastIndex]
        if ("thanks to") in lyrics:
            lastIndex = lyrics.index("thanks")
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

    def bandAverage(self, nameCount, songCount):
        return round((nameCount / songCount), 2)

    def normalize(self, string):
        return string.lower()

    def printDictSortedByValue(self, variable):
        sortedDict = sorted(variable.items(),
                            key=operator.itemgetter(1), reverse=True)
        return sortedDict

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Analyzer")
    parser.add_argument("-s", "--printsatan",
                        help="Print Satan frequency of each band",
                        action='store_true')
    parser.add_argument("-p", "--printhell",
                        help="Print Hell frequency of each band",
                        action='store_true')
    parser.add_argument("-f", "--printfactor",
                        help="Print satanic factor of each band",
                        action='store_true')
    parser.add_argument("-t", "--plottop",
                        help="Plot top bands",
                        action='store_true')
    parser.add_argument("-a", "--plot",
                        help="Plot all bands as a scatterplot",
                        action='store_true')
    args = parser.parse_args()
    analyzer = Analyzer()
    if args.printsatan:
        analyzer.printSatanFreq()
    if args.printhell:
        analyzer.printHellFreq()
    if args.printfactor:
        analyzer.printSatanicFactor()
    if args.plot:
        analyzer.plotAllBands()
    if args.plottop:
        analyzer.plotTopBands()
