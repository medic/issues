#!/bin/sh

#
# Runs the github fetch sequence. Saves json data into the data directory and
# does a transform with kanso.
#

DATE=`date +%Y%m%d` 
DBURL=$1
DATADIR=data/
# strip slashes and junk from data dir ending (possibly useful in future if we
# accept data dir as an arg)
DATADIR=`echo "$DATADIR" | sed 's/[^a-zA-Z0-9]*$//g'`

if [ -z $DBURL ]; then
    echo "Usage: $0 <db url>"
    echo "  <db url> is the CouchDB URL."
    echo "  e.g. update.sh http://localhost:5984/issues"
    exit 1
fi

if [ ! -d "$DATADIR" ]; then
    mkdir "$DATADIR"
fi

if [ ! -f kanso.json ]; then
    echo "Exiting: this script must be run in the same directory as kanso.json."
    exit 1
fi

bin/fetch.js 'https://api.github.com/repos/caolan/kanso/issues' > $DATADIR/all-$DATE.json &&
bin/fetch.js 'https://api.github.com/repos/caolan/kanso/issues?state=closed' >> $DATADIR/all-$DATE.json &&
bin/fetch.js 'https://api.github.com/repos/medic/medicdashboard/issues' >> $DATADIR/all-$DATE.json &&
bin/fetch.js 'https://api.github.com/repos/medic/medicdashboard/issues?state=closed' >> $DATADIR/all-$DATE.json &&
# hack to remove extra arrays from json
sed -i.bak 's/\]\[/,/g' $DATADIR/all-$DATE.json &&
kanso transform map -m 'munge.js' $DATADIR/all-$DATE.json $DATADIR/all-$DATE-munged.json &&
kanso pushdata -f $DBURL $DATADIR/all-$DATE-munged.json
