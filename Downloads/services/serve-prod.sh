#!/usr/bin/env bash

nodemon -e "js html" \
    --watch /var/www/dl/app/ \
    --exitcrash \
    /var/www/dl/app/server/server.js