/**
 * List functions to be exported from the design doc.
 */

var templates = require('kanso/templates'),
    charts = require('./charts'),
    iterations = require('./iterations'),
    events = require('kanso/events'),
    db = require('db');

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

    events.once('afterResponse', function () {
        db.getView('stats_by_iteration', {group:true}, function (err, data) {
            if (err) {
                return alert(err);
            }
            //console.log(['data',data]);
            $('#content').html(content);

            var iterations = {}; 
            var x_axis = [];
            var y_opened = [];
            var y_closed = [];
            for (var i in data.rows) {
                var row = data.rows[i];
                if (!iterations[row.key[0]]) {
                    iterations[row.key[0]] = {};
                }
                iterations[row.key[0]][row.key[1]] = row.value;
            }
            delete iterations[null];
            for (var i in iterations) { 
                x_axis.push(i);
                if(iterations[i]['opened']) {
                    y_opened.push(iterations[i]['opened']);
                } else {
                    y_opened.push(0);
                }
                if(iterations[i]['closed']) {
                    y_closed.push(iterations[i]['closed']);
                } else {
                    y_closed.push(0);
                }
            }
            /*
            Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
                color = color || "#000";
                var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
                    rowHeight = h / hv,
                    columnWidth = w / wv;
                for (var i = 1; i < hv; i++) {
                    path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
                }
                for (i = 1; i < wv; i++) {
                    path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
                }
                return this.path(path.join(",")).attr({stroke: color});
            };
            */
            $('#notepad').css({ 'margin-left': '-20px', width: '350px', height: '130px'});
            var r = Raphael('notepad');
            var width = 340,
                height = 120,
                labels = x_axis
                leftgutter = 10,
                X = (width - leftgutter) / labels.length,
                txt = {font: '12px Helvetica, Arial', fill: "#000"};
            var linechart = r.g.linechart(
                10, 0, width, height,
                x_axis,
                [y_opened, y_closed], 
                //{axis: '0 0 1 1'});
                {axis:"0 0 0 1"});//, colors:["green", "blue"]});
            //r.text(width/2, height + 10, "Iterations").attr(txt);
            for (var i in iterations) {
                i = parseInt(i, 10);
                var x = Math.round(X * (i + .5)),
                    t = null;
                //console.log(['x', i]);
                //console.log(['x % 2', i % 2]);
                if (i % 4 !== 0 && i !== 1) {
                    continue;
                }
                t = r.text(x, height, i).attr(txt).toBack();
            }
            var l1, l2 = null;
            linechart.hover(function() {
                //console.log(this);
                //this.symbol.attr({'fill':'#CCC'});
                this.attr({opacity: .35, r:8});
                l1 = r.text(50, 10, this.value + ' points');
                l2 = r.text(50, 20, 'Iteration '+ this.axis);
                //console.log(this);
            }, function() {
                this.attr({opacity: 0});
                l1.hide();
                l2.hide();
                //this.symbol.attr({'fill':'#444'});
            });

//r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#333");

//Raphael.fn.g.linechart = function (x, y, width, height, valuesx, valuesy, opts) {

        });
    });

    return {title: 'Issues', content: content};

    //if (req.client) {
        // being run client-side, update the current page
        //$('#content').html(content);
        //var label = 'test';
        //$('#article3').append('<h3>Iteration '+label+'</h3>');
        //charts.line(
        //    [0, iterations.length],
        //    [[12, 22, 34, 22, 0, 10], [23, 44, 0, 30, 35, 38]], {axis: '0 0 1 1'});
        //var axis = r.g.axis(15,240,310,null,null,null,2,x_axis,"|", 0);
        //axis.text.attr({font:"12px Arial", "font-weight": "regular", "fill": "#333333"});
        // show y-axis by setting orientation to 1 
        //axis2 = r.g.axis(40,230,300,0,400,10,1);

        //var linechart = r.g.linechart(10,10,300,220,[1,2,3,4,5],[10,20,15,35,30], {"colors":["#444"], "symbol":"s", axis:"0 0 1 1"});
        //charts.pie([23, 44]);
    //} else {
       // return {title: 'Issues', content: content};
    //}
};
