#!/bin/bash

dir='./'
port=8000

if [ -n "$1" ]; then
	port=$1
fi

if [ -n "$2" ]; then
	dir=$2
fi

php -S localhost:$port -t $dir
