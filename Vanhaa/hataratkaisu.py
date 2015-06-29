#!/usr/bin/env python
# -*- coding: utf-8 -*

import time
import urllib.request

with open('List_of_album_lyric_URLS.txt') as f:
	lista = f.read().split("\n")

for i, url in enumerate(lista):
	file_name = str(i) + ".html"
	print(url)
	response = urllib.request.urlopen(url)
	urllib.request.urlretrieve(url, file_name)
	data = response.read()
	text = data.decode('utf-8')
	print(text)
	time.sleep(2)