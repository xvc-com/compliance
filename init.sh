#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

BASE=$(git remote get-url origin | sed 's/\.git$//')

clone() {
  if [ ! -d "$1" ]; then
    git clone -b dev --depth=1 ${BASE}_$1.git $1
  fi
}

clone conf
clone prompt
bun i
