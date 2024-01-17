#!/bin/bash
git pull
pnpm i
pnpm build
systemd stop toolcrib
systemd start toolcrib