/**
 * Show functions to be exported from the design doc.
 */


exports.issues_closed = {
    map: function (doc) {
        if (doc.number && doc.state === 'closed') {
            emit(doc.closed_at, doc);
        }
    }
};

exports.issues_all = {
    map: function (doc) {
        if (doc.number) {
            emit(doc.created_at, doc);
        }
    }
};

exports.activity = {
    map: function (doc) {

        var difficulty = 1; // default difficulty value 
        var label_count = doc.labels.length;
        var regex = /^\W*difficulty\W*(\d+)/i;
        var match = doc.body.match(regex);

        // override difficulty value if in labels
        for (var i = 0; i < label_count; i++) {
            var name = doc.labels[i].name;
            var m = name.match(regex);
            if (m) {
                match = m;
            }
        }
        if (match && match[1]) {
            difficulty = parseInt(match[1], 10);
        }
        log (['difficulty is ', difficulty]);
        if (doc.state === 'open') {
            emit(doc.created_at, {
                action: 'opened', 
                difficulty: difficulty,
                doc: doc
            });
        }
        if (doc.state === 'closed') {
            emit(doc.closed_at, {
                action: 'closed', 
                difficulty: difficulty,
                doc: doc
            });
        }
    }
};

exports.difficulty_by_iteration = {
    map: function (doc) {
        var iterations = {
            1: {'startdate': new Date(2011,6,3,0,0,0), 
                'enddate': new Date(2011,6,10,0,0,0)},
            2: {'startdate': new Date(2011,6,10,0,0,0), 
                'enddate': new Date(2011,6,17,0,0,0)},
            3: {'startdate': new Date(2011,6,17,0,0,0), 
                'enddate': new Date(2011,6,24,0,0,0)},
            4: {'startdate': new Date(2011,6,24,0,0,0), 
                'enddate': new Date(2011,7,1,0,0,0)},
            5: {'startdate': new Date(2011,7,1,0,0,0), 
                'enddate': new Date(2011,7,8,0,0,0)},
            6: {'startdate': new Date(2011,7,8,0,0,0), 
                'enddate': new Date(2011,7,15,0,0,0)},
            7: {'startdate': new Date(2011,7,15,0,0,0), 
                'enddate': new Date(2011,7,22,0,0,0)}
        };

        /* 
        * Take a date object or string and return the iteration number else return
        * null.  
        */
        var get_iteration = function(d) {
            if (typeof d === 'string') {
                //log(['look at', d]);
                var x = new Date.parse('2011');
                //log(["Date.parse('2011')", Date.parse('2011')]);
                //log(["Date.parse('2011/10/22')", Date.parse('2011/10/22')]);
                //log(["Date.parse('2011/10/22:10:33:43')", Date.parse('2011/1/12:10:33:43')]);
                //log(['date', x]);
            }
            for (var i in iterations) {
                if (d >= i.startdate && d <= i.enddate) {
                    return i;
                }
            };
            return null;
        };

        /*
        var milestones = {
            1: [iterations.1, iterations.2, iterations.3],
            2: [iterations.4, iterations.5, iterations.6]
        };
        */

        var difficulty = 1; // default value if none is specified
        var iteration = get_iteration(doc.created_at);
        var d = doc.body.match(/^\s*difficulty\s*:\s*(\d+)/im);

        if (d && d[1]) {
            difficulty = parseInt(d[1], 10);
        }
        if (doc.state === 'open') {
            emit(iteration, difficulty);
        }
    }
};

exports.activity_closed = {
    map: function (doc) {
        var d = doc.body.match(/^\s*difficulty\s*:\s*(\d+)/im);
        // use a difficulty value of 1 if none is specified
        var difficulty = 1;
        if (d && d[1]) {
            difficulty = parseInt(d[1], 10);
        }
        if (doc.state === 'closed') {
            emit(doc.created_at, difficulty);
        }
    }
};

// shooting for
// "data": [[iteration num, opened points], ...]
// "data": [[1, 10], [2000, 3.9], [2001, 2.0], [2002, 1.2], [2003, 1.3], [2004, 2.5], [2005, 2.0], [2006, 3.1], [2007, 2.9], [2008, 0.9]]

/*
exports.opened_sum = {
    map: exports.activity_opened.map,
    reduce: function(keys, values) {
      var d = new Date(keys[0]);
      if ( d >= iterations[1].startdate && d <= iterations[1].enddate) {
          return sum(values);
      }
    }
};

exports.closed_sum = {
    map: exports.activity_closed.map,
    reduce: function(keys, values) {
      return sum(values);
    }
};

*/
