#!/usr/bin/env bash 

SEARCHWORD="$1"
grep -i $SEARCHWORD ./lyrics/* | wc -l
