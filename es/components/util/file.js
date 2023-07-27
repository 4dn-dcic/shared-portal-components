import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _typeof from "@babel/runtime/helpers/typeof";
var CryptoJS = require('crypto-js');
import _ from 'underscore';
import memoize from 'memoize-one';
import { itemUtil } from './object';
import { isServerSide } from './misc';
import { patchedConsoleInstance as console } from './patched-console';

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
export function getFileFormatStr(file) {
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
export function isFileDataComplete(file) {
  if (!file || _typeof(file) !== 'object') throw new Error('File param is not an object.');
  if (isServerSide() || !window || !document) {
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
export function groupFilesByRelations(files) {
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
    currFileID = itemUtil.atId(currFile);
    if (!currFileID) {
      // No view permission most likely, continue.
      currGroupIdx++;
      continue;
    }

    // Handle unidirectional cases from this file pointing to others.
    // Bidirectional cases are implicitly handled as part of this.
    _.forEach(currFile.related_files || [], function (relatedFileEmbeddedObject) {
      var relatedFileID = itemUtil.atId(relatedFileEmbeddedObject.file);
      //const relationshipType = relatedFileEmbeddedObject.relationship_type; // Unused
      if (!relatedFileID) {
        // Most likely no view permissions
        // Cancel out -- remaining file (if any) will be picked up as part of while loop.
        return;
      }
      if (encounteredIDs.has(relatedFileID)) {
        // Has been encountered already, likely as part of bidirectional connection.
        return;
      }
      var relatedFileIndex = _.findIndex(ungroupedFiles, function (ungroupedFile) {
        return relatedFileID === itemUtil.atId(ungroupedFile);
      });
      if (relatedFileIndex === -1) {
        console.warn("Could not find related_file \"" + relatedFileID + "\" in list of ungrouped files.");
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
        _.forEach(anotherUngroupedFile.related_files || [], function (relatedFileEmbeddedObject) {
          var relatedFileID = itemUtil.atId(relatedFileEmbeddedObject.file);
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
export function extractSinglyGroupedItems(groups) {
  var _$partition = _.partition(groups, function (g) {
      return g.length > 1;
    }),
    _$partition2 = _slicedToArray(_$partition, 2),
    multiFileGroups = _$partition2[0],
    singleFileGroups = _$partition2[1];
  return [multiFileGroups, _.flatten(singleFileGroups, true)];
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
export var filterFilesWithEmbeddedMetricItem = memoize(function (files) {
  var checkAny = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var func = checkAny ? _.any : _.filter;
  return func(files, function (f) {
    return f.quality_metric && f.quality_metric.overall_quality_status;
  });
});
export var filterFilesWithQCSummary = memoize(function (files) {
  var checkAny = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var func = checkAny ? _.any : _.filter;
  return func(files, function (f) {
    var _f$quality_metric = f.quality_metric,
      _f$quality_metric2 = _f$quality_metric === void 0 ? {} : _f$quality_metric,
      _f$quality_metric2$qu = _f$quality_metric2.quality_metric_summary,
      qcs = _f$quality_metric2$qu === void 0 ? [] : _f$quality_metric2$qu;
    // Ensure all unique titles
    return qcs.length > 0 && qcs.length === Array.from(new Set(_.pluck(qcs, 'title'))).length;
  });
});

/**
 * Groups files with a `quality_metric_summary` property by the concatanated
 * unique titles of the summary items/columns.
 *
 * @param {File[]} filesWithMetrics - List of files which all contain a `quality_metric_summary`.
 * @returns {File[][]} Groups of files as 2d array.
 */
export var groupFilesByQCSummaryTitles = memoize(function (filesWithMetrics) {
  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "\t";
  var filesByTitles = _.pluck(Array.from(_.reduce(filesWithMetrics, function (m, file) {
    var titles = _.map(file.quality_metric.quality_metric_summary, function (qcMetric) {
      return qcMetric.title || qcMetric.display_title; // In case becomes an embedded obj at some point.
    });

    var titlesAsString = titles.join(sep); // Using Tab as is unlikely character to be used in a title column.
    if (!m.has(titlesAsString)) {
      m.set(titlesAsString, []);
    }
    m.get(titlesAsString).push(file);
    return m;
  }, new Map())), 1);
  return filesByTitles;
});
export function isFilenameAnImage(filename) {
  var suppressErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var fileNameLower, fileNameLowerEnds;
  if (typeof filename === 'string') {
    fileNameLower = filename && filename.length > 0 && filename.toLowerCase() || '';
    // Store ending(s) into object so we don't have to call `fileNameLower.slice` per each comparison.
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
  }
  // WordArrays are UTF8 by default
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
    offset += wordArrayRes[1];
    // callback for handling read chunk
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
export function getLargeMD5(file, cbProgress) {
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