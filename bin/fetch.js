#!/usr/bin/env node
/* 
 * Fetch json from github and write to stdout.  Follow http link headers.
 */

var https = require('https'),
    url = require('url'),
    args = process.argv.slice(2),
    url_arg = '',
    options = {},
    maxloop = 25,
    count = 0,
    pages = {};


if (args.length == 0) {
  console.error('Usage: fetch.js <url>');
  process.exit();
}

url_arg = url.parse(args[0]);
options.path = url_arg.search ? url_arg.pathname + url_arg.search :  url_arg.pathname;
options.host = url_arg.host;
 
var fetch = function(options) {
    console.error(['options: ', options]);
    var current = url.parse(options.path);
    count += 1;
    var req = https.get(options, function(res) {
      console.error("Got response: " + res.statusCode);
      console.error(["Got response headers: ", res.headers]);
      if (res.headers.link !== undefined) {
          var links = res.headers.link.split(',');
          var url1 = url.parse(links[0].split(';')[0].replace(/[<>\s]/g,''));
          var url2 = url.parse(links[1].split(';')[0].replace(/[<>\s]/g,''));
          if (maxloop == count) {
            console.error("Reached max recursion. Exiting."); 
            process.exit(); 
          }
          // recursively fetch other pages
          if (!pages[url1]) {
            pages[url1] = true; // save url
            options.host = url1.host;
            options.path = url1.pathname + url1.search;
            console.error(['url1 is new', url1]);
            fetch(options);
          }
          if (!pages[url2]) {
            pages[url2] = true;
            options.host = url2.host;
            options.path = url2.pathname + url2.search;
            console.error(['url2 is new', url2]);
            fetch(options);
          }
      }
      res.on('data', function(d) {
        process.stdout.write(d);
      });
    });
    req.on('error', function(e) {
      console.error(e);
    });
};

fetch(options);
