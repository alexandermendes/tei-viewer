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

	var _loading = __webpack_require__(1);

	var _loading2 = _interopRequireDefault(_loading);

	var _notify = __webpack_require__(2);

	var _notify2 = _interopRequireDefault(_notify);

	var _parseUrl = __webpack_require__(3);

	var _parseUrl2 = _interopRequireDefault(_parseUrl);

	var _html5Check = __webpack_require__(4);

	var _html5Check2 = _interopRequireDefault(_html5Check);

	var _dbServer = __webpack_require__(5);

	var _dbServer2 = _interopRequireDefault(_dbServer);

	var _editor = __webpack_require__(6);

	var _editor2 = _interopRequireDefault(_editor);

	var _xml = __webpack_require__(7);

	var _xml2 = _interopRequireDefault(_xml);

	var _nav = __webpack_require__(8);

	var _nav2 = _interopRequireDefault(_nav);

	var _table = __webpack_require__(9);

	var _table2 = _interopRequireDefault(_table);

	var _upload = __webpack_require__(10);

	var _upload2 = _interopRequireDefault(_upload);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.onload = function () {
	    window.setTimeout(_loading2.default.hide, 500);
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	window.loading = { 'hide': null, 'show': null };

	loading.hide = function () {
	    $("#loading").fadeOut('fast');
	    $("nav, main, footer").removeClass('invisible');
	    $("nav, footer").addClass('animated slideInLeft');
	    $("main").addClass('animated slideInRight');
	};

	exports.default = window.loading;

/***/ },
/* 2 */
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
	            opts.delay = 3000;
	            opts.hide = true;
	            break;
	    }

	    new PNotify(opts);
	};

	exports.default = notify;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	window.parseURL = { getIntParameter: null };

	parseURL.getIntParameter = function (parameter) {
	    var required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	    var uri = new URI(document.location.href),
	        query = URI.parseQuery(uri.query());

	    if (typeof query[parameter] === 'undefined' && !required) {
	        return null;
	    }

	    if (isNaN(query[parameter])) {
	        notify('Invalid parameters in URL', 'error');
	        throw new Error('Invalid parameters in URL');
	    }

	    return parseInt(query[parameter]);
	};

	exports.default = window.parseURL;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var html5Check;

	var required = [Modernizr.filereader, Modernizr.promises, Modernizr.indexeddb, Modernizr.blobconstructor, Modernizr.flexbox, Modernizr.webworkers];

	$.each(required, function (i, v) {
	    if (!v) {
	        notify('Your browser does not support the required HTML5 features, ' + 'please upgrade.', 'error');
	    }
	});

	exports.default = html5Check;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	         * Add a record, ensuring that a connection is established first.
	         */

	    }, {
	        key: 'add',
	        value: function add(data) {
	            var _this = this;

	            function addRecord(id, xml) {
	                return new Promise(function (resolve, reject) {
	                    _this.server.tei.add(data).then(function () {
	                        resolve();
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                });
	            }

	            return new Promise(function (resolve, reject) {
	                if (_this.server === null) {
	                    _this.connect().then(function () {
	                        resolve(addRecord(data));
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                } else {
	                    resolve(addRecord(data));
	                }
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
	                        if (typeof record === 'undefined') {
	                            reject(new Error('Record not found'));
	                        }
	                        resolve(record);
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                });
	            }

	            return new Promise(function (resolve, reject) {
	                if (_this.server === null) {
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
	                if (_this.server === null) {
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

	        /**
	         * Return multiple records, ensuring that a connection is established first.
	         */

	    }, {
	        key: 'getMultiple',
	        value: function getMultiple() {
	            var fromRecord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	            var toRecord = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

	            var _this = this;

	            function getMultipleRecords(fromRecord, toRecord) {
	                return new Promise(function (resolve, reject) {
	                    _this.server.tei.query().all().limit(fromRecord, toRecord).execute().then(function (records) {
	                        resolve(records);
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                });
	            }

	            return new Promise(function (resolve, reject) {
	                if (_this.server === null) {
	                    _this.connect().then(function () {
	                        resolve(getMultipleRecords(fromRecord, toRecord));
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                } else {
	                    resolve(getMultipleRecords(fromRecord, toRecord));
	                }
	            });
	        }

	        /**
	         * Count records, ensuring that a connection is established first.
	         */

	    }, {
	        key: 'count',
	        value: function count() {
	            var _this = this;

	            function countRecords() {
	                return new Promise(function (resolve, reject) {
	                    _this.server.tei.count().then(function (n) {
	                        resolve(n);
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                });
	            }

	            return new Promise(function (resolve, reject) {
	                if (_this.server === null) {
	                    _this.connect().then(function () {
	                        resolve(countRecords());
	                    }).catch(function (err) {
	                        reject(err);
	                    });
	                } else {
	                    resolve(countRecords());
	                }
	            });
	        }
	    }]);

	    return DBServer;
	}();

	exports.default = window.dbServer = new DBServer();

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var editor;
	var record;

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
	        var id = parseURL.getIntParameter('id', true);
	        dbServer.get(id).then(function (r) {
	            record = r;
	            $('#editor').text(record.xml);
	            editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	                mode: 'text/xml',
	                lineNumbers: true,
	                autofocus: true,
	                lineWrapping: true
	            });
	        }).catch(function (err) {
	            notify(err.message, 'error');
	            throw err;
	        });
	    }
	});

	exports.default = editor;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var xml = { merge: null };

	/**
	 * Remove the XML declaration from an XML document.
	 */
	function removeXMLDeclaration(xml) {
	    return xml.replace(/<\?xml.*?\?>/g, "");
	}

	/**
	 * Add the database ID to an XML document.
	 */
	function addID(xml, id) {
	    return xml.replace(/<TEI/g, '<TEI id="' + id + '"');
	}

	/**
	 * Return a merged XML document.
	 * @param {Array} data - The data to merge.
	 */
	xml.merge = function (data) {
	    var xmlStr = "<MERGED-TEI>";
	    $.each(data, function (i, v) {
	        v.xml = addID(v.xml, v.id);
	        v.xml = removeXMLDeclaration(v.xml);
	        xmlStr = xmlStr.concat(v.xml);
	    });
	    xmlStr = xmlStr.concat('</MERGED-TEI>');
	    return $.parseXML(xmlStr);
	};

	exports.default = window.xml = xml;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var nav;

	$('.nav-exit').on('click', function (evt) {
	    var url = $(this).attr("href");
	    $("nav, footer").addClass('animated slideOutLeft');
	    $("main").addClass('animated slideOutRight');
	    setTimeout(function () {
	        window.location = url;
	    }, 1000);
	    evt.preventDefault();
	});

	exports.default = nav;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var tableView;

	/**
	 * Load uploaded XML data into the table.
	 */
	function loadTable() {
	    var page = parseURL.getIntParameter('page') - 1 || 0,
	        limit = parseURL.getIntParameter('limit') || 50;
	    dbServer.getMultiple(page, limit).then(function (records) {
	        console.log(xml.merge(records));
	    }).catch(function (err) {
	        notify(err.message, 'error');
	        throw err;
	    }).then(function () {
	        loading.hide();
	    });
	}

	/** Handle add files event. */
	$('#upload-form input[type="file"]').change(function (evt) {
	    var files = evt.target.files;
	    uploadFiles(files);
	});

	/** Handle a show XML event. */
	$("#tei-table").on('click', ".show-xml", function (evt) {
	    var recordID = parseInt($(this).parents('tr')[0].id);
	    window.location.href = '/editor?id=' + recordID;
	});

	/** Handle change page event. */
	$("#tei-table").on('click', ".change-page", function (evt) {
	    var page = parseInt($(this).data('page')),
	        limit = parseInt($(this).data('limit'));
	    window.location.href = '/?page=' + page + '&limit=' + limit;
	});

	$(document).ready(function () {
	    if ($('#tei-table').length) {
	        loadTable();
	    }
	});

	exports.default = tableView;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var uploadView;

	Dropzone.autoDiscover = false;

	/**
	 * Override Dropzone method to upload files to IndexedDB.
	 * @param {FileList} files - The files to upload.
	 */
	Dropzone.prototype.uploadFiles = function (files) {
	    var _this = this;
	    var reader = {};

	    function saveFile(theFile) {
	        return function (evt) {

	            try {
	                $.parseXML(evt.target.result);
	            } catch (error) {
	                _this._errorProcessing([theFile], "Invalid XML");
	                return;
	            }

	            dbServer.add({
	                xml: evt.target.result,
	                filename: theFile.name
	            }).catch(function (error) {
	                _this._errorProcessing([theFile], error.message);
	                return;
	            });
	            _this._finished([theFile], 'Success');
	        };
	    }

	    for (var i = 0; i < files.length; i++) {
	        reader = new FileReader();
	        reader.onload = saveFile(files[i]);
	        reader.readAsText(files[i]);
	        _this.emit("updateprogress");
	    }
	};

	$(document).ready(function () {
	    if ($('#upload-view').length) {

	        var previewNode = document.querySelector("#template");
	        previewNode.id = "";
	        var previewTemplate = previewNode.parentNode.innerHTML;
	        previewNode.parentNode.removeChild(previewNode);

	        var addButtons = [];
	        $('.add-files').each(function () {
	            addButtons.push($(this)[0]);
	        });

	        $('.add-files').on('click', function (evt) {
	            evt.preventDefault();
	        });

	        var dz = new Dropzone("#upload-form", {
	            url: '/upload',
	            acceptedFiles: 'text/xml',
	            createImageThumbnails: false,
	            accept: function accept(file, done) {
	                if (file.type !== 'text/xml') {
	                    done('Invalid XML file');
	                }
	                done();
	            },
	            clickable: addButtons,
	            autoQueue: false,
	            previewsContainer: "#previews",
	            previewTemplate: previewTemplate,
	            parallelUploads: 1
	        });

	        /** Handle completed upload. */
	        dz.on("queuecomplete", function (progress) {
	            var nErrors = dz.files.filter(function (el) {
	                return el.status == "error";
	            }).length;

	            if (nErrors > 0) {
	                $('#total-progress').attr('value', 0);
	                notify(nErrors + ' file' + (nErrors == 1 ? '' : 's') + ' could not be uploaded, please correct the errors' + ' and try again', 'warning');

	                // Remove successfully uploaded files
	                var success = dz.files.filter(function (el) {
	                    return el.status == "success";
	                });
	                for (var i = 0; i < success.length; i++) {
	                    dz.remove(success[i]);
	                }
	            } else {
	                window.location.href = '/table';
	            }
	        });

	        /** Start the upload. */
	        $("#start-upload").on('click', function (evt) {
	            var nFiles = dz.getFilesWithStatus(Dropzone.ADDED).length;
	            if (nFiles > 0) {
	                dz.enqueueFiles(dz.getFilesWithStatus(Dropzone.ADDED));
	            } else {
	                notify('Please choose some files to upload!', 'info');
	            }
	        });

	        /** Hide form when a file is added. */
	        dz.on("addedfile", function (file) {
	            $("#upload-form").hide();
	        });

	        /** Update progress. */
	        dz.on("updateprogress", function () {
	            var total = dz.files.length,
	                processed = dz.files.length - dz.getActiveFiles().length,
	                progress = 100 * processed / total;
	            $('#total-progress').attr('value', progress);
	        });
	    }
	});

	exports.default = uploadView;

/***/ }
/******/ ]);