#!/bin/bash

charset='utf8mb4'
collation='utf8mb4_general_ci'

mysql --login-path=client -e "drop database if exists $1;"\
&& mysql --login-path=client -e "create database if not exists $1 character set $charset collate $collation;"\
&& mysql --login-path=client $1 < $2
