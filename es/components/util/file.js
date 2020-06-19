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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var CryptoJS = require('crypto-js');

/** WE WILL REMOVE MOST FUNCS FROM HERE THAT ARENT REUSABLE & KEEP REST IN PROJ-SPECIFIC REPOS */

/**
 * Gets file_format string from a file.
 * Requires file_format to be embedded.
 * Currently file_format.display_title is same as file_format.file_format, so either property is fine.
 * This may change in the future and would require file_format.file_format to be embedded.
 *
 * @param {File} file - A File Item JSON
 * @returns {string|null} Format of the file.
 */
function getFileFormatStr(file) {
  return file && file.file_format && (file.file_format.file_format || file.file_format.display_title) || null;
}
/**
 * Pass a File Item through this function to determine whether to fetch more of it via AJAX or not.
 *
 * Use presence of 'status', '@type', and 'display_title' property to determine if File object/Item we have
 * is complete in its properties or not.
 *
 * @param {File} file - Object representing an embedded file. Should have display_title, at minimum.
 * @returns {boolean} True if complete, false if not.
 * @throws Error if file is not an object.
 */


function isFileDataComplete(file) {
  if (!file || _typeof(file) !== 'object') throw new Error('File param is not an object.');

  if ((0, _misc.isServerSide)() || !window || !document) {
    return true; // For tests, primarily.
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
/**********************************
 *** Grouping-related functions ***
 **********************************/

/**
 * Basic greedy file grouping algorithm.
 *
 * @param {{ related_files: { relationship_type : string, file: Object }[] }[]} files - List of File Items.
 * @param {boolean} isBidirectional - If set to true, runs slightly faster.
 * @returns {File[][]} A list of groups (lists) of files grouped by their related_files connection(s).
 */


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
      // No more left to add to curr. group. Start new one.
      groups.push(currGroup);
      currGroup = [ungroupedFiles.shift()];
      currGroupIdx = 0;
    }

    currFile = currGroup[currGroupIdx];
    currFileID = _object.itemUtil.atId(currFile);

    if (!currFileID) {
      // No view permission most likely, continue.
      currGroupIdx++;
      continue;
    } // Handle unidirectional cases from this file pointing to others.
    // Bidirectional cases are implicitly handled as part of this.


    _underscore["default"].forEach(currFile.related_files || [], function (relatedFileEmbeddedObject) {
      var relatedFileID = _object.itemUtil.atId(relatedFileEmbeddedObject.file);

      relatedFileEmbeddedObject.relationship_type; // Unused

      if (!relatedFileID) {
        // Most likely no view permissions
        // Cancel out -- remaining file (if any) will be picked up as part of while loop.
        return;
      }

      if (encounteredIDs.has(relatedFileID)) {
        // Has been encountered already, likely as part of bidirectional connection.
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
      // Handle unidirectional cases from other files pointing to this 1.
      for (ungroupedIter = 0; ungroupedIter < ungroupedFiles.length; ungroupedIter++) {
        anotherUngroupedFile = ungroupedFiles[ungroupedIter];

        _underscore["default"].forEach(anotherUngroupedFile.related_files || [], function (relatedFileEmbeddedObject) {
          var relatedFileID = _object.itemUtil.atId(relatedFileEmbeddedObject.file);

          if (!relatedFileID) {
            // Most likely no view permissions
            // Cancel out -- remaining file (if any) will be picked up as part of while loop.
            return;
          }

          if (encounteredIDs.has(relatedFileID)) {
            // Has been encountered already, likely as part of bidirectional connection.
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
/**
 * Filter a list of files down to those with a value for `quality_metric` and `quality_metric.overall_quality_status`.
 *
 * @deprecated If Raw Files also start have quality_metric_summary populated, then we can migrate away from & delete this func.
 *
 * @param {File[]} files                    List of files, potentially with quality_metric.
 * @param {boolean} [checkAny=false]        Whether to run a _.any (returning a boolean) instead of a _.filter, for performance in case don't need the files themselves.
 * @returns {File[]|true} Filtered list of files or boolean for "any", depending on `checkAny` param.
 */


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
    return f.quality_metric && Array.isArray(f.quality_metric.quality_metric_summary) && f.quality_metric.quality_metric_summary.length > 0 && // Ensure all unique titles
    f.quality_metric.quality_metric_summary.length === Array.from(new Set(_underscore["default"].pluck(f.quality_metric.quality_metric_summary, 'title'))).length;
  });
});
/**
 * Groups files with a `quality_metric_summary` property by the concatanated
 * unique titles of the summary items/columns.
 *
 * @param {File[]} filesWithMetrics - List of files which all contain a `quality_metric_summary`.
 * @returns {File[][]} Groups of files as 2d array.
 */

exports.filterFilesWithQCSummary = filterFilesWithQCSummary;
var groupFilesByQCSummaryTitles = (0, _memoizeOne["default"])(function (filesWithMetrics, schemas) {
  var sep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "\t";

  var filesByTitles = _underscore["default"].pluck(Array.from(_underscore["default"].reduce(filesWithMetrics, function (m, file) {
    var titles = _underscore["default"].map(file.quality_metric.quality_metric_summary, function (qcMetric) {
      return qcMetric.title || qcMetric.display_title; // In case becomes an embedded obj at some point.
    });

    var titlesAsString = titles.join(sep); // Using Tab as is unlikely character to be used in a title column.

    if (!m.has(titlesAsString)) {
      m.set(titlesAsString, []);
    }

    m.get(titlesAsString).push(file);
    return m;
  }, new Map())), 1); //if schemas provided than return the result sorted by file's QC's qc_order


  if (_typeof(schemas) === 'object' && schemas !== null) {
    filesByTitles = _underscore["default"].sortBy(filesByTitles, function (files) {
      var file = files[0]; //assumption: 1st file's QC is adequate to define order

      if (file.quality_metric['@type'] && Array.isArray(file.quality_metric['@type']) && file.quality_metric['@type'].length > 0) {
        var itemType = file.quality_metric['@type'][0];

        if (schemas[itemType]) {
          var qc_order = schemas[itemType].qc_order;

          if (typeof qc_order === 'number') {
            return qc_order;
          }
        }
      } //fallback - if qc_order is not defined then send it to end


      return Number.MAX_SAFE_INTEGER || 1000000;
    });
  }

  return filesByTitles;
});
exports.groupFilesByQCSummaryTitles = groupFilesByQCSummaryTitles;

function isFilenameAnImage(filename) {
  var suppressErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var fileNameLower, fileNameLowerEnds;

  if (typeof filename === 'string') {
    fileNameLower = filename && filename.length > 0 && filename.toLowerCase() || ''; // Store ending(s) into object so we don't have to call `fileNameLower.slice` per each comparison.

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
/*******************/

/*** MD5 Related ***/

/*******************/

/**
 * Return a cryptojs WordArray given an arrayBuffer (elemtent 0). Also return
 * original arraylength contained within buffer (element 1)
 * Solution originally: https://groups.google.com/forum/#!msg/crypto-js/TOb92tcJlU0/Eq7VZ5tpi-QJ
 */


function arrayBufferToWordArray(ab) {
  var i8a = new Uint8Array(ab);
  var a = [];

  for (var i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  } // WordArrays are UTF8 by default


  var result = CryptoJS.lib.WordArray.create(a, i8a.length);
  return [result, i8a.length];
}

function readChunked(file, chunkCallback, endCallback) {
  var fileSize = file.size;
  // 4MB chunks
  var offset = 0;
  var reader = new FileReader();

  reader.onload = function () {
    if (reader.error) {
      endCallback(reader.error || {});
      return;
    }

    var wordArrayRes = arrayBufferToWordArray(reader.result);
    offset += wordArrayRes[1]; // callback for handling read chunk

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
/**
 * Adapted from http://stackoverflow.com/questions/39112096
 * Takes a file object and optional callback progress function
 *
 * @param {File} file - Instance of a File class (subclass of Blob).
 * @param {function} cbProgress - Callback function on progress change. Accepts a 0-1 float value.
 * @returns {Promise} AJAX Promise object.
 */


function getLargeMD5(file, cbProgress) {
  return new Promise(function (resolve, reject) {
    // create algorithm for progressive hashing
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