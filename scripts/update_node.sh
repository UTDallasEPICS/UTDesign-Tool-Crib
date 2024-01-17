#!/bin/bash
# Check for node version manager
if ! [ -d "${HOME}/.nvm/.git" ] &> /dev/null
then
  echo "nvm not found"
  echo "Install node version manager from https://github.com/nvm-sh/nvm"
  exit 1
fi
source ~/.nvm/nvm.sh
nvm install --lts=iron --latest-npm # Install LTS version 20.x.x of node
nvm alias default lts/iron # set default to be LTS version
if ! command -v pnpm &> /dev/null # check if pnpm is installed
then
  # install pnpm
  npm install -g pnpm
else
# update pnpm
  pnpm add -g pnpm
fi
