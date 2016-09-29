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

	var _html5Check = __webpack_require__(1);

	var _html5Check2 = _interopRequireDefault(_html5Check);

	var _notify = __webpack_require__(2);

	var _notify2 = _interopRequireDefault(_notify);

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
	var html5Check;

	var required = [Modernizr.filereader, Modernizr.promises, Modernizr.indexeddb];

	$.each(required, function (i, v) {
	    if (!v) {
	        showAlert('Your browser does not support the required HTML5 ' + 'features, please upgrade.', 'danger');
	    }
	});

	exports.default = html5Check;

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
	            break;
	    }

	    opts.text = msg;
	    new PNotify(opts);
	};

	exports.default = notify;

/***/ }
/******/ ]);