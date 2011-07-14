/* 
 * Pass this to kanso transform map command to adjust issues json docs.  
 *
 * Create an _id field for the doc, note _id must be a string.  
 *
 * */

var url = require('url');

/* 
 * Create a unique _id key e.g. kanso-174.  Assumes Github always provides a
 * url field for an issue.  Throws errors otherwise. 
 *
 * */
module.exports = function(doc) {
    var repo = url.parse(doc.url).pathname.split('/')[3];
    doc._id = repo + '-' + doc.number;
    return doc;
}
