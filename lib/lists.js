/**
 * List functions to be exported from the design doc.
 */

var templates = require('kanso/templates'),
    charts = require('./charts'),
    iterations = require('./iterations');

function is_pull_request(doc) {
    for (var field in doc.pull_request) {
        if (doc.pull_request[field] !== null) { return true; }
    }
    return false;
}

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
    var istart = new Date('2011-05-30T00:00:00Z');
    var iend = new Date();
    function datestr(date) {
        var ret = date.getUTCFullYear()+'-';
        var m = date.getUTCMonth()+1 + '';
        ret += m.length == 1 ? '0'+m+'-' : m+'-'; 
        var d = date.getUTCDate() + '';
        ret += d.length == 1 ? '0'+d : d; 
        ret += 'T00:00:00Z';
        return ret;
    }
    function parse_date() {
        var url = 'endkey="'+datestr(istart)+'"&amp;';
        url += 'startkey="'+datestr(e)+'"';
        //return url;
        return encodeURI(url);
    }

    while (row = getRow()) {

        if (row.value.doc.created_at) {
            row.value.doc.created_at = new Date(row.value.doc.created_at);
        }

        if (row.value.doc.closed_at) {
            row.value.doc.closed_at  = new Date(row.value.doc.closed_at);
        }

        row.value.doc.is_pull_request = is_pull_request(row.value.doc);

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
        var label = 'test';
        $('#article3').append('<h3>Iteration '+label+'</h3>');
        //charts.line(
        //    [0, iterations.length],
        //    [[12, 22, 34, 22, 0, 10], [23, 44, 0, 30, 35, 38]], {axis: '0 0 1 1'});
        var r = Raphael('notepad');
        var x_axis = [];
        for (var k in iterations.iterations) {
            x_axis[k] = parseInt(k,10)+1;
        }
        var linechart = r.g.linechart(
            10, 0, 370, 200,
            x_axis,
            [[12, 22, 34, 22, 0, 10], [23, 44, 0, 30, 35, 38]], {axis: '0 0 1 1'});
        //var axis = r.g.axis(15,240,310,null,null,null,2,x_axis,"|", 0);
        //axis.text.attr({font:"12px Arial", "font-weight": "regular", "fill": "#333333"});
        // show y-axis by setting orientation to 1 
        //axis2 = r.g.axis(40,230,300,0,400,10,1);

        //var linechart = r.g.linechart(10,10,300,220,[1,2,3,4,5],[10,20,15,35,30], {"colors":["#444"], "symbol":"s", axis:"0 0 1 1"});
        //charts.pie([23, 44]);
    } else {
        return {title: 'Issues', content: content};
    }
};
