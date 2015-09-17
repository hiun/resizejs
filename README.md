#resizejs
Browser-side resizing made simple.

##Demo
- [Demo](https://hiun.github.io/resizejs)

##Features and Notes
- Resizing binary image on the web browser, powered by HTML5 `FileReader`, `Canvas`, `Uint8Array`, `atob`, `Blob`.

- Resizing image methodology was referenced by [Mozilla Hacks](https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/). resizejs is more likely a web friendly wrapper on top of this fundamental technologies.

##Config Options
To configure resizejs, pass single object with following key and value pairs.

key | necessity | type | arguments | notes
----|-----------|------|-----------|------------
`img` | required | File Object || An image to resize
`maxWidth` | required | Number || An pixel value for width of an resized image
`maxHeight` | required | Number || An pixel value for height of resized image
`exts` | optional | Array || Optionally set additional allowed subtypes of guven image. Default contains `jpg`, `jpeg`, `png`, `gif`.
`previewCb` | optional | Function | dataURL | Invoke just after convert image. Argument is dataURL of original image.
`afterCb` | optional | Function | dataURL | Invoke just after resizing image. Argument is dataURL of resized image
`invalidImgCb` | optional | Function | | Invoke when subtype of given image is invalid.
`success` | required | Function | Blob Object | A callback function invoked when resizing is successfully done. Argument is Blob Object that represent a resized image.

notes: In case when value of `maxWidth` and `maxHeigh`t are same, the image will resize as expected (if actual image has difference in aspect ratio, will be ignored). 

Aother case such as `maxWidth` is higher than `maxHeight`, but actual width is smaller than it's height will ignore aspect ratio. Oppositely, `maxHeight` is higher but width of actual image is smaller which also cause ignorance of aspect ratio.


##Config Example
```javascript
var blob = resizejs({
    img: document.querySelector('#img').files[0],
    maxWidth: 850,
    maxHeight: 850,
    exts: ['tiff', 'p2'],
    previewCb: function (dataURL) {
      document.querySelector('#preview').src = dataURL;
    },
    afterCb: function (dataURL) {
      document.querySelector('#after').src = dataURL;
    },
    invalidImgCb: alert,
    success: function (blob) {
      alert('succeed!');
    }
});
```

##License
MIT
