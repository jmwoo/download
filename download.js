require('http').globalAgent.maxSockets = Infinity;
var request = require('request');
var async = require('async');
var moment = require('moment');
var path = require('path');
var fs = require('fs');

var totalRequestedDownloads = 0;
var totalFinishedDownloads = 0;
var config = {
  "queueConcurrency": 10,
  "mfmt": "YYYY-MM-DD HH:mm:ss.SSS"
};

var queue = async.queue(function (task, cb) {
  var stream = fs.createWriteStream(task.filepath);
  stream.on('close', function () {
    totalFinishedDownloads += 1;
    console.log("downloaded %s to %s on %s", path.basename(task.url), path.dirname(task.filepath), moment().format(config.mfmt));
    cb();
  });
  stream.on('error', function (err) {
    cb(err);
  });
  request(task.url).pipe(stream);
}, config.queueConcurrency);

queue.drain = function () {
  console.log("(%d/%d) files downloaded successfully", totalFinishedDownloads, totalRequestedDownloads);
  totalRequestedDownloads = 0;
  totalFinishedDownloads = 0;
};

// task = {url: 'http://www.example.com/coolsong.mp3', filepath: './song.mp3'};
var download = function (task) {
  totalRequestedDownloads += 1;
  queue.push(task, function (err) {
    if (err) {
      throw err;
    }
  });
};

exports.download = download;