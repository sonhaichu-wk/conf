#!/bin/bash

domain='*'

if [ -n "$1" ]; then
	domain=$1
fi

mkcert $domain "*.$domain" localhost 127.0.0.1 ::1
