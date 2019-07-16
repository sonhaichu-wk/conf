#!/bin/bash

charset='utf8mb4'
collation='utf8mb4_general_ci'

if [ -n "$2" ]; then
		charset=$2
fi

if [ -n "$3" ]; then
		collation=$3
fi

mysql --login-path=client -e "create database if not exists $1 character set $charset collate $collation;"
