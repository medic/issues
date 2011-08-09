/**
 * Rewrite settings to be exported from the design doc
 */

module.exports = [
    {from: '/static/*', to: 'static/*'},
    {from: '/', to: '_list/issues_list/activity', query: {
        descending: 'true'
    }},,
    {from: '*', to: '_show/not_found'}
];
