require('http').globalAgent.maxSockets = Infinity
request = require 'request'
async = require 'async'
moment = require 'moment'
path = require 'path'
fs = require 'fs'

queueConcurrency = 10
totalRequestedDownloads = 0
totalFinishedDownloads = 0
momentFormat = 'YYYY/MM/DD HH:mm:ss.SS'

queue = async.queue (task, callback) ->
	stream = fs.createWriteStream(task.filepath)
	stream.on 'close', ->
		totalFinishedDownloads += 1
		console.log "downloaded '#{path.basename(task.url)}' to '#{path.dirname(task.filepath)}' on #{moment().format(momentFormat)}"
		callback()
	stream.on 'error', (err) ->
		callback(err)
	request(task.url).pipe(stream)
, queueConcurrency

queue.drain = ->
	console.log "(#{totalFinishedDownloads}/#{totalRequestedDownloads}) files downloaded successfully"
	totalRequestedDownloads = 0
	totalFinishedDownloads = 0

get = (url, filepath) ->
	task = {url: url, filepath: filepath}
	totalRequestedDownloads += 1
	queue.push task, (err) ->
		throw err if err

exports.get = get