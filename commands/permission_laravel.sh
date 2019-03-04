#!/bin/bash

folder='storage'

if [ -n "$1" ]; then
	folder=$1
fi

sudo chown -R $USER:www-data $folder/ &&\
sudo chmod -R 775 $folder/
