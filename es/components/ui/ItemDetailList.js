'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemDetailList = exports.Detail = exports.SubItemListView = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _reactJsonTree = _interopRequireDefault(require("react-json-tree"));

var _object = require("./../util/object");

var _patchedConsole = require("./../util/patched-console");

var _schemaTransforms = require("./../util/schema-transforms");

var _PartialList = require("./PartialList");

var _typedefs = require("./../util/typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SubItemTitle = _react["default"].memo(function (_ref) {
  var isOpen = _ref.isOpen,
      title = _ref.title,
      onToggle = _ref.onToggle,
      countProperties = _ref.countProperties,
      content = _ref.content;
  var iconType = isOpen ? 'icon-minus' : 'icon-plus';
  var showTitle = title;
  var subtitle = null;

  if (typeof title !== 'string' || title.toLowerCase() === 'no title found') {
    showTitle = isOpen ? "Collapse" : "Expand";
  }

  if (content && _underscore["default"].any([content.title, content.display_title, content.name], function (p) {
    return typeof p === 'string';
  })) {
    subtitle = _react["default"].createElement("span", {
      className: "text-600"
    }, typeof content.title === 'string' ? content.title : typeof content.display_title === 'string' ? content.display_title : content.name);
  }

  return _react["default"].createElement("span", {
    className: "subitem-toggle"
  }, _react["default"].createElement("span", {
    className: "link",
    onClick: onToggle
  }, _react["default"].createElement("i", {
    style: {
      'color': 'black',
      'paddingRight': 10,
      'paddingLeft': 5
    },
    className: "icon fas " + iconType
  }), showTitle, " ", subtitle, " ", countProperties && !isOpen ? _react["default"].createElement("span", null, "(", countProperties, ")") : null));
});

SubItemTitle.propTypes = {
  'onToggle': _propTypes["default"].func,
  'isOpen': _propTypes["default"].bool,
  'title': _propTypes["default"].string,
  'content': _propTypes["default"].object
};

var SubItemListView = _react["default"].memo(function (props) {
  var isOpen = props.isOpen,
      item = props.content,
      schemas = props.schemas,
      popLink = props.popLink,
      excludedKeys = props.excludedKeys,
      columnDefinitions = props.columnDefinitions;
  if (!isOpen) return null;
  var passProps = {
    schemas: schemas,
    popLink: popLink,
    'context': item,
    'alwaysCollapsibleKeys': [],
    'excludedKeys': excludedKeys || _underscore["default"].without(Detail.defaultProps.excludedKeys, 'lab', 'award', 'description').concat(['schema_version', 'uuid']),
    'columnDefinitions': columnDefinitions || {},
    'showJSONButton': false,
    'hideButtons': true
  };
  return _react["default"].createElement("div", {
    className: "sub-panel data-display panel-body-with-header"
  }, _react["default"].createElement("div", {
    className: "key-value sub-descriptions"
  }, _react["default"].createElement(typeof item.display_title === 'string' ? ItemDetailList : Detail, passProps)));
});

exports.SubItemListView = SubItemListView;

var SubItemTable = function (_React$Component) {
  _inherits(SubItemTable, _React$Component);

  _createClass(SubItemTable, null, [{
    key: "shouldUseTable",
    value: function shouldUseTable(list, schemas) {
      if (!Array.isArray(list)) return false;
      if (list.length < 1) return false;
      list[0];
      var schemaForType;
      if (_underscore["default"].any(list, function (x) {
        return typeof x === 'undefined';
      })) return false;
      if (!_underscore["default"].all(list, function (x) {
        return _typeof(x) === 'object' && x;
      })) return false;
      if (_underscore["default"].any(list, function (x) {
        if (!Array.isArray(x['@type'])) {
          return true;
        } else {
          schemaForType = (0, _schemaTransforms.getSchemaForItemType)(x['@type'][0], schemas);
          if (!schemaForType || !schemaForType.columns) return true;
        }
      })) return false;

      var objectWithAllItemKeys = _underscore["default"].reduce(list, function (m, v) {
        var v2 = _underscore["default"].clone(v);

        var valKeys = _underscore["default"].keys(v2);

        for (var i = 0; i < valKeys.length; i++) {
          if (Array.isArray(v2[valKeys[i]])) {
            m[valKeys[i]] = (m[valKeys[i]] || []).concat(v2[valKeys[i]]);
            delete v2[valKeys[i]];
          } else if (v2[valKeys[i]] && _typeof(v2[valKeys[i]]) === 'object') {
            m[valKeys[i]] = _underscore["default"].extend(m[valKeys[i]] || {}, v2[valKeys[i]]);
            delete v2[valKeys[i]];
          }
        }

        return _underscore["default"].extend(m, v2);
      }, {});

      var rootKeys = _underscore["default"].keys(objectWithAllItemKeys);

      var embeddedKeys, i, j, k, embeddedListItem, embeddedListItemKeys;

      for (i = 0; i < rootKeys.length; i++) {
        if (Array.isArray(objectWithAllItemKeys[rootKeys[i]])) {
          var listObjects = _underscore["default"].filter(objectWithAllItemKeys[rootKeys[i]], function (v) {
            if (!v || v && _typeof(v) === 'object') return true;
            return false;
          });

          if (listObjects.length === 0) continue;

          var listNotItems = _underscore["default"].filter(listObjects, function (v) {
            return !(0, _object.isAnItem)(v);
          });

          if (listNotItems.length === 0) continue;

          for (k = 0; k < listNotItems.length; k++) {
            embeddedListItem = listNotItems[k];
            embeddedListItemKeys = _underscore["default"].keys(embeddedListItem);

            for (j = 0; j < embeddedListItemKeys.length; j++) {
              if (typeof embeddedListItem[embeddedListItemKeys[j]] === 'string' || typeof embeddedListItem[embeddedListItemKeys[j]] === 'number') {
                continue;
              }

              if ((0, _object.isAnItem)(embeddedListItem[embeddedListItemKeys[j]])) {
                continue;
              }

              if (Array.isArray(embeddedListItem[embeddedListItemKeys[j]]) && _underscore["default"].filter(embeddedListItem[embeddedListItemKeys[j]], function (v) {
                if (typeof v === 'string' || typeof v === 'number') return false;
                return true;
              }).length === 0) {
                continue;
              }

              return false;
            }
          }
        }

        if (!Array.isArray(objectWithAllItemKeys[rootKeys[i]]) && objectWithAllItemKeys[rootKeys[i]] && _typeof(objectWithAllItemKeys[rootKeys[i]]) === 'object') {
          if ((0, _object.isAnItem)(objectWithAllItemKeys[rootKeys[i]])) {
            continue;
          }

          embeddedKeys = _underscore["default"].keys(objectWithAllItemKeys[rootKeys[i]]);
          if (embeddedKeys.length > 5) return false;

          for (j = 0; j < embeddedKeys.length; j++) {
            if (typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]] === 'string' || typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]] === 'number') continue;

            if (Array.isArray(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]])) {
              if (objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]].length < 4 && _underscore["default"].filter(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]], function (v) {
                if (typeof v === 'string' || typeof v === 'number') {
                  return false;
                } else if (v && _typeof(v) === 'object' && _underscore["default"].keys(v).length < 2) {
                  return false;
                } else {
                  return true;
                }
              }).length === 0) {
                  continue;
                } else {
                return false;
              }
            }

            if (!Array.isArray(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]]) && objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]] && _typeof(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]]) === 'object') {
              if ((0, _object.isAnItem)(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]])) continue;
              return false;
            }
          }
        }
      }

      return true;
    }
  }, {
    key: "getColumnKeys",
    value: function getColumnKeys(items, columnDefinitions, schemas) {
      var objectWithAllItemKeys = _underscore["default"].reduce(items, function (m, v) {
        return _underscore["default"].extend(m, v);
      }, {});

      var rootKeys = _underscore["default"].keys(objectWithAllItemKeys);

      var columnKeys = [];

      if (typeof objectWithAllItemKeys.display_title === 'string' && Array.isArray(objectWithAllItemKeys['@type'])) {
        var columnKeysFromSchema = _underscore["default"].keys((0, _schemaTransforms.getSchemaForItemType)((0, _schemaTransforms.getItemType)(objectWithAllItemKeys), schemas).columns);

        columnKeys = rootKeys.filter(function (k) {
          if (k === 'display_title' || k === '@id' || k === 'accession') return true;
          if (columnKeysFromSchema.indexOf(k) > -1) return true;
          return false;
        }).map(function (k) {
          return {
            'key': k
          };
        });
      } else {
        for (var i = 0; i < rootKeys.length; i++) {
          if (typeof objectWithAllItemKeys[rootKeys[i]] === 'string' || typeof objectWithAllItemKeys[rootKeys[i]] === 'number' || Array.isArray(objectWithAllItemKeys[rootKeys[i]])) {
            if (Array.isArray(objectWithAllItemKeys[rootKeys[i]]) && objectWithAllItemKeys[rootKeys[i]][0] && _typeof(objectWithAllItemKeys[rootKeys[i]][0]) === 'object' && typeof objectWithAllItemKeys[rootKeys[i]][0].display_title !== 'string') {
              columnKeys.push({
                'key': rootKeys[i],
                'childKeys': _underscore["default"].keys(_underscore["default"].reduce(items, function (m1, v1) {
                  return _underscore["default"].extend(m1, _underscore["default"].reduce(v1[rootKeys[i]], function (m2, v2) {
                    return _underscore["default"].extend(m2, v2);
                  }, {}));
                }, {}))
              });
            } else {
              columnKeys.push({
                'key': rootKeys[i]
              });
            }
          } else if (objectWithAllItemKeys[rootKeys[i]] && _typeof(objectWithAllItemKeys[rootKeys[i]]) === 'object') {
            var itemAtID = typeof objectWithAllItemKeys[rootKeys[i]].display_title === 'string' && _object.itemUtil.atId(objectWithAllItemKeys[rootKeys[i]]);

            if (itemAtID) {
              columnKeys.push({
                'key': rootKeys[i]
              });
            } else {
              columnKeys = columnKeys.concat(_underscore["default"].keys(objectWithAllItemKeys[rootKeys[i]]).map(function (embeddedKey) {
                return {
                  'key': rootKeys[i] + '.' + embeddedKey
                };
              }));
            }
          }
        }
      }

      return columnKeys.filter(function (k) {
        if (columnDefinitions) {
          if (columnDefinitions[k.key]) {
            if (typeof columnDefinitions[k.key].hide === 'boolean' && columnDefinitions[k.key].hide) return false;

            if (typeof columnDefinitions[k.key].hide === 'function') {
              return !columnDefinitions[k.key].hide(objectWithAllItemKeys);
            }
          }
        }

        return true;
      }).sort(function (a, b) {
        if (['title', 'display_title', 'accession'].indexOf(a.key) > -1) return -5;
        if (['title', 'display_title', 'accession'].indexOf(b.key) > -1) return 5;
        if (['name', 'workflow_argument_name'].indexOf(a.key) > -1) return -4;
        if (['name', 'workflow_argument_name'].indexOf(b.key) > -1) return 4;
        if (['step', 'step_argument_name'].indexOf(a.key) > -1) return -3;
        if (['step', 'step_argument_name'].indexOf(b.key) > -1) return 3;
        if (['value'].indexOf(a.key) > -1) return -2;
        if (['value'].indexOf(b.key) > -1) return 2;
        return 0;
      }).sort(function (a, b) {
        if (Array.isArray(a.childKeys)) return 1;
        if (Array.isArray(b.childKeys)) return -1;
        return 0;
      });
    }
  }, {
    key: "jsonify",
    value: function jsonify(val, key) {
      var newVal;

      try {
        newVal = JSON.stringify(val);

        if (_underscore["default"].keys(val).length > 1) {
          _patchedConsole.patchedConsoleInstance.error("ERROR: Value for table cell is not a string, number, or JSX element.\nKey: " + key + '; Value: ' + newVal);
        }

        newVal = _react["default"].createElement("code", null, newVal.length <= 25 ? newVal : newVal.slice(0, 25) + '...');
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.error(e, val);

        newVal = _react["default"].createElement("em", null, '{obj}');
      }

      return newVal;
    }
  }]);

  function SubItemTable(props) {
    var _this;

    _classCallCheck(this, SubItemTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SubItemTable).call(this, props));
    _this.state = {
      'mounted': false
    };
    return _this;
  }

  _createClass(SubItemTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        'mounted': true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          items = _this$props.items,
          columnDefinitions = _this$props.columnDefinitions,
          parentKey = _this$props.parentKey,
          atType = _this$props.atType,
          schemas = _this$props.schemas,
          termTransformFxn = _this$props.termTransformFxn;
      var mounted = this.state.mounted;
      var columnKeys = SubItemTable.getColumnKeys(items, columnDefinitions, schemas);

      if (items[0] && items[0].display_title) {
        (0, _object.tipsFromSchema)(schemas, items[0]);
        columnKeys = columnKeys.filter(function (k) {
          if (k === '@id') return false;
          return true;
        });
      }

      var subListKeyWidths = this.subListKeyWidths;

      if (!subListKeyWidths) {
        subListKeyWidths = this.subListKeyWidths = !mounted || !this.subListKeyRefs ? null : function (refObj) {
          var keys = _underscore["default"].keys(refObj);

          var widthObj = {};

          for (var i = 0; i < keys.length; i++) {
            widthObj[keys[i]] = _underscore["default"].object(_underscore["default"].pairs(refObj[keys[i]]).map(function (refSet) {
              var colRows = Array.from(document.getElementsByClassName('child-column-' + keys[i] + '.' + refSet[0]));
              var maxWidth = Math.max(_underscore["default"].reduce(colRows, function (m, v) {
                return Math.max(m, v.offsetWidth);
              }, 0), refSet[1].offsetWidth + 10);
              return [refSet[0], maxWidth];
            }));
          }

          return widthObj;
        }(this.subListKeyRefs);
      }

      var rowData = _underscore["default"].map(items, function (item) {
        return _underscore["default"].map(columnKeys, function (colKeyContainer, colKeyIndex) {
          var colKey = colKeyContainer.key;
          var value = (0, _object.getNestedProperty)(item, colKey);
          if (!value) return {
            'value': '-',
            'key': colKey
          };

          if (typeof columnDefinitions[parentKey + '.' + colKey] !== 'undefined') {
            if (typeof columnDefinitions[parentKey + '.' + colKey].render === 'function') {
              return {
                'value': columnDefinitions[parentKey + '.' + colKey].render(value, item, colKeyIndex, items),
                'colKey': colKey
              };
            }
          }

          if (Array.isArray(value)) {
            if (_underscore["default"].all(value, function (v) {
              return typeof v === 'string';
            })) {
              return {
                'value': value.map(function (v) {
                  return termTransformFxn(colKey, v);
                }).join(', '),
                'key': colKey
              };
            }

            if (_underscore["default"].any(value, function (v) {
              return _typeof(v) === 'object' && v;
            }) && Array.isArray(colKeyContainer.childKeys)) {
              var allKeys = colKeyContainer.childKeys;
              return {
                'value': _underscore["default"].map(value, function (embeddedRow, i) {
                  return _react["default"].createElement("div", {
                    style: {
                      whiteSpace: "nowrap"
                    },
                    className: "text-left child-list-row",
                    key: colKey + '--row-' + i
                  }, _react["default"].createElement("div", {
                    className: "inline-block child-list-row-number"
                  }, i + 1, "."), allKeys.map(function (k) {
                    var renderedSubVal;

                    if (typeof columnDefinitions[parentKey + '.' + colKey + '.' + k] !== 'undefined') {
                      if (typeof columnDefinitions[parentKey + '.' + colKey + '.' + k].render === 'function') {
                        renderedSubVal = columnDefinitions[parentKey + '.' + colKey + '.' + k].render(embeddedRow[k], embeddedRow, colKeyIndex, value);
                      }
                    }

                    if (!renderedSubVal && embeddedRow[k] && _typeof(embeddedRow[k]) === 'object' && !(0, _object.isAnItem)(embeddedRow[k])) {
                      renderedSubVal = _react["default"].createElement("code", null, JSON.stringify(embeddedRow[k]));
                    }

                    if (!renderedSubVal) {
                      renderedSubVal = (0, _object.isAnItem)(embeddedRow[k]) ? _react["default"].createElement("a", {
                        href: _object.itemUtil.atId(embeddedRow[k])
                      }, _object.itemUtil.getTitleStringFromContext(embeddedRow[k])) : termTransformFxn(k, embeddedRow[k]);
                    }

                    return _react["default"].createElement("div", {
                      key: colKey + '.' + k + '--row-' + i,
                      className: "inline-block child-column-" + colKey + '.' + k,
                      style: {
                        width: !subListKeyWidths ? null : (subListKeyWidths[colKey] || {})[k] || null
                      }
                    }, renderedSubVal);
                  }));
                }),
                'className': 'child-list-row-container',
                'key': colKey
              };
            }
          }

          if ((0, _object.isAnItem)(value)) {
            return {
              'value': _react["default"].createElement("a", {
                href: _object.itemUtil.atId(value)
              }, value.display_title),
              'key': colKey
            };
          }

          if (typeof value === 'string' && value.length < 25) {
            return {
              'value': termTransformFxn(colKey, value),
              'className': 'no-word-break',
              'key': colKey
            };
          }

          return {
            'value': termTransformFxn(colKey, value),
            'key': colKey
          };
        });
      });

      var parentKeySchemaProperty = (0, _schemaTransforms.getSchemaProperty)(parentKey, schemas, {}, atType);

      var keyTitleDescriptionMap = _underscore["default"].extend({}, (0, _schemaTransforms.flattenSchemaPropertyToColumnDefinition)(_object.tipsFromSchema || parentKeySchemaProperty, 0, schemas), columnDefinitions);

      var subListKeyRefs = this.subListKeyRefs = {};
      return _react["default"].createElement("div", {
        className: "detail-embedded-table-container"
      }, _react["default"].createElement("table", {
        className: "detail-embedded-table"
      }, _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, [_react["default"].createElement("th", {
        key: "rowNumber",
        style: {
          minWidth: 36,
          maxWidth: 36,
          width: 36
        }
      }, "#")].concat(columnKeys.map(function (colKeyContainer) {
        var colKey = colKeyContainer.key;
        var title = keyTitleDescriptionMap[parentKey + '.' + colKey] && keyTitleDescriptionMap[parentKey + '.' + colKey].title || keyTitleDescriptionMap[colKey] && keyTitleDescriptionMap[colKey].title || colKey;
        var tooltip = keyTitleDescriptionMap[parentKey + '.' + colKey] && keyTitleDescriptionMap[parentKey + '.' + colKey].description || keyTitleDescriptionMap[colKey] && keyTitleDescriptionMap[colKey].description || null;
        var hasChildren = Array.isArray(colKeyContainer.childKeys) && colKeyContainer.childKeys.length > 0;
        return _react["default"].createElement("th", {
          key: "header-for-" + colKey,
          className: hasChildren ? 'has-children' : null
        }, _react["default"].createElement(_object.TooltipInfoIconContainer, {
          title: title,
          tooltip: tooltip
        }), hasChildren ? function () {
          var subKeyTitleDescriptionMap = ((keyTitleDescriptionMap[parentKey + '.' + colKey] || keyTitleDescriptionMap[colKey] || {}).items || {}).properties || {};
          subListKeyRefs[colKey] = {};
          return _react["default"].createElement("div", {
            style: {
              whiteSpace: "nowrap"
            },
            className: "sub-list-keys-header"
          }, [_react["default"].createElement("div", {
            key: "sub-header-rowNumber",
            className: "inline-block child-list-row-number"
          }, "\xA0")].concat(colKeyContainer.childKeys.map(function (ck) {
            return _react["default"].createElement("div", {
              key: "sub-header-for-" + colKey + '.' + ck,
              className: "inline-block",
              "data-key": colKey + '.' + ck,
              ref: function ref(r) {
                if (r) subListKeyRefs[colKey][ck] = r;
              },
              style: {
                'width': !subListKeyWidths ? null : (subListKeyWidths[colKey] || {})[ck] || null
              }
            }, _react["default"].createElement(_object.TooltipInfoIconContainer, {
              title: (keyTitleDescriptionMap[parentKey + '.' + colKey + '.' + ck] || subKeyTitleDescriptionMap[ck] || {}).title || ck,
              tooltip: (keyTitleDescriptionMap[parentKey + '.' + colKey + '.' + ck] || subKeyTitleDescriptionMap[ck] || {}).description || null
            }));
          })));
        }() : null);
      })))), _react["default"].createElement("tbody", null, _underscore["default"].map(rowData, function (row, i) {
        return _react["default"].createElement("tr", {
          key: "row-" + i
        }, [_react["default"].createElement("td", {
          key: "rowNumber"
        }, i + 1, ".")].concat(row.map(function (colVal, j) {
          var val = colVal.value;

          if (typeof val === 'boolean') {
            val = _react["default"].createElement("code", null, val ? 'True' : 'False');
          }

          if (colVal.key === '@id' && val.slice(0, 1) === '/') {
            val = _react["default"].createElement("a", {
              href: val
            }, val);
          }

          if (typeof val === 'string' && val.length > 50) {
            val = val.slice(0, 50) + '...';
          }

          if (val && _typeof(val) === 'object' && !_react["default"].isValidElement(val) && !Array.isArray(val)) {
            val = SubItemTable.jsonify(val, columnKeys[j].key);
          }

          if (Array.isArray(val) && val.length > 0 && !_underscore["default"].all(val, _react["default"].isValidElement)) {
            val = _underscore["default"].map(val, function (v, i) {
              return SubItemTable.jsonify(v, columnKeys[j].key + ':' + i);
            });
          }

          return _react["default"].createElement("td", {
            key: "column-for-" + columnKeys[j].key,
            className: colVal.className || null
          }, val);
        })));
      }))));
    }
  }]);

  return SubItemTable;
}(_react["default"].Component);

var DetailRow = function (_React$PureComponent) {
  _inherits(DetailRow, _React$PureComponent);

  function DetailRow(props) {
    var _this2;

    _classCallCheck(this, DetailRow);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DetailRow).call(this, props));
    _this2.handleToggle = _this2.handleToggle.bind(_assertThisInitialized(_this2));
    _this2.state = {
      'isOpen': false
    };
    return _this2;
  }

  _createClass(DetailRow, [{
    key: "handleToggle",
    value: function handleToggle(e) {
      e.preventDefault();
      this.setState(function (_ref2) {
        var isOpen = _ref2.isOpen;
        return {
          'isOpen': !isOpen
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          label = _this$props2.label,
          labelNumber = _this$props2.labelNumber,
          item = _this$props2.item,
          popLink = _this$props2.popLink,
          itemType = _this$props2.itemType,
          columnDefinitions = _this$props2.columnDefinitions,
          className = _this$props2.className,
          schemas = _this$props2.schemas,
          termTransformFxn = _this$props2.termTransformFxn;
      var isOpen = this.state.isOpen;
      var value = Detail.formValue(item, popLink, this.props['data-key'], itemType, columnDefinitions, 0, schemas, termTransformFxn);
      var labelToShow = label;

      if (labelNumber) {
        labelToShow = _react["default"].createElement("span", null, _react["default"].createElement("span", {
          className: "label-number right inline-block" + (isOpen ? ' active' : '')
        }, _react["default"].createElement("span", {
          className: "number-icon text-200"
        }, "#"), " ", labelNumber), label);
      }

      if (value.type === SubItemTitle) {
        value = _react["default"].cloneElement(value, {
          'onToggle': this.handleToggle,
          'isOpen': isOpen
        });
        return _react["default"].createElement("div", null, _react["default"].createElement(_PartialList.PartialList.Row, {
          label: labelToShow,
          className: (className || '') + (isOpen ? ' open' : '')
        }, value), _react["default"].createElement(SubItemListView, {
          popLink: popLink,
          content: item,
          schemas: schemas,
          isOpen: isOpen,
          columnDefinitions: value.props.columnDefinitions || columnDefinitions
        }));
      }

      if (value.type === "ol" && value.props.children[0] && value.props.children[0].type === "li" && value.props.children[0].props.children && value.props.children[0].props.children.type === SubItemTitle) {
        return _react["default"].createElement("div", {
          className: "array-group",
          "data-length": item.length
        }, _react["default"].Children.map(value.props.children, function (c, i) {
          return _react["default"].createElement(DetailRow, _extends({}, _this3.props, {
            label: i === 0 ? labelToShow : _react["default"].createElement("span", {
              className: "dim-duplicate"
            }, labelToShow),
            labelNumber: i + 1,
            item: item[i],
            className: "array-group-row item-index-" + i + (i === item.length - 1 ? ' last-item' : '') + (i === 0 ? ' first-item' : '')
          }));
        }));
      }

      return _react["default"].createElement(_PartialList.PartialList.Row, {
        label: labelToShow,
        className: (className || '') + (isOpen ? ' open' : '')
      }, value);
    }
  }]);

  return DetailRow;
}(_react["default"].PureComponent);

var Detail = function (_React$PureComponent2) {
  _inherits(Detail, _React$PureComponent2);

  _createClass(Detail, null, [{
    key: "formKey",
    value: function formKey(tips, key) {
      var includeTooltip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var tooltip = null,
          title = null;

      if (tips[key]) {
        var info = tips[key];
        if (info.title) title = info.title;
        if (!includeTooltip) return title;
        if (info.description) tooltip = info.description;
      }

      return _react["default"].createElement(_object.TooltipInfoIconContainer, {
        title: title || key,
        tooltip: tooltip
      });
    }
  }, {
    key: "formValue",
    value: function formValue(item) {
      var popLink = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var keyPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var atType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'ExperimentSet';
      var columnDefinitions = arguments.length > 4 ? arguments[4] : undefined;
      var depth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var schemas = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
      var termTransformFxn = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : function (field, term) {
        return term;
      };

      if (item === null) {
        return _react["default"].createElement("span", null, "No Value");
      } else if (Array.isArray(item)) {
        if (SubItemTable.shouldUseTable(item, schemas)) {
          return _react["default"].createElement(SubItemTable, _extends({
            popLink: popLink,
            columnDefinitions: columnDefinitions,
            schemas: schemas,
            atType: atType,
            termTransformFxn: termTransformFxn
          }, {
            items: item,
            parentKey: keyPrefix
          }));
        }

        return _react["default"].createElement("ol", null, item.length === 0 ? _react["default"].createElement("li", null, _react["default"].createElement("em", null, "None")) : item.map(function (it, i) {
          return _react["default"].createElement("li", {
            key: i
          }, Detail.formValue(it, popLink, keyPrefix, atType, columnDefinitions, depth + 1, schemas));
        }));
      } else if (_typeof(item) === 'object' && item !== null) {
        var linkElement = _object.itemUtil.generateLink(item, true, 'display_title', {
          'target': popLink ? '_blank' : null
        }, true);

        if (linkElement) {
          return linkElement;
        } else {
          var releventProperties = _underscore["default"].object(_underscore["default"].map(_underscore["default"].filter(_underscore["default"].pairs(columnDefinitions), function (c) {
            return c[0].indexOf(keyPrefix + '.') === 0;
          }), function (c) {
            c[0] = c[0].replace(keyPrefix + '.', '');
            return c;
          }));

          return _react["default"].createElement(SubItemTitle, {
            schemas: schemas,
            content: item,
            key: keyPrefix,
            countProperties: _underscore["default"].keys(item).length,
            popLink: popLink,
            columnDefinitions: releventProperties
          });
        }
      } else if (typeof item === 'string') {
        if (keyPrefix === '@id') {
          return _react["default"].createElement("a", {
            key: item,
            href: item,
            target: popLink ? "_blank" : null
          }, item);
        }

        if (item.charAt(0) === '/' && item.indexOf('@@download') > -1) {
          var split_item = item.split('/');
          var attach_title = decodeURIComponent(split_item[split_item.length - 1]);
          return _react["default"].createElement("a", {
            key: item,
            href: item,
            target: "_blank",
            download: true,
            rel: "noreferrer noopener"
          }, attach_title || item);
        } else if (item.charAt(0) === '/') {
          if (popLink) return _react["default"].createElement("a", {
            key: item,
            href: item,
            target: "_blank",
            rel: "noreferrer noopener"
          }, item);else return _react["default"].createElement("a", {
            key: item,
            href: item
          }, item);
        } else if (item.slice(0, 4) === 'http') {
          var schemaProperty = (0, _schemaTransforms.getSchemaProperty)(keyPrefix, schemas || {}, atType);
          if (schemaProperty && typeof schemaProperty.format === 'string' && ['uri', 'url'].indexOf(schemaProperty.format.toLowerCase()) > -1) return _react["default"].createElement("a", {
            key: item,
            href: item,
            target: "_blank",
            rel: "noreferrer noopener"
          }, item);
        } else {
          return _react["default"].createElement("span", null, termTransformFxn(keyPrefix, item));
        }
      } else if (typeof item === 'number') {
        return _react["default"].createElement("span", null, termTransformFxn(keyPrefix, item));
      } else if (typeof item === 'boolean') {
        return _react["default"].createElement("span", {
          style: {
            'textTransform': 'capitalize'
          }
        }, item + '');
      }

      return _react["default"].createElement("span", null, item);
    }
  }]);

  function Detail(props) {
    var _this4;

    _classCallCheck(this, Detail);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Detail).call(this, props));
    _this4.renderDetailRow = _this4.renderDetailRow.bind(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(Detail, [{
    key: "renderDetailRow",
    value: function renderDetailRow(key) {
      var _this$props3 = this.props,
          context = _this$props3.context,
          popLink = _this$props3.popLink,
          schemas = _this$props3.schemas,
          columnDefinitionMap = _this$props3.columnDefinitionMap,
          termTransformFxn = _this$props3.termTransformFxn;
      var colDefs = Detail.columnDefinitions(context, schemas, columnDefinitionMap);
      return _react["default"].createElement(DetailRow, {
        key: key,
        label: Detail.formKey(colDefs, key),
        item: context[key],
        popLink: popLink,
        "data-key": key,
        itemType: context['@type'] && context['@type'][0],
        columnDefinitions: colDefs,
        termTransformFxn: termTransformFxn,
        schemas: schemas
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          context = _this$props4.context,
          excludedKeys = _this$props4.excludedKeys,
          stickyKeys = _this$props4.stickyKeys,
          alwaysCollapsibleKeys = _this$props4.alwaysCollapsibleKeys,
          open = _this$props4.open;

      var _Detail$generatedKeys = Detail.generatedKeysLists(context, excludedKeys, stickyKeys, alwaysCollapsibleKeys),
          persistentKeys = _Detail$generatedKeys.persistentKeys,
          collapsibleKeys = _Detail$generatedKeys.collapsibleKeys;

      return _react["default"].createElement("div", {
        className: "overflow-hidden"
      }, _react["default"].createElement(_PartialList.PartialList, {
        persistent: _underscore["default"].map(persistentKeys, this.renderDetailRow),
        collapsible: _underscore["default"].map(collapsibleKeys, this.renderDetailRow),
        open: open
      }));
    }
  }]);

  return Detail;
}(_react["default"].PureComponent);

exports.Detail = Detail;

_defineProperty(Detail, "SubItemTitle", SubItemTitle);

_defineProperty(Detail, "propTypes", {
  'context': _propTypes["default"].object.isRequired,
  'columnDefinitions': _propTypes["default"].object
});

_defineProperty(Detail, "defaultProps", {
  'excludedKeys': ['@context', 'actions', 'principals_allowed', 'lab', 'award', 'description', '@id', 'display_title'],
  'stickyKeys': ['display_title', 'title', 'experimentset_type', 'date_released', 'experiment_type', 'experiment_summary', 'experiment_sets', 'files', 'filesets', 'protocol', 'biosample', 'digestion_enzyme', 'digestion_temperature', 'digestion_time', 'ligation_temperature', 'ligation_time', 'ligation_volume', 'tagging_method', 'experiment_category', 'assay_classification', 'assay_subclassification', 'assay_subclass_short', 'sop', 'reference_pubs', 'raw_file_types', 'controlled_term', 'other_protocols', 'other_tags', 'biosource', 'biosource_summary', 'biosample_protocols', 'modifications_summary', 'treatments_summary', 'filename', 'file_type', 'file_format', 'href', 'notes', 'flowcell_details', 'awards', 'address1', 'address2', 'city', 'country', 'institute_name', 'state', 'end_date', 'project', 'uri', 'ID', 'attachment', 'aliases'],
  'alwaysCollapsibleKeys': ['@type', 'accession', 'schema_version', 'uuid', 'replicate_exps', 'dbxrefs', 'status', 'external_references', 'date_created'],
  'open': null,
  'columnDefinitionMap': {
    '@id': {
      'title': 'Link',
      'description': 'Link to Item'
    },
    'subscriptions.url': {
      'render': function render(value) {
        return _react["default"].createElement("a", {
          href: '/search/' + value
        }, "View Results");
      },
      'title': "Link",
      'description': "Link to results matching subscription query."
    },
    'subscriptions.title': {
      'title': "Subscription",
      'description': "Title of Subscription"
    },
    'experiment_sets.experimentset_type': {
      'title': "Type",
      'description': "Experiment Set Type"
    },
    'display_title': {
      'title': "Title",
      'description': "Title of Item",
      'hide': function hide(valueProbe) {
        if (!valueProbe || !valueProbe.display_title) return true;
        if (valueProbe.accession && valueProbe.accession === valueProbe.display_title) return true;
        return false;
      }
    },
    'email': {
      'title': "E-Mail",
      'render': function render(value) {
        if (typeof value === 'string' && value.indexOf('@') > -1) {
          return _react["default"].createElement("a", {
            href: 'mailto:' + value
          }, value);
        }

        return value;
      }
    }
  },
  'termTransformFxn': function termTransformFxn(field, term) {
    return term;
  }
});

_defineProperty(Detail, "columnDefinitions", (0, _memoizeOne["default"])(function (context, schemas, columnDefinitionMap) {
  var colDefsFromSchema = (0, _schemaTransforms.flattenSchemaPropertyToColumnDefinition)(schemas ? (0, _object.tipsFromSchema)(schemas, context) : {}, 0, schemas);
  return _underscore["default"].extend(colDefsFromSchema, columnDefinitionMap || {});
}));

_defineProperty(Detail, "generatedKeysLists", (0, _memoizeOne["default"])(function (context, excludedKeys, stickyKeys, alwaysCollapsibleKeys) {
  var sortKeys = _underscore["default"].difference(_underscore["default"].keys(context).sort(), excludedKeys.sort());

  var stickyKeysObj = _underscore["default"].object(_underscore["default"].intersection(sortKeys, stickyKeys.slice(0).sort()).map(function (key) {
    return [key, true];
  }));

  var orderedStickyKeys = [];
  stickyKeys.forEach(function (key) {
    if (stickyKeysObj[key] === true) orderedStickyKeys.push(key);
  });

  var extraKeys = _underscore["default"].difference(sortKeys, stickyKeys.slice(0).sort());

  var collapsibleKeys = _underscore["default"].intersection(extraKeys.sort(), alwaysCollapsibleKeys.slice(0).sort());

  extraKeys = _underscore["default"].difference(extraKeys, collapsibleKeys);
  return {
    'persistentKeys': orderedStickyKeys.concat(extraKeys),
    'collapsibleKeys': collapsibleKeys
  };
}));

var ToggleJSONButton = _react["default"].memo(function (_ref3) {
  var onClick = _ref3.onClick,
      showingJSON = _ref3.showingJSON,
      className = _ref3.className;
  return _react["default"].createElement("button", {
    type: "button",
    className: "btn btn-block btn-outline-secondary",
    onClick: onClick
  }, showingJSON ? _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("i", {
    className: "icon fas icon-fw icon-list"
  }), " View as List") : _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("i", {
    className: "icon fas icon-fw icon-code"
  }), " View as JSON"));
});

var SeeMoreRowsButton = _react["default"].memo(function (_ref4) {
  var onClick = _ref4.onClick,
      collapsed = _ref4.collapsed,
      className = _ref4.className;
  return _react["default"].createElement("button", {
    type: "button",
    className: "btn btn-block btn-outline-secondary",
    onClick: onClick
  }, collapsed ? "See advanced information" : "Hide");
});

var ItemDetailList = function (_React$PureComponent3) {
  _inherits(ItemDetailList, _React$PureComponent3);

  _createClass(ItemDetailList, null, [{
    key: "getTabObject",
    value: function getTabObject(props) {
      return {
        tab: _react["default"].createElement("span", null, _react["default"].createElement("i", {
          className: "icon fas icon-list icon-fw"
        }), " Details"),
        key: 'details',
        content: _react["default"].createElement("div", null, _react["default"].createElement("h3", {
          className: "tab-section-title"
        }, _react["default"].createElement("span", null, "Details")), _react["default"].createElement("hr", {
          className: "tab-section-title-horiz-divider mb-05"
        }), _react["default"].createElement(ItemDetailList, props))
      };
    }
  }]);

  function ItemDetailList(props) {
    var _this5;

    _classCallCheck(this, ItemDetailList);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(ItemDetailList).call(this, props));
    _this5.handleToggleJSON = _this5.handleToggleJSON.bind(_assertThisInitialized(_this5));
    _this5.handleToggleCollapsed = _this5.handleToggleCollapsed.bind(_assertThisInitialized(_this5));
    _this5.state = {
      'collapsed': true,
      'showingJSON': false
    };
    return _this5;
  }

  _createClass(ItemDetailList, [{
    key: "handleToggleJSON",
    value: function handleToggleJSON() {
      this.setState(function (_ref5) {
        var showingJSON = _ref5.showingJSON;
        return {
          "showingJSON": !showingJSON
        };
      });
    }
  }, {
    key: "handleToggleCollapsed",
    value: function handleToggleCollapsed() {
      this.setState(function (_ref6) {
        var collapsed = _ref6.collapsed;
        return {
          "collapsed": !collapsed
        };
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      _reactTooltip["default"].rebuild();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      if (this.state.showingJSON === false && pastState.showingJSON === true) {
        _reactTooltip["default"].rebuild();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          keyTitleDescriptionMap = _this$props5.keyTitleDescriptionMap,
          columnDefinitionMap = _this$props5.columnDefinitionMap,
          minHeight = _this$props5.minHeight,
          context = _this$props5.context,
          propCollapsed = _this$props5.collapsed,
          hideButtons = _this$props5.hideButtons,
          showJSONButton = _this$props5.showJSONButton;
      var _this$state = this.state,
          showingJSON = _this$state.showingJSON,
          collapsed = _this$state.collapsed;
      var body;

      if (showingJSON) {
        body = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("div", {
          className: "json-tree-wrapper"
        }, _react["default"].createElement(_reactJsonTree["default"], {
          data: context
        })), _react["default"].createElement("br", null), _react["default"].createElement("div", {
          className: "row"
        }, _react["default"].createElement("div", {
          className: "col-12 col-sm-6"
        }, _react["default"].createElement(ToggleJSONButton, {
          onClick: this.handleToggleJSON,
          showingJSON: showingJSON
        }))));
      } else {
        var colDefs = _underscore["default"].extend({}, keyTitleDescriptionMap || {}, columnDefinitionMap || {});

        var isCollapsed;
        if (typeof propCollapsed === 'boolean') isCollapsed = propCollapsed;else isCollapsed = collapsed;
        var buttonsRow;

        if (hideButtons) {
          buttonsRow = null;
        } else if (!showJSONButton) {
          buttonsRow = _react["default"].createElement("div", {
            className: "row"
          }, _react["default"].createElement("div", {
            className: "col-12"
          }, _react["default"].createElement(SeeMoreRowsButton, {
            onClick: this.handleToggleCollapsed,
            collapsed: collapsed
          })));
        } else {
          buttonsRow = _react["default"].createElement("div", {
            className: "row"
          }, _react["default"].createElement("div", {
            className: "col-6"
          }, _react["default"].createElement(SeeMoreRowsButton, {
            onClick: this.handleToggleCollapsed,
            collapsed: collapsed
          })), _react["default"].createElement("div", {
            className: "col-6"
          }, _react["default"].createElement(ToggleJSONButton, {
            onClick: this.handleToggleJSON,
            showingJSON: showingJSON
          })));
        }

        body = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(Detail, _extends({}, this.props, {
          open: !isCollapsed,
          columnDefinitions: colDefs
        })), buttonsRow);
      }

      return _react["default"].createElement("div", {
        className: "item-page-detail",
        style: typeof minHeight === 'number' ? {
          minHeight: minHeight
        } : null
      }, body);
    }
  }]);

  return ItemDetailList;
}(_react["default"].PureComponent);

exports.ItemDetailList = ItemDetailList;

_defineProperty(ItemDetailList, "Detail", Detail);

_defineProperty(ItemDetailList, "defaultProps", {
  'showJSONButton': true,
  'hideButtons': false,
  'columnDefinitionMap': Detail.defaultProps.columnDefinitionMap
});