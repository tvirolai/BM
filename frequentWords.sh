#!/usr/bin/env bash
cat ./lyrics/*.txt | 
tr '[:upper:]' '[:lower:]' |
grep -oE '\w+\s\w+' |
sort |
uniq -c |
sort -nr |
head -n 100
