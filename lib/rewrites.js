/**
 * Rewrite settings to be exported from the design doc
 */

module.exports = [
    {from: '/static/*', to: 'static/*'},
    {from: '/', to: '_list/issues_list/activity', query: {
        descending: 'true', include_docs: 'true'
    }},,
    {from: '*', to: '_show/not_found'}
];
