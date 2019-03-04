#!/bin/bash

mysqldump --login-path=client $1 > ~/Desktop/$1.sql

