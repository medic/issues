/**
 * Show functions to be exported from the design doc.
 */

var iterations = require('./iterations');

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
        var regex = /^\W*difficulty\W*(\d+)/im;
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



exports.stats_by_iteration = {
    map: function (doc) {
        if (doc.state === 'open') {
            emit([doc.iteration, 'opened'], doc.difficulty);
        } else if (doc.state === 'closed') {
            emit([doc.iteration, 'closed'], doc.difficulty);
        }
    },
    reduce: function(keys, values) {
        return sum(values);
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
