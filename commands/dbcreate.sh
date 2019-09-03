#!/bin/bash

char='utf8mb4'
collate='utf8mb4_general_ci'

if [ -n "$2" ]; then
	char=$2
fi

if [ -n "$3" ]; then
	collate=$3
fi

mysql --login-path=client -e "create database if not exists $1 character set $char collate $collate"
