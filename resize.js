/*!
 * Copyright(c) resizejs 2015 Hiun Kim
 * https://github.com/hiun/resizejs
 * September 2015
 * MIT Licensed
 */

function resizejs (cfg) {

	/* helper functions */

	function isDom (dom) {
		if (!dom.nodeName) {
			throw 'Invalid DOM Object in the arguments';
		}
	}	

	/* core logic */

	function resizeImg (img, cb) {

		// https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/

		//create intermediate img node
		var imgNode = document.createElement('img');

		//initialize HTML5 FileReader
		var reader = new FileReader();

		//read 'File' typed img as a dataUrl
		reader.readAsDataURL(img);

		//write preview when done
		reader.onload = function (e) {

			var dataURL = e.target.result;

			//invoke preview callback
			previewCb(dataURL);

			//change src attribute of image
			imgNode.src = dataURL;

			imgNode.onload = function () {

				var mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0];

				var ext = mimeType.slice(6);

				if (ext === 'jpeg' || ext === 'png' || ext === 'gif' || exts.indexOf(ext) !== -1) {

					//get natural WH of img
					var width = imgNode.naturalWidth;
					var height = imgNode.naturalHeight;

					//calculate optimal WH of img by user defined WH
					if (width > height) {
						if (width > MAX_WIDTH) {
							height *= MAX_WIDTH / width;
							width = MAX_WIDTH;
						}
					} else if (height < width) {
						if (height > MAX_HEIGHT) {
							width *= MAX_HEIGHT / height;
							height = MAX_HEIGHT;
						}
					} else {	
						width = MAX_WIDTH;
						height = MAX_HEIGHT;
					}

					//resize, initialize canvas
					var canvas = document.createElement('canvas');

					//setting up					
					canvas.width = width;
					canvas.height = height;
					

					var newCtx = canvas.getContext("2d");

					newCtx.drawImage(imgNode, 0, 0, width, height);


					var resizedDataURL = canvas.toDataURL();

					afterCb(resizedDataURL)

					cb(resizedDataURL);
				
				} else {
					invalidImgCb();
				}

			}
		};
	}

	function dataURLToBlob (dataURL) {

		// http://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload

		if (typeof dataURL !== 'string') {
			return null;
		}

		var BASE64_MARKER = ';base64,';

		if (dataURL.indexOf(BASE64_MARKER) == -1) {

			var parts = dataURL.split(',');
			var contentType = parts[0].split(':')[1];
			var raw = decodeURIComponent(parts[1]);

			return new Blob([raw], {type: contentType});

		} else {

			var parts = dataURL.split(BASE64_MARKER);
			var contentType = parts[0].split(':')[1];
			var raw = window.atob(parts[1]);
			var rawLength = raw.length;
			var uInt8Array = new Uint8Array(rawLength);

			for (var i = 0; i < rawLength; ++i) {
				uInt8Array[i] = raw.charCodeAt(i);
			}

			return new Blob([uInt8Array], {type: contentType});

		}
	}

	/* entry logic */

	try {
		if (!window.FileReader) {
			throw 'window.FileReader is not supported.';
		}

		if (!window.Uint8Array) {
			throw 'window.Uint8Array is not supported.';
		}

		if (!window.atob) {
			throw 'window.atob is not supported.';
		}

		if (!window.Blob) {
			throw 'window.Blob is not supported.';
		} 
	} catch (e) {
		cfg.unsupportedBrowserCb(e);
	}

	var img = cfg.img;

	if (!img) {
		throw 'Input img is invalid or undefined';
	}

	var MAX_WIDTH = parseInt(cfg.maxWidth);
	var MAX_HEIGHT = parseInt(cfg.maxHeight);
	var previewCb = cfg.previewCb;
	var afterCb = cfg.afterCb;
	var invalidImgCb = cfg.invalidImgCb;
	var success = cfg.success;
	var exts = cfg.exts;

	if (!MAX_WIDTH || 
			!MAX_HEIGHT || 
			typeof MAX_WIDTH !== 'number' ||
			typeof MAX_HEIGHT !== 'number' ||
			MAX_WIDTH < 0 ||
			MAX_HEIGHT < 0) {
		throw 'maxWidth and maxHeight is invalid.';
	}

	resizeImg(img, function (resizedImg) {
		success(dataURLToBlob(resizedImg));
	});

}