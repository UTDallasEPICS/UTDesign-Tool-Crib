#!/bin/bash
cd /home/user/project/location
git pull
pnpm i
pnpm build
systemctl stop toolcrib
systemctl start toolcrib