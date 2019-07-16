#!/bin/bash

sudo touch /var/log/nginx/$1-error.log
sudo cp /etc/nginx/sites-available/example.local.com /etc/nginx/sites-available/$1 &&\
sudo ln -s /etc/nginx/sites-available/$1 /etc/nginx/sites-enabled/ &&\
sudo cp /etc/apache2/sites-available/example-local.conf /etc/apache2/sites-available/$1.conf &&\
sudo ln -s /etc/apache2/sites-available/$1.conf /etc/apache2/sites-enabled/
