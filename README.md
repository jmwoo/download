# download

download many http resources asynchronously

## usage

```javascript
var task = {
	"url": "http://www.mindfulvalley.org/files/books/mindfulness_plain_english.pdf",
	"filepath": path.join(process.cwd(), 'good_book.pdf')
};

get(task);
```