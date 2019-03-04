#!/bin/bash

mysql --login-path=client -e "drop database if exists $1;"\
&& mysql --login-path=client -e "create database if not exists $1;"\
&& mysql --login-path=client $1 < $2
