#!/bin/bash

name=$1;

if [ -n "$2" ]; then
	name=$2
fi

mysqldump --login-path=client $1 > ~/Desktop/$name.sql

