
/* transform map function to add _id field to issues docs */

module.exports = function(doc) {
    doc._id = doc.number + '';
    return doc;
}
