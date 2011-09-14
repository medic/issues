
/*
 * Simple array of weekly iterations beginning on Sunday night CDT.
 */
var iterations = exports.iterations = (function() {
    var istart = new Date('2011-05-30T00:00:00Z');
    var iend = new Date();
    var ret = [];
    var index = 1;
    while (istart < iend) {
        var e = new Date(istart.getTime() + (60 * 60 * 24 * 7 * 1000));
        ret.push({
            start: istart,
            end: e,
            index: index
            //query: parse_date()
        });
        istart = e;
        index++;
    }
    return ret;
})();

/* 
 * Given a date return the iteration that it falls within.
 */
var getIteration = exports.getIteration = function(d) {
    for (k in iterations) {
        var i = iterations[k];
        if (i.start <= d && d <= i.end) {
            //console.log(['returning i', i]);
            return i;
        }
    };
};
