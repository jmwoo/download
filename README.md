# download

This is a tool for downloading http resources. It is most useful when you need to get many files concurrently. Files are downloaded asynchronously and are queued when necessary so as not to break node's limit on max file descriptors.

## usage

```javascript
var path = require('path');
var download = require('./download').download;

var url = "http://www.mindfulvalley.org/files/books/mindfulness_plain_english.pdf";
var filepath = path.join(process.cwd(), 'good_book.pdf');

download(url, filepath);
```