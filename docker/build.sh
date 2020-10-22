#!/bin/bash

if [ "$1" == "" ]; then
  echo "Syntax: ./build.sh [docker tag]"
  exit 1
fi

docker build -t $1 \
  --build-arg GIT_COMMIT="$(git rev-parse HEAD)" \
  --build-arg SSH_PRIVATE_KEY="$(cat ~/.ssh/id_rsa)" \
  --build-arg GIT_URL="github.com" \
  --build-arg GIT_PORT="22" \
  --build-arg GIT_REPO="git@github.com:DirkBaumeister/twissi-home.git" .