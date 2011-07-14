/* 
 * Pass this to kanso transform map command to adjust issues json docs.  
 *
 * Make doc _id the issue number and cast to string. _id must be a string.  
 *
 * */

module.exports = function(doc) {
    doc._id = doc.number + '';
    return doc;
}
