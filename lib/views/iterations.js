
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

exports.iterations = iterations;

/* 
* Take a date object or string and return the iteration number else return
* null.  
*/
exports.get_iteration = function(d) {
    if (typeof d === 'string') {
        d = new Date(d);
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
