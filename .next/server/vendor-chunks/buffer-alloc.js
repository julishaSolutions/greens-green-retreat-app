/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/buffer-alloc";
exports.ids = ["vendor-chunks/buffer-alloc"];
exports.modules = {

/***/ "(action-browser)/./node_modules/buffer-alloc/index.js":
/*!********************************************!*\
  !*** ./node_modules/buffer-alloc/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var bufferFill = __webpack_require__(/*! buffer-fill */ \"(action-browser)/./node_modules/buffer-fill/index.js\")\nvar allocUnsafe = __webpack_require__(/*! buffer-alloc-unsafe */ \"(action-browser)/./node_modules/buffer-alloc-unsafe/index.js\")\n\nmodule.exports = function alloc (size, fill, encoding) {\n  if (typeof size !== 'number') {\n    throw new TypeError('\"size\" argument must be a number')\n  }\n\n  if (size < 0) {\n    throw new RangeError('\"size\" argument must not be negative')\n  }\n\n  if (Buffer.alloc) {\n    return Buffer.alloc(size, fill, encoding)\n  }\n\n  var buffer = allocUnsafe(size)\n\n  if (size === 0) {\n    return buffer\n  }\n\n  if (fill === undefined) {\n    return bufferFill(buffer, 0)\n  }\n\n  if (typeof encoding !== 'string') {\n    encoding = undefined\n  }\n\n  return bufferFill(buffer, fill, encoding)\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9idWZmZXItYWxsb2MvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUEsaUJBQWlCLG1CQUFPLENBQUMseUVBQWE7QUFDdEMsa0JBQWtCLG1CQUFPLENBQUMseUZBQXFCOztBQUUvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIi9ob21lL3VzZXIvc3R1ZGlvL25vZGVfbW9kdWxlcy9idWZmZXItYWxsb2MvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGJ1ZmZlckZpbGwgPSByZXF1aXJlKCdidWZmZXItZmlsbCcpXG52YXIgYWxsb2NVbnNhZmUgPSByZXF1aXJlKCdidWZmZXItYWxsb2MtdW5zYWZlJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxuXG4gIGlmIChCdWZmZXIuYWxsb2MpIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKHNpemUsIGZpbGwsIGVuY29kaW5nKVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IGFsbG9jVW5zYWZlKHNpemUpXG5cbiAgaWYgKHNpemUgPT09IDApIHtcbiAgICByZXR1cm4gYnVmZmVyXG4gIH1cblxuICBpZiAoZmlsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGJ1ZmZlckZpbGwoYnVmZmVyLCAwKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IHVuZGVmaW5lZFxuICB9XG5cbiAgcmV0dXJuIGJ1ZmZlckZpbGwoYnVmZmVyLCBmaWxsLCBlbmNvZGluZylcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/buffer-alloc/index.js\n");

/***/ })

};
;