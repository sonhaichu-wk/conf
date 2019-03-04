#!/bin/bash

cat /etc/nginx/sites-available/$1 | xclip -selection clip
