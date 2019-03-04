#!/bin/bash

mysql --login-path=client -e "create database if not exists $1"
