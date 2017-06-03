var umd =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_ajax__ = __webpack_require__(2);

// import cookie from './cookie'
// import {EventEmitter}from './eventEmitter'

module.exports = {
  ajax: __WEBPACK_IMPORTED_MODULE_0__utils_ajax__["a" /* default */]
};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)(module)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var filter = str => {
	// 特殊字符转义
	str += ''; // 隐式转换
	str = str.replace(/%/g, '%25');
	str = str.replace(/\+/g, '%2B');
	str = str.replace(/ /g, '%20');
	str = str.replace(/\//g, '%2F');
	str = str.replace(/\?/g, '%3F');
	str = str.replace(/&/g, '%26');
	str = str.replace(/=/g, '%3D');
	str = str.replace(/#/g, '%23');
	return str;
};

//中间件函数
function resolveHooks(list, params, complete = () => {}) {
	list.push(complete);
	var _list = list.map((fn, index) => {
		return () => {
			let next = _list[index + 1];
			if (next) {
				fn(params, next);
			} else {
				fn(params);
			}
		};
	});
	_list[0]();
}

ajax.beforeHooks = [];
ajax.afterHooks = [];
ajax.beforeReq = fn => {
	ajax.beforeHooks.push(fn);
};
ajax.afterRes = fn => {
	ajax.afterHooks.push(fn);
};

function ajax(options) {
	let settings = {
		method: 'GET',
		url: '',
		data: {},
		dataType: 'json',
		success: function () {},
		error: function () {}
	};

	Object.assign(settings, options);

	let xhr = new XMLHttpRequest();

	resolveHooks(ajax.beforeHooks, settings, () => {
		if (settings.method.toUpperCase() === 'GET') {
			xhr.open('GET', settings.url, true);
			xhr.send(null);
		} else if (settings.method.toUpperCase() === 'POST') {
			let query = [];
			xhr.open('GET', window.location.href.split('?')[0], true);
			for (var key in settings.data) {
				query.push(`${key}=${filter(settings.data[key])}`);
			}

			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(query.join('&'));
		}
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
				resolveHooks(ajax.afterHooks, xhr.responseText, settings.success);
			} else {
				resolveHooks(ajax.afterHooks, xhr.status, settings.error);
			}
		};
	});
}
/* harmony default export */ __webpack_exports__["a"] = ({
	get(url, data = {}, success = () => {}, error = () => {}) {
		ajax({ url, data, success, error, type: 'GET' });
	},
	post(url, data = {}, success = () => {}, error = () => {}) {
		ajax({ url, data, success, error, type: 'POST' });
	}
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
(function webpackMissingModule() { throw new Error("Cannot find module \"dev\""); }());
(function webpackMissingModule() { throw new Error("Cannot find module \"server\""); }());


/***/ })
/******/ ]);