"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileFormatStr = getFileFormatStr;
exports.isFileDataComplete = isFileDataComplete;
exports.groupFilesByRelations = groupFilesByRelations;
exports.extractSinglyGroupedItems = extractSinglyGroupedItems;
exports.isFilenameAnImage = isFilenameAnImage;
exports.getLargeMD5 = getLargeMD5;
exports.groupFilesByQCSummaryTitles = exports.filterFilesWithQCSummary = exports.filterFilesWithEmbeddedMetricItem = void 0;

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _object = require("./object");

var _misc = require("./misc");

var _patchedConsole = require("./patched-console");

var _typedefs = require("./typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var CryptoJS = require('crypto-js');

function getFileFormatStr(file) {
  return file && file.file_format && (file.file_format.file_format || file.file_format.display_title) || null;
}

function isFileDataComplete(file) {
  if (!file || _typeof(file) !== 'object') throw new Error('File param is not an object.');

  if ((0, _misc.isServerSide)() || !window || !document) {
    return true;
  }

  if (typeof file.status !== 'string') {
    return false;
  }

  if (typeof file.display_title !== 'string') {
    return false;
  }

  if (!Array.isArray(file['@type'])) {
    return false;
  }

  return true;
}

function groupFilesByRelations(files) {
  var isBidirectional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var groups = [];
  var ungroupedFiles = files.slice(0);
  var encounteredIDs = new Set();
  var currGroup = [ungroupedFiles.shift()],
      currGroupIdx = 0,
      currFile,
      currFileID,
      ungroupedIter,
      anotherUngroupedFile;

  while (ungroupedFiles.length > 0) {
    if (currGroupIdx >= currGroup.length) {
      groups.push(currGroup);
      currGroup = [ungroupedFiles.shift()];
      currGroupIdx = 0;
    }

    currFile = currGroup[currGroupIdx];
    currFileID = _object.itemUtil.atId(currFile);

    if (!currFileID) {
      currGroupIdx++;
      continue;
    }

    _underscore["default"].forEach(currFile.related_files || [], function (relatedFileEmbeddedObject) {
      var relatedFileID = _object.itemUtil.atId(relatedFileEmbeddedObject.file);

      relatedFileEmbeddedObject.relationship_type;

      if (!relatedFileID) {
        return;
      }

      if (encounteredIDs.has(relatedFileID)) {
        return;
      }

      var relatedFileIndex = _underscore["default"].findIndex(ungroupedFiles, function (ungroupedFile) {
        return relatedFileID === _object.itemUtil.atId(ungroupedFile);
      });

      if (relatedFileIndex === -1) {
        _patchedConsole.patchedConsoleInstance.warn("Could not find related_file \"" + relatedFileID + "\" in list of ungrouped files.");

        return;
      }

      var relatedFile = ungroupedFiles[relatedFileIndex];
      ungroupedFiles.splice(relatedFileIndex, 1);
      currGroup.push(relatedFile);
    });

    if (!isBidirectional) {
      for (ungroupedIter = 0; ungroupedIter < ungroupedFiles.length; ungroupedIter++) {
        anotherUngroupedFile = ungroupedFiles[ungroupedIter];

        _underscore["default"].forEach(anotherUngroupedFile.related_files || [], function (relatedFileEmbeddedObject) {
          var relatedFileID = _object.itemUtil.atId(relatedFileEmbeddedObject.file);

          if (!relatedFileID) {
            return;
          }

          if (encounteredIDs.has(relatedFileID)) {
            return;
          }

          if (relatedFileID === currFileID) {
            currGroup.push(anotherUngroupedFile);
            ungroupedFiles.splice(ungroupedIter, 1);
            ungroupedIter--;
          }
        });
      }
    }

    encounteredIDs.add(currFileID);
    currGroupIdx++;
  }

  groups.push(currGroup);
  return groups;
}

function extractSinglyGroupedItems(groups) {
  var _$partition = _underscore["default"].partition(groups, function (g) {
    return g.length > 1;
  }),
      _$partition2 = _slicedToArray(_$partition, 2),
      multiFileGroups = _$partition2[0],
      singleFileGroups = _$partition2[1];

  return [multiFileGroups, _underscore["default"].flatten(singleFileGroups, true)];
}

var filterFilesWithEmbeddedMetricItem = (0, _memoizeOne["default"])(function (files) {
  var checkAny = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var func = checkAny ? _underscore["default"].any : _underscore["default"].filter;
  return func(files, function (f) {
    return f.quality_metric && f.quality_metric.overall_quality_status;
  });
});
exports.filterFilesWithEmbeddedMetricItem = filterFilesWithEmbeddedMetricItem;
var filterFilesWithQCSummary = (0, _memoizeOne["default"])(function (files) {
  var checkAny = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var func = checkAny ? _underscore["default"].any : _underscore["default"].filter;
  return func(files, function (f) {
    return Array.isArray(f.quality_metric_summary) && f.quality_metric_summary.length > 0 && f.quality_metric_summary.length === Array.from(new Set(_underscore["default"].pluck(f.quality_metric_summary, 'title'))).length;
  });
});
exports.filterFilesWithQCSummary = filterFilesWithQCSummary;
var groupFilesByQCSummaryTitles = (0, _memoizeOne["default"])(function (filesWithMetrics) {
  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "\t";
  return _underscore["default"].pluck(Array.from(_underscore["default"].reduce(filesWithMetrics, function (m, file) {
    var titles = _underscore["default"].map(file.quality_metric_summary, function (qcMetric) {
      return qcMetric.title || qcMetric.display_title;
    });

    var titlesAsString = titles.join(sep);

    if (!m.has(titlesAsString)) {
      m.set(titlesAsString, []);
    }

    m.get(titlesAsString).push(file);
    return m;
  }, new Map())), 1);
});
exports.groupFilesByQCSummaryTitles = groupFilesByQCSummaryTitles;

function isFilenameAnImage(filename) {
  var suppressErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var fileNameLower, fileNameLowerEnds;

  if (typeof filename === 'string') {
    fileNameLower = filename && filename.length > 0 && filename.toLowerCase() || '';
    fileNameLowerEnds = {
      '3': fileNameLower.slice(-3),
      '4': fileNameLower.slice(-4),
      '5': fileNameLower.slice(-5)
    };
  } else if (filename && _typeof(filename) === 'object' && filename['3'] && filename['4']) {
    fileNameLowerEnds = filename;
  } else if (!suppressErrors) {
    throw new Error('Param \'filename\' must be a string or pre-formatted map of last char-lengths to their values.');
  } else {
    return false;
  }

  return fileNameLowerEnds['5'] === '.tiff' || fileNameLowerEnds['4'] === '.jpg' || fileNameLowerEnds['5'] === '.jpeg' || fileNameLowerEnds['4'] === '.png' || fileNameLowerEnds['4'] === '.bmp' || fileNameLowerEnds['4'] === '.gif';
}

function arrayBufferToWordArray(ab) {
  var i8a = new Uint8Array(ab);
  var a = [];

  for (var i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }

  var result = CryptoJS.lib.WordArray.create(a, i8a.length);
  return [result, i8a.length];
}

function readChunked(file, chunkCallback, endCallback) {
  var fileSize = file.size;
  var offset = 0;
  var reader = new FileReader();

  reader.onload = function () {
    if (reader.error) {
      endCallback(reader.error || {});
      return;
    }

    var wordArrayRes = arrayBufferToWordArray(reader.result);
    offset += wordArrayRes[1];
    chunkCallback(wordArrayRes[0], offset, fileSize);

    if (offset >= fileSize) {
      endCallback(null);
      return;
    }

    readNext();
  };

  reader.onerror = function (err) {
    endCallback(err || {});
  };

  function readNext() {
    var fileSlice = file.slice(offset, offset + 4 * 1024 * 1024);
    reader.readAsArrayBuffer(fileSlice);
  }

  readNext();
}

function getLargeMD5(file, cbProgress) {
  return new Promise(function (resolve, reject) {
    var md5 = CryptoJS.algo.MD5.create();
    readChunked(file, function (chunk, offs, total) {
      md5.update(chunk);

      if (cbProgress) {
        cbProgress(Math.round(offs / total * 100));
      }
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        var hash = md5.finalize();
        var hashHex = hash.toString(CryptoJS.enc.Hex);
        resolve(hashHex);
      }
    });
  });
}