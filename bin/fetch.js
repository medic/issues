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
    pages = {},
    username = 'mandric',
    password = 'secret';

if (args.length == 0) {
  console.error('Usage: fetch.js <url>');
  process.exit();
}

url_arg = url.parse(args[0]);
options.path = url_arg.search ? url_arg.pathname + url_arg.search : url_arg.pathname;
options.host = url_arg.host;
options.headers = {
    Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
    Host: options.host,
    Path: options.path
}

 
var fetch = function(options) {
    //console.error(['options: ', options]);
    var current = url.parse(options.path);
    count += 1;
    var req = https.get(options, function(res) {
      //console.error("Got response: " + res.statusCode);
      //console.error(["Got headers: ", res.headers]);
      if (res.statusCode !== 200) {
          console.error('Request failed '+ res.headers.status);
          console.error('Try modifying fetch.js script to authenticate properly.');
          process.exit(1);
      }
      res.on('data', function(d) {
        process.stdout.write(d);
      });
      if (res.headers.link !== undefined) {
          var links = res.headers.link.split(',');
          //console.error(["links: ", links]);
          try {
              var url1 = url.parse(links[1].split(';')[0].replace(/[<>\s]/g,''));
              var url2 = url.parse(links[2].split(';')[0].replace(/[<>\s]/g,''));
          } catch(e) {
              return;
          }
          if (maxloop <= count) {
            console.error("Reached max recursion. Exiting."); 
            process.exit(); 
          }
          if (!pages[url1]) {
            pages[url1] = true; // save url
            options.headers['Host'] = url1.host;
            options.headers['Path'] = url1.pathname + url1.search;
            options.path = url1.pathname + url1.search;
            options.host = url1.host;
            //console.error(['url1 is new', url1]);
            fetch(options);
          }
          if (!pages[url2]) {
            pages[url2] = true;
            options.headers['Host'] = url2.host;
            options.headers['Path'] = url2.pathname + url2.search;
            options.path = url2.pathname + url2.search;
            options.host = url2.host;
            //console.error(['url2 is new', url2]);
            fetch(options);
          }
      }
    });
    req.on('error', function(e) {
      console.error(e);
    });
};

fetch(options);
