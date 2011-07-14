/**
 * List functions to be exported from the design doc.
 */

var templates = require('kanso/templates');

exports.issues_list = function (head, req) {

    start({code: 200, headers: {'Content-Type': 'text/html'}});

    // fetch all the rows
    var row, closed = [], opened = [];
    var stats = {
        opened_count : 0,
        closed_count : 0,
        opened_points : 0, 
        closed_points : 0,
        startkey : new Date(req.query.startkey),
        endkey : new Date(req.query.endkey)
    };


    while (row = getRow()) {
        if (row.value.doc.created_at) {
            row.value.doc.created_at = new Date(row.value.doc.created_at);
        }
        if (row.value.action == 'closed') {
            closed.push(row);
            stats['closed_points'] += row.value.difficulty;
            stats['closed_count']++;
        } else if (row.value.action == 'opened') {
            opened.push(row);
            stats['opened_points'] += row.value.difficulty;
            stats['opened_count']++;
        }
    }

    // generate the markup for a list of blog posts
    var content = templates.render('issues_list.html', req, {
        stats : stats,
        opened: opened,
        closed: closed,
        req: req
    });

    if (req.client) {
        // being run client-side, update the current page
        $('#content').html(content);
    } else {
        return {title: 'Issues', content: content};
    }
};
