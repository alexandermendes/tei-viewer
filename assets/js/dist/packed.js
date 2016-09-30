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

	var _createClass = function () {
	    function defineProperties(target, props) {
	        for (var i = 0; i < props.length; i++) {
	            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	        }
	    }return function (Constructor, protoProps, staticProps) {
	        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	    };
	}();

	function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	        throw new TypeError("Cannot call a class as a function");
	    }
	}

	/**
	 * Global DB server class.
	 */
	var DBServer = function () {

	    /**
	     * Initialise with database options.
	     */
	    function DBServer() {
	        _classCallCheck(this, DBServer);

	        this.server = null;
	        this.options = {
	            server: 'tei-viewer',
	            version: 3,
	            schema: {
	                tei: {
	                    key: { keyPath: 'id', autoIncrement: true }
	                }
	            }
	        };
	    }

	    /**
	     * Connect to the database.
	     */

	    _createClass(DBServer, [{
	        key: 'connect',
	        value: function connect() {
	            var _this = this;
	            return new Promise(function (resolve, reject) {
	                db.open(_this.options).then(function (server) {
	                    _this.server = server;
	                    resolve();
	                }).catch(function (err) {
	                    if (err.type === 'blocked') {
	                        oldConnection.close();
	                        return err.resume;
	                    }
	                    reject(err);
	                });
	            });
	        }

	        /**
	         * Return a record, ensuring that a connection is established first.
	         */

	    }, {
	        key: 'get',
	        value: function get(id) {
	            var _this = this;

	            function getRecord(id) {
	                return new Promise(function (resolve, reject) {
	                    _this.server.tei.get(id).then(function (record) {
	                        if (record == null) {
	                            reject(new Error('Record not found'));
	                        }
	                        resolve(record);
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                });
	            }

	            return new Promise(function (resolve, reject) {
	                if (_this.server == null) {
	                    _this.connect().then(function () {
	                        resolve(getRecord(id));
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                } else {
	                    resolve(getRecord(id));
	                }
	            });
	        }

	        /**
	         * Update a record, ensuring that a connection is established first.
	         */

	    }, {
	        key: 'update',
	        value: function update(record) {
	            var _this = this;

	            function updateRecord(record) {
	                return new Promise(function (resolve, reject) {
	                    _this.server.tei.update(record).then(function () {
	                        resolve();
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                });
	            }

	            return new Promise(function (resolve, reject) {
	                if (_this.server == null) {
	                    _this.connect().then(function () {
	                        resolve(updateRecord(record));
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                } else {
	                    resolve(updateRecord(record));
	                }
	            });
	        }
	    }]);

	    return DBServer;
	}();

	exports.default = window.dbServer = new DBServer();

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var editor;
	var record;

	/**
	 * Load a record from the id URL parameter.
	 */
	function loadRecord() {
	    return new Promise(function (resolve, reject) {
	        var uri = new URI(document.location.href),
	            query = URI.parseQuery(uri.query()),
	            id = query.id;

	        if (isNaN(id)) {
	            reject(new Error('Invalid ID parameter in URL'));
	        }

	        dbServer.get(parseInt(id)).then(function (r) {
	            record = r;
	            resolve();
	        }).catch(function (err) {
	            reject(err);
	        });
	    });
	}

	/**
	 * Save the record.
	 */
	$("#xml-save").click(function (evt) {
	    record.xml = editor.getValue();
	    dbServer.update(record).then(function () {
	        notify('Record saved!', 'success');
	    }).catch(function (err) {
	        notify(err.message, 'error');
	        throw err;
	    });
	    evt.preventDefault();
	});

	/**
	 * Download the record.
	 */
	$("#xml-download").click(function (evt) {
	    var type = 'application/xml',
	        link = document.createElement("a"),
	        file = new Blob([editor.getValue()], { type: type });
	    link.download = record.filename;
	    link.href = window.URL.createObjectURL(file);
	    link.dataset.downloadurl = [type, link.download, link.href].join(':');
	    link.click();
	    evt.preventDefault();
	});

	$(document).ready(function () {
	    if ($("#editor").length) {
	        loadRecord().then(function () {
	            $('#editor').text(record.xml);
	            editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	                mode: 'text/xml',
	                lineNumbers: true,
	                autofocus: true,
	                lineWrapping: true
	            });
	        }).catch(function (error) {
	            notify(error.message, 'error');
	            throw error;
	        });
	    }
	});

	exports.default = editor;

/***/ }
/******/ ]);