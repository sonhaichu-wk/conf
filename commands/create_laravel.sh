#!/bin/bash

prj_name='laravel-test'
prj_version='7.x'

if [ -n "$1" ]; then
  prj_name=$1;
fi

if [ -n "$2" ]; then
  prj_version=$2;
fi

composer create-project --prefer-dist laravel/laravel $prj_name $prj_version
