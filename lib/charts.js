/**
 * Bindings to Kanso events
 **/

var events = require('kanso/events');

exports.circle = function() {
    // Creates canvas 320 × 200 at 10, 50
    //var paper = Raphael(10, 50, 320, 200);
    var paper = Raphael("notepad", 320, 200);
    
    // Creates circle at x = 50, y = 40, with radius 10
    var circle = paper.circle(50, 40, 10);

    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#f00");
    
    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#fff");
};

exports.bars = function(data, selector) {
    var r = Raphael('notepad'),
        data1 = [[55, 20, 13, 32, 5, 1, 2, 10], 
                 [10, 2, 1, 5, 32, 13, 20, 55], 
                 [12, 20, 30]];
    r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
    r.g.barchart(0, 0, 340, 200, data1);

/*
    var r = Raphael("holder"),
        data1 = [[55, 20, 13, 32, 5, 1, 2, 10], [10, 2, 1, 5, 32, 13, 20, 55], [12, 20, 30]],
        data2 = [[55, 20, 13, 32, 5, 1, 2, 10], [10, 2, 1, 5, 32, 13, 20, 55], [12, 20, 30]],
        data3 = [[55, 20, 13, 32, 5, 1, 2, 10], [10, 2, 1, 5, 32, 13, 20, 55], [12, 20, 30]];
    r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
    
    r.g.text(160, 10, "Single Series Chart");
    r.g.text(480, 10, "Multiline Series Chart");
    r.g.text(160, 250, "Multiple Series Stacked Chart");
    r.g.text(480, 250, "Multiline Series Stacked Vertical Chart. Type “round”");
    
    r.g.barchart(10, 10, 300, 220, [[55, 20, 13, 32, 5, 1, 2, 10]], 0, {type: "sharp"});
    r.g.barchart(330, 10, 300, 220, data1);
    r.g.barchart(10, 250, 300, 220, data2, {stacked: true});
    r.g.barchart(330, 250, 300, 220, data3, {stacked: true, type: "round"});
*/
};
                
exports.line = function (x, y, opts) {
    // x is [10, 20, 30, 44, 30]
    // y is [[44, 30, 10, 212, 44], [123, 678, 3, 4, 5]]
    opts = opts || {};
    var selector = opts.selector || "#notepad";
    var title = opts.title || 'Example';
    var r = Raphael($(selector).get(0));
    r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
    r.g.text(165, 20, title).attr({"font-size": 15});
    //var line = r.g.linechart(170, 120, 75, x, y, opts);
    //var linechart = r.g.linechart(10,10,300,220,[1,2,3,4,5],[10,20,15,35,30], {"colors":["#444"], "symbol":"s", axis:"0 0 1 1"});
    var linechart = r.g.linechart(10,10,300,220,x,y,opts);
}

exports.pie = function (data, opts) {
    // data is [44, 30]
    opts = opts || {};
    var selector = opts.selector || "#notepad";
    var title = opts.title || 'Example';
    var r = Raphael($(selector).get(0));
    r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
    r.g.text(165, 20, title).attr({"font-size": 15});
    //var pie = r.g.piechart(170, 100, 100, [55, 20], {legend: ["%% Completed", "%% Incomplete"], legendpos: "south", href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});
    var pie = r.g.piechart(170, 120, 75, data, opts);

    pie.hover(function () {
        this.sector.stop();
        this.sector.scale(1.1, 1.1, this.cx, this.cy);
        if (this.label) {
            this.label[0].stop();
            this.label[0].scale(1.5);
            this.label[1].attr({"font-weight": 800});
        }
    }, function () {
        this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
        if (this.label) {
            this.label[0].animate({scale: 1}, 500, "bounce");
            this.label[1].attr({"font-weight": 400});
        }
    });
};

events.once('init', function () {
    console.log('init raphael');
});

