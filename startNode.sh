#!/bin/bash
#pm2 start /var/node/server/listern.js
sudo shutdown +180 &
sudo fbi -T 1 -noverbose -autoup img01.jpg
pm2 start /var/node/server/listener.js