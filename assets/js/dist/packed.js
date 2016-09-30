/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _notify = __webpack_require__(1);

	var _notify2 = _interopRequireDefault(_notify);

	var _html5Check = __webpack_require__(2);

	var _html5Check2 = _interopRequireDefault(_html5Check);

	var _dbServer = __webpack_require__(3);

	var _dbServer2 = _interopRequireDefault(_dbServer);

	var _editor = __webpack_require__(4);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	window.notify = function (msg, type) {

	    var opts = {
	        text: msg,
	        type: type,
	        hide: false,
	        buttons: {
	            closer: true,
	            sticker: false
	        }
	    };

	    switch (type) {
	        case "success":
	            opts.title = 'Success';
	            opts.icon = 'fa fa-thumbs-up';
	            opts.delay = 3000;
	            opts.hide = true;
	            break;
	        case "error":
	            opts.title = 'Error';
	            opts.icon = 'fa fa-exclamation-circle';
	            break;
	        case "warning":
	            opts.title = 'Warning';
	            opts.icon = 'fa fa-exclamation-circle';
	            break;
	        default:
	            opts.title = 'Info';
	            opts.icon = 'fa fa-info-circle';
	            break;
	    }

	    new PNotify(opts);
	};

	exports.default = notify;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var html5Check;

	var required = [Modernizr.filereader, Modernizr.promises, Modernizr.indexeddb, Modernizr.blobconstructor];

	$.each(required, function (i, v) {
	    if (!v) {
	        notify('Your browser does not support the required HTML5 features, ' + 'please upgrade.', 'error');
	    }
	});

	exports.default = html5Check;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	window.dbServer = undefined;

	db.open({
	    server: 'tei-viewer',
	    version: 3,
	    schema: {
	        tei: {
	            key: { keyPath: 'id', autoIncrement: true }
	        }
	    }
	}).then(function (server) {
	    window.dbServer = server;
	}).catch(function (err) {
	    notify(err.message, 'error');
	    throw err;
	});

	exports.default = window.dbServer;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var editor;
	var record;

	/** Attempt to load a record from id parameter given in the current URL. */
	function loadRecord() {
	    return new Promise(function (resolve, reject) {
	        var uri = new URI(document.location.href),
	            query = URI.parseQuery(uri.query()),
	            id = query.id;

	        if (isNaN(id)) {
	            reject(new Error('Invalid ID parameter in URL'));
	        }

	        dbServer.tei.get(parseInt(id)).then(function (record) {
	            if (typeof record === 'undefined') {
	                reject(new Error('Record not found'));
	            }
	            resolve(record);
	        }).catch(function (err) {
	            reject(err);
	        });
	    });
	}

	/** Handle XML save button event */
	$("#xml-save").click(function (evt) {
	    record.xml = codeEditor.getValue();
	    dbServer.tei.update(result).then(function () {
	        showView('loading');
	        refreshView();

	        // Go back to main view

	        notify('Record updated!', 'success');
	    }).catch(function (err) {
	        notify(err.message, 'error');
	        throw err;
	    });
	});

	/** Handle XML download button event */
	$("#xml-download").click(function (evt) {
	    var contentType = 'application/xml',
	        link = document.createElement("a"),
	        xmlFile = new Blob([codeEditor.getValue()], { type: contentType });
	    link.download = record.filename;
	    link.href = window.URL.createObjectURL(xmlFile);
	    link.dataset.downloadurl = [contentType, link.download, link.href].join(':');
	    link.click();
	});

	$(document).ready(function () {
	    if ($("#editor").length) {
	        var promise = loadRecord();
	        promise.then(function (record) {
	            record = record;
	            $('#editor').text(record.xml);
	            editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	                mode: 'text/xml',
	                lineNumbers: true,
	                autofocus: true,
	                lineWrapping: true
	            });
	        }).catch(function (error) {
	            notify(error.message, 'error');
	        });
	    }
	});

	exports.default = editor;

/***/ }
/******/ ]);