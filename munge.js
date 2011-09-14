/* 
 * Pass this to kanso transform map command to adjust issues json docs.  
 *
 * Create an _id field for the doc, note _id must be a string.  
 *
 * */

var url = require('url'),
    iterations = require('./lib/iterations');

/*
 * Return integer representing an issues's difficulty value.  Supports a regex
 * in the body or a label.  
 */ 
var getDifficulty = function(doc) {
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
    return difficulty;
};

/* 
 * Create a unique _id key e.g. kanso-174.  Assumes Github always provides a
 * url field for an issue.  Throws errors otherwise.  Also adds iteration and
 * difficulty fields.  The try/catch is because in some cases there is no
 * iteration for a specific date range, for projects that we only started
 * contributing too at a later time.  
 */
module.exports = function(doc) {
    var repo = url.parse(doc.url).pathname.split('/')[3];
    doc._id = repo + '-' + doc.number;
    doc.difficulty = getDifficulty(doc);
    doc.iteration = null;
    if (doc.state === 'open') {
        try {
            doc.iteration = iterations.getIteration(new Date(doc.created_at)).index;
        } catch(e) {
        }
    } else if (doc.state === 'closed') {
        try {
            doc.iteration = iterations.getIteration(new Date(doc.closed_at)).index;
        } catch(e) {
        }
    }
    return doc;
};
