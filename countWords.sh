#!/usr/bin/env bash 

SEARCHWORD="$1"
grep -i $SEARCHWORD ./lyrics/*.txt | wc -l
