/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/buffer-alloc-unsafe";
exports.ids = ["vendor-chunks/buffer-alloc-unsafe"];
exports.modules = {

/***/ "(action-browser)/./node_modules/buffer-alloc-unsafe/index.js":
/*!***************************************************!*\
  !*** ./node_modules/buffer-alloc-unsafe/index.js ***!
  \***************************************************/
/***/ ((module) => {

eval("function allocUnsafe (size) {\n  if (typeof size !== 'number') {\n    throw new TypeError('\"size\" argument must be a number')\n  }\n\n  if (size < 0) {\n    throw new RangeError('\"size\" argument must not be negative')\n  }\n\n  if (Buffer.allocUnsafe) {\n    return Buffer.allocUnsafe(size)\n  } else {\n    return new Buffer(size)\n  }\n}\n\nmodule.exports = allocUnsafe\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9idWZmZXItYWxsb2MtdW5zYWZlL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL25leHRuLy4vbm9kZV9tb2R1bGVzL2J1ZmZlci1hbGxvYy11bnNhZmUvaW5kZXguanM/MmZlMiJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBhbGxvY1Vuc2FmZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgbmVnYXRpdmUnKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5hbGxvY1Vuc2FmZSkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2NVbnNhZmUoc2l6ZSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzaXplKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWxsb2NVbnNhZmVcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/buffer-alloc-unsafe/index.js\n");

/***/ })

};
;