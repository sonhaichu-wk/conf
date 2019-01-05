#!/bin/bash

# Read all submodules in current git
MODULES=`git ls-files --stage | grep 160000`

# Iterate through every submodule path
while read -r MOD; do
  # extract submodule path (split line at whitespace and take string with index 3)
  ARRIN=(${MOD})
  MODPATH=${ARRIN[3]}

  # grep module url from .git file in submodule path
  MODURL=`grep "url = " $MODPATH/.git/config`
  MODURL=${MODURL##*=}

  # echo path and url for information
  echo $MODPATH
  echo $MODURL

  # remove existing entry in submodule index
  git rm --cached $MODPATH
  # add new entry in submodule index
  git submodule add $MODURL $MODPATH
done <<< "$MODULES"
