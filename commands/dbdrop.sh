#!/bin/bash

mysql --login-path=client -e "drop database if exists $1"
