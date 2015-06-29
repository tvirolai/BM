#!/usr/bin/env bash
cat ./lyrics/*.txt | 
tr '[:upper:]' '[:lower:]' |
grep -oE "[a-zA-Z\']+" |
sort |
uniq -c |
sort -nr |
head -n 100
