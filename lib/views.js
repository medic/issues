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
        var d = doc.body.match(/^\s*difficulty\s*:\s*(\d+)/im);
        // default difficulty value is none is specified
        var difficulty = 1;
        if (d && d[1]) { 
            difficulty = parseInt(d[1], 10);
            log(['difficulty is', difficulty]);
            log(['doc.number', doc.number]);
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
