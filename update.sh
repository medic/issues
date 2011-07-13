#!/bin/sh

DATE=`date +%Y%m%d` 
DBURL=$1

if [ -z $DBURL ]; then
    echo "Usage: $0 <db url>"
    echo "  <db url> is the CouchDB URL."
    echo "  e.g. update.sh http://localhost:5984/issues"
    exit 1
fi

cd ~/dev/issues &&
./fetch.js 'https://api.github.com/repos/caolan/kanso/issues' > data/all-$DATE.json &&
./fetch.js 'https://api.github.com/repos/caolan/kanso/issues?state=closed' >> data/all-$DATE.json &&
sed -i.bak 's/\]\[/,/g' data/all-$DATE.json &&
cd ~/dev/kanso-issues &&
bin/kanso transform set-ids -s 'number' ../issues/data/all-$DATE.json ../issues/data/all-$DATE-transformed.json &&
bin/kanso pushdata -f $DBURL ../issues/data/all-$DATE-transformed.json
