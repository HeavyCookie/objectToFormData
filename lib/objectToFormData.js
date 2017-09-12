'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var formatPath = exports.formatPath = function formatPath(_ref) {
  var _ref2 = _toArray(_ref),
      base = _ref2[0],
      rest = _ref2.slice(1);

  if (rest.length > 0) {
    return base + '[' + rest.join('][') + ']';
  }
  return base;
};

var convert = function convert(object) {
  var previousPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var formData = arguments[2];

  var form = formData || new FormData();

  Object.keys(object).forEach(function (key) {
    var value = object[key];
    var fullPath = [].concat(_toConsumableArray(previousPath), [key]);

    // Array
    if (value instanceof Array) {
      var p = formatPath(fullPath) + '[]';
      value.forEach(function (v) {
        form.append(p, v);
      });
      // Blob/File
    } else if (value instanceof Blob || value instanceof File) {
      form.append(formatPath(fullPath), value);
      // String
    } else if (typeof value === 'string') {
      form.append(formatPath(fullPath), value);
      // Object
    } else if (value instanceof Object) {
      convert(value, fullPath, form);
    }
  });

  return form;
};

exports.default = convert;