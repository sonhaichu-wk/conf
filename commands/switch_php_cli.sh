#!/bin/bash

# Use: sudo update-alternative --config php for manual switch

version='7.2'

if [ -n "$1" ]; then
	version=$1
fi

sudo update-alternatives --set php /usr/bin/php$version
sudo update-alternatives --set phar /usr/bin/phar$version
sudo update-alternatives --set phar.phar /usr/bin/phar.phar$version
sudo update-alternatives --set phpize /usr/bin/phpize$version
sudo update-alternatives --set php-config /usr/bin/php-config$version