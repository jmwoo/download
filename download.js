require('http').globalAgent.maxSockets = Infinity;
var request = require('request');
var async = require('async');
var moment = require('moment');
var path = require('path');
var fs = require('fs');

var totalRequestedDownloads = 0;
var totalFinishedDownloads = 0;
var config = JSON.parse(fs.readFileSync('config.json'));

var queue = async.queue(function (task, cb) {
  var stream = fs.createWriteStream(task.filepath);
  stream.on('close', function () {
    totalFinishedDownloads += 1;
    var name = path.basename(task.url);
    var dest = path.dirname(task.filepath);
    var now = moment().format(config.mfmt);
    var msg = 'downloaded ' + name + ' to ' + dest + ' on ' + now;
    console.log(msg);
    cb();
  });
  stream.on('error', function (err) {
    cb(err);
  });
  request(task.url).pipe(stream);
}, config.queueConcurrency);

queue.drain = function () {
  var tfd = totalFinishedDownloads.toString();
  var trd = totalRequestedDownloads.toString();
  var msg = '(' + tfd + '/' + trd + ') files downloaded successfully';
  console.log(msg);
  totalRequestedDownloads = 0;
  totalFinishedDownloads = 0;
};

var get = function (url, filepath) {
  totalRequestedDownloads += 1;
  queue.push({"url": url, "filepath": filepath}, function (err) {
    if (err) {
      throw err;
    }
  });
};

exports.get = get;