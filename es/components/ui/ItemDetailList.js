import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { JSONTree } from 'react-json-tree';
import { isAnItem, itemUtil, isAnAttachment, tipsFromSchema, TooltipInfoIconContainer, getNestedProperty } from './../util/object';
import { isPrimitive } from './../util/misc';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { getSchemaForItemType, getItemType, flattenSchemaPropertyToColumnDefinition, getSchemaProperty } from './../util/schema-transforms';
import { PartialList } from './PartialList';

// eslint-disable-next-line no-unused-vars
import { Item } from './../util/typedefs';

/**
 * This file/component is kind of a mess.
 *
 * @module
 * @todo
 * For any major-ish future work, we should replace this with an
 * off-the-shelf NPM JSON-LD renderer (if any) and just wrap it with
 * our own simple 'prop-feeder' component.
 */

/** Contains and toggles visibility/mounting of a Subview. Renders title for the Subview. */
var SubItemTitle = /*#__PURE__*/React.memo(function (_ref) {
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
  if (content && _.any([content.title, content.display_title, content.name], function (p) {
    return typeof p === 'string';
  })) {
    subtitle = /*#__PURE__*/React.createElement("span", {
      className: "text-600"
    }, typeof content.title === 'string' ? content.title : typeof content.display_title === 'string' ? content.display_title : content.name);
  }
  return /*#__PURE__*/React.createElement("span", {
    className: "subitem-toggle"
  }, /*#__PURE__*/React.createElement("span", {
    className: "link",
    onClick: onToggle
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      'color': 'black',
      'paddingRight': 10,
      'paddingLeft': 5
    },
    className: "icon fas " + iconType
  }), showTitle, " ", subtitle, " ", countProperties && !isOpen ? /*#__PURE__*/React.createElement("span", null, "(", countProperties, ")") : null));
});
SubItemTitle.propTypes = {
  'onToggle': PropTypes.func,
  'isOpen': PropTypes.bool,
  'title': PropTypes.string,
  'content': PropTypes.object
};
export var SubItemListView = /*#__PURE__*/React.memo(function (props) {
  var isOpen = props.isOpen,
    item = props.content,
    schemas = props.schemas,
    popLink = props.popLink,
    excludedKeys = props.excludedKeys,
    columnDefinitions = props.columnDefinitions,
    termTransformFxn = props.termTransformFxn;
  if (!isOpen) return null;
  var passProps = {
    schemas: schemas,
    popLink: popLink,
    termTransformFxn: termTransformFxn,
    'context': item,
    'alwaysCollapsibleKeys': [],
    'excludedKeys': excludedKeys || _.without(Detail.defaultProps.excludedKeys,
    // Remove
    'lab', 'award', 'description').concat([
    // Add
    'schema_version', 'uuid']),
    'columnDefinitions': columnDefinitions || {},
    'showJSONButton': false,
    'hideButtons': true
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "sub-panel data-display panel-body-with-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "key-value sub-descriptions"
  }, /*#__PURE__*/React.createElement(typeof item.display_title === 'string' ? ItemDetailList : Detail, passProps)));
});

/**
 * Messiness.
 * @todo refactor or get rid of.
 */
var SubItemTable = /*#__PURE__*/function (_React$Component) {
  _inherits(SubItemTable, _React$Component);
  var _super = _createSuper(SubItemTable);
  function SubItemTable(props) {
    var _this;
    _classCallCheck(this, SubItemTable);
    _this = _super.call(this, props);
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

      // If is an Item, grab properties for it.

      if (items[0] && items[0].display_title) {
        tipsFromSchema(schemas, items[0]);
        columnKeys = columnKeys.filter(function (k) {
          if (k === '@id') return false;
          return true;
        });
      }

      // TODO: Get rid of this.
      var subListKeyWidths = this.subListKeyWidths;
      if (!subListKeyWidths) {
        subListKeyWidths = this.subListKeyWidths = !mounted || !this.subListKeyRefs ? null : function (refObj) {
          var keys = _.keys(refObj);
          var widthObj = {};
          for (var i = 0; i < keys.length; i++) {
            widthObj[keys[i]] = _.object(_.pairs(refObj[keys[i]]).map(function (refSet) {
              //var colKey = refSet[1].getAttribute('data-key');
              var colRows = Array.from(document.getElementsByClassName('child-column-' + keys[i] + '.' + refSet[0]));
              var maxWidth = Math.max(_.reduce(colRows, function (m, v) {
                return Math.max(m, v.offsetWidth);
              }, 0), refSet[1].offsetWidth + 10);
              return [refSet[0], maxWidth /*refSet[1].offsetWidth*/];
            }));
          }

          return widthObj;
        }(this.subListKeyRefs);
      }
      var rowData = _.map(items, function (item) {
        return _.map(columnKeys, function (colKeyContainer, colKeyIndex) {
          var colKey = colKeyContainer.key;
          var value = getNestedProperty(item, colKey);
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
            if (_.all(value, function (v) {
              return typeof v === 'string';
            })) {
              return {
                'value': value.map(function (v) {
                  return termTransformFxn(colKey, v);
                }).join(', '),
                'key': colKey
              };
            }
            if (_.any(value, function (v) {
              return _typeof(v) === 'object' && v;
            }) && Array.isArray(colKeyContainer.childKeys)) {
              // Embedded list of objects.
              var allKeys = colKeyContainer.childKeys; //_.keys(  _.reduce(value, function(m,v){ return _.extend(m,v); }, {})   );
              return {
                'value': _.map(value, function (embeddedRow, i) {
                  return /*#__PURE__*/React.createElement("div", {
                    style: {
                      whiteSpace: "nowrap"
                    },
                    className: "text-left child-list-row",
                    key: colKey + '--row-' + i
                  }, /*#__PURE__*/React.createElement("div", {
                    className: "d-inline-block child-list-row-number"
                  }, i + 1, "."), allKeys.map(function (k) {
                    var renderedSubVal; // = Schemas.Term.toName(k, embeddedRow[k]);
                    if (typeof columnDefinitions[parentKey + '.' + colKey + '.' + k] !== 'undefined') {
                      if (typeof columnDefinitions[parentKey + '.' + colKey + '.' + k].render === 'function') {
                        renderedSubVal = columnDefinitions[parentKey + '.' + colKey + '.' + k].render(embeddedRow[k], embeddedRow, colKeyIndex, value);
                      }
                    }
                    if (!renderedSubVal && embeddedRow[k] && _typeof(embeddedRow[k]) === 'object' && !isAnItem(embeddedRow[k])) {
                      renderedSubVal = /*#__PURE__*/React.createElement("code", null, JSON.stringify(embeddedRow[k]));
                    }
                    if (!renderedSubVal) {
                      renderedSubVal = isAnItem(embeddedRow[k]) ? /*#__PURE__*/React.createElement("a", {
                        href: itemUtil.atId(embeddedRow[k])
                      }, itemUtil.getTitleStringFromContext(embeddedRow[k])) : termTransformFxn(k, embeddedRow[k]);
                    }
                    return /*#__PURE__*/React.createElement("div", {
                      key: colKey + '.' + k + '--row-' + i,
                      className: "d-inline-block child-column-" + colKey + '.' + k,
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
          if (isAnItem(value)) {
            return {
              'value': /*#__PURE__*/React.createElement("a", {
                href: itemUtil.atId(value)
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

      // Get property of parent key which has items.properties : { ..these_keys.. }
      var parentKeySchemaProperty = getSchemaProperty(parentKey, schemas, {}, atType);
      var keyTitleDescriptionMap = _.extend({},
      // We have list of sub-embedded Items or sub-embedded objects which have separate 'get properties from schema' funcs (== tipsFromSchema || parentKeySchemaProperty).
      flattenSchemaPropertyToColumnDefinition(tipsFromSchema || parentKeySchemaProperty, 0, schemas), columnDefinitions);
      var subListKeyRefs = this.subListKeyRefs = {};
      return /*#__PURE__*/React.createElement("div", {
        className: "detail-embedded-table-container"
      }, /*#__PURE__*/React.createElement("table", {
        className: "detail-embedded-table"
      }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, [/*#__PURE__*/React.createElement("th", {
        key: "rowNumber",
        style: {
          minWidth: 36,
          maxWidth: 36,
          width: 36
        }
      }, "#")].concat(columnKeys.map(function (colKeyContainer) {
        //var tips = tipsFromSchema(Schemas.get(), context) || {};
        var colKey = colKeyContainer.key;
        var title = keyTitleDescriptionMap[parentKey + '.' + colKey] && keyTitleDescriptionMap[parentKey + '.' + colKey].title || keyTitleDescriptionMap[colKey] && keyTitleDescriptionMap[colKey].title || colKey;
        var tooltip = keyTitleDescriptionMap[parentKey + '.' + colKey] && keyTitleDescriptionMap[parentKey + '.' + colKey].description || keyTitleDescriptionMap[colKey] && keyTitleDescriptionMap[colKey].description || null;
        var hasChildren = Array.isArray(colKeyContainer.childKeys) && colKeyContainer.childKeys.length > 0;
        return /*#__PURE__*/React.createElement("th", {
          key: "header-for-" + colKey,
          className: hasChildren ? 'has-children' : null
        }, /*#__PURE__*/React.createElement(TooltipInfoIconContainer, {
          title: title,
          tooltip: tooltip
        }), hasChildren ? function () {
          //var subKeyTitleDescriptionMap = (((this.props.keyTitleDescriptionMap || {})[this.props.parentKey] || {}).items || {}).properties || {};
          //var subKeyTitleDescriptionMap = keyTitleDescriptionMap[this.props.parentKey + '.' + colKey] || keyTitleDescriptionMap[colKey] || {};
          var subKeyTitleDescriptionMap = ((keyTitleDescriptionMap[parentKey + '.' + colKey] || keyTitleDescriptionMap[colKey] || {}).items || {}).properties || {};
          subListKeyRefs[colKey] = {};
          return /*#__PURE__*/React.createElement("div", {
            style: {
              whiteSpace: "nowrap"
            },
            className: "sub-list-keys-header"
          }, [/*#__PURE__*/React.createElement("div", {
            key: "sub-header-rowNumber",
            className: "d-inline-block child-list-row-number"
          }, "\xA0")].concat(colKeyContainer.childKeys.map(function (ck) {
            return /*#__PURE__*/React.createElement("div", {
              key: "sub-header-for-" + colKey + '.' + ck,
              className: "d-inline-block",
              "data-key": colKey + '.' + ck,
              ref: function ref(r) {
                if (r) subListKeyRefs[colKey][ck] = r;
              },
              style: {
                'width': !subListKeyWidths ? null : (subListKeyWidths[colKey] || {})[ck] || null
              }
            }, /*#__PURE__*/React.createElement(TooltipInfoIconContainer, {
              title: (keyTitleDescriptionMap[parentKey + '.' + colKey + '.' + ck] || subKeyTitleDescriptionMap[ck] || {}).title || ck,
              tooltip: (keyTitleDescriptionMap[parentKey + '.' + colKey + '.' + ck] || subKeyTitleDescriptionMap[ck] || {}).description || null
            }));
          })));
        }() : null);
      })))), /*#__PURE__*/React.createElement("tbody", null, _.map(rowData, function (row, i) {
        var rowAtId = _.find(row, function (elem) {
          return elem.key === '@id';
        });
        var rowAtIdValue = rowAtId ? rowAtId.value : null;
        return /*#__PURE__*/React.createElement("tr", {
          key: "row-" + i
        }, [/*#__PURE__*/React.createElement("td", {
          key: "rowNumber"
        }, i + 1, ".")].concat(row.map(function (colVal, j) {
          var val = colVal.value,
            className = colVal.className;
          if (typeof val === 'boolean') {
            val = /*#__PURE__*/React.createElement("code", null, val ? 'True' : 'False');
          }
          if (colVal.key === '@id' && val.slice(0, 1) === '/') {
            val = /*#__PURE__*/React.createElement("a", {
              href: val
            }, val);
          }
          if (val && _typeof(val) === 'object' && ! /*#__PURE__*/React.isValidElement(val) && !Array.isArray(val)) {
            if (isAnItem(val)) {
              val = /*#__PURE__*/React.createElement("a", {
                href: itemUtil.atId(val)
              }, val.display_title);
            } else if (isAnAttachment(val) && (val.href.charAt(0) === '/' || rowAtIdValue)) {
              var attachmentTitle = SubItemTable.getAttachmentTitle(val.href, 'attached_file');
              var attachmentHref = val.href.charAt(0) === '/' ? val.href : rowAtIdValue + val.href;
              val = /*#__PURE__*/React.createElement("a", {
                href: attachmentHref,
                target: "_blank",
                rel: "noreferrer noopener"
              }, attachmentTitle);
            } else {
              val = SubItemTable.jsonify(val, columnKeys[j].key);
            }
          }
          if (Array.isArray(val) && val.length > 0 && !_.all(val, React.isValidElement)) {
            var renderAsList = val.length > 1;
            val = _.map(val, function (v, i) {
              var item = null;
              if (isAnItem(v)) {
                item = /*#__PURE__*/React.createElement("a", {
                  href: itemUtil.atId(v)
                }, v.display_title);
              } else if (isAnAttachment(v) && (val.href.charAt(0) === '/' || rowAtIdValue)) {
                var _attachmentTitle = SubItemTable.getAttachmentTitle(v.href, 'attached_file');
                var _attachmentHref = val.href.charAt(0) === '/' ? val.href : rowAtIdValue + val.href;
                val = /*#__PURE__*/React.createElement("a", {
                  href: _attachmentHref,
                  target: "_blank",
                  rel: "noreferrer noopener"
                }, _attachmentTitle);
              } else {
                item = SubItemTable.jsonify(v, columnKeys[j].key + ':' + i);
              }
              return renderAsList ? /*#__PURE__*/React.createElement("li", {
                key: i
              }, item) : item;
            });
            if (renderAsList) {
              val = /*#__PURE__*/React.createElement("ol", null, val);
              className += ' text-left';
            }
          }
          return /*#__PURE__*/React.createElement("td", {
            key: "column-for-" + columnKeys[j].key,
            className: className || null
          }, val);
        })));
      }))));
    }
  }], [{
    key: "shouldUseTable",
    value:
    /**
     * This code could look better.
     * Essentially, checks each property in first object of param 'list' and if no values fail a rough validation wherein there must be no too-deeply nested objects or lists, returns true.
     *
     * @param {Object[]} list - List of objects
     * @returns {boolean} True if a table would be good for showing these items.
     */
    function shouldUseTable(list, schemas) {
      if (!Array.isArray(list)) return false;
      if (list.length < 1) return false;
      var schemaForType;
      if (_.any(list, function (x) {
        return typeof x === 'undefined';
      })) return false;
      if (!_.all(list, function (x) {
        return _typeof(x) === 'object' && x;
      })) return false;
      if (_.all(list, function (x) {
        return Array.isArray(x);
      })) return false; //multi-dim array??
      if (_.any(list, function (x) {
        if (!Array.isArray(x['@type'])) {
          {/* return true; // No @type so we can't get 'columns' from schemas. */}
        } else {
          schemaForType = getSchemaForItemType(x['@type'][0], schemas);
          if (!schemaForType || !schemaForType.columns) return true; // No columns on this Item type's schema. Skip.
        }
      })) return false;
      var objectWithAllItemKeys = _.reduce(list, function (m, v) {
        var v2 = _.clone(v);
        var valKeys = _.keys(v2);
        // Exclude empty arrays from copied-from object, add them into memo property instead of overwrite.
        for (var i = 0; i < valKeys.length; i++) {
          if (Array.isArray(v2[valKeys[i]])) {
            m[valKeys[i]] = (m[valKeys[i]] || []).concat(v2[valKeys[i]]);
            delete v2[valKeys[i]];
          } else if (v2[valKeys[i]] && _typeof(v2[valKeys[i]]) === 'object') {
            m[valKeys[i]] = _.extend(m[valKeys[i]] || {}, v2[valKeys[i]]);
            delete v2[valKeys[i]];
          }
        }
        return _.extend(m, v2);
      }, {});
      var rootKeys = _.keys(objectWithAllItemKeys);
      var embeddedKeys, i, j, k, embeddedListItem, embeddedListItemKeys;
      for (i = 0; i < rootKeys.length; i++) {
        if (Array.isArray(objectWithAllItemKeys[rootKeys[i]])) {
          var listObjects = _.filter(objectWithAllItemKeys[rootKeys[i]], function (v) {
            if (!v || v && _typeof(v) === 'object') return true;
            return false;
          });
          if (listObjects.length === 0) continue; // List of strings or values only. Continue.
          var listNotItems = _.filter(listObjects, function (v) {
            return !isAnItem(v);
          });
          if (listNotItems.length === 0) continue; // List of Items that can be rendered as links. Continue.

          // Else, we have list of Objects. Assert that each sub-object has only strings, numbers, or Item (object with link), or list of such -- no other sub-objects.
          for (k = 0; k < listNotItems.length; k++) {
            embeddedListItem = listNotItems[k];
            embeddedListItemKeys = _.keys(embeddedListItem);
            for (j = 0; j < embeddedListItemKeys.length; j++) {
              if (typeof embeddedListItem[embeddedListItemKeys[j]] === 'string' || typeof embeddedListItem[embeddedListItemKeys[j]] === 'number') {
                continue;
              }
              if (isAnItem(embeddedListItem[embeddedListItemKeys[j]])) {
                continue;
              }
              if (Array.isArray(embeddedListItem[embeddedListItemKeys[j]]) && _.filter(embeddedListItem[embeddedListItemKeys[j]], function (v) {
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
          // Embedded object 1 level deep. Will flatten upwards if passes checks:
          // example: (sub-object) {..., 'stringProp' : 'stringVal', 'meta' : {'argument_name' : 'x', 'argument_type' : 'y'}, ...} ===> (columns) 'stringProp', 'meta.argument_name', 'meta.argument_type'
          if (isAnItem(objectWithAllItemKeys[rootKeys[i]])) {
            // This embedded object is an.... ITEM! Skip rest of checks for this property, we're ok with just drawing link to Item.
            continue;
          }
          embeddedKeys = _.keys(objectWithAllItemKeys[rootKeys[i]]);
          if (embeddedKeys.length > 5) return false; // 5 properties to flatten up feels like a good limit. Lets render objects with more than that as lists or own table (not flattened up to another 1).
          // Run some checks against the embedded object's properties. Ensure all nested lists contain plain strings or numbers, as will flatten to simple comma-delimited list.
          for (j = 0; j < embeddedKeys.length; j++) {
            if (typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]] === 'string' || typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]] === 'number') continue;
            // Ensure if property on embedded object's is an array, that is a simple array of strings or numbers - no objects. Will be converted to comma-delimited list.
            if (Array.isArray(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]])) {
              if (objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]].length < 4 && _.filter(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]], function (v) {
                if (typeof v === 'string' || typeof v === 'number') {
                  return false;
                } else if (v && _typeof(v) === 'object' && _.keys(v).length < 2) {
                  return false;
                } else {
                  return true;
                }
              }).length === 0
              //(typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]][0] === 'string' || typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]][0] === 'number')
              ) {
                continue;
              } else {
                return false;
              }
            }

            // Ensure that if is not an array, it is a simple string or number (not another embedded object).
            if (!Array.isArray(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]]) && objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]] && _typeof(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]]) === 'object') {
              // Embedded object 2 levels deep. No thx we don't want any 'meta.argument_mapping.argument_type' -length column names. Unless it's an Item for which we can just render link for.
              if (isAnItem(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]])) continue;
              return false;
            }
          }
        }
      }
      var reminderKeys = _.difference(_.keys(objectWithAllItemKeys), ['principals_allowed', '@type', 'uuid']);
      if (reminderKeys.length <= 2) {
        return false;
      }
      return true;
    }

    /**
     * check whether the list is a multi dimensional array
     * @param {*} list - array to be checked
     * @param {*} validationFunc - function to validate items in the array, if any fails then return false
     * @returns boolean
     */
  }, {
    key: "isMultiDimArray",
    value: function isMultiDimArray(list, validationFunc) {
      if (!Array.isArray(list)) return false;
      if (list.length < 1) return false;
      if (!_.all(list, function (x) {
        return Array.isArray(x) && x.length > 0;
      })) return false;
      if (!_.all(list, function (x) {
        return x.length === list[0].length;
      })) return false;
      if (validationFunc && typeof validationFunc === 'function') {
        if (_.any(list, function (x) {
          if (_.any(x, function (item) {
            return !validationFunc(item);
          })) {
            return true;
          }
        })) return false;
      }
      return true;
    }
  }, {
    key: "getColumnKeys",
    value: function getColumnKeys(items, columnDefinitions, schemas) {
      var objectWithAllItemKeys = _.reduce(items, function (m, v) {
        return _.extend(m, v);
      }, {});
      //var schemas = this.props.schemas || Schemas.get();
      //var tips = schemas ? tipsFromSchema(schemas, context) : {};
      //if (typeof this.props.keyTitleDescriptionMap === 'object' && this.props.keyTitleDescriptionMap){
      //    _.extend(tips, this.props.keyTitleDescriptionMap);
      //}

      // Property columns to push to front (common across all objects)
      var rootKeys = _.keys(objectWithAllItemKeys);
      var columnKeys = [];

      // Use schema columns
      if (typeof objectWithAllItemKeys.display_title === 'string' && Array.isArray(objectWithAllItemKeys['@type'])) {
        var columnKeysFromSchema = _.keys(getSchemaForItemType(getItemType(objectWithAllItemKeys), schemas).columns);
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
        // Gather, flatten up from Object.
        for (var i = 0; i < rootKeys.length; i++) {
          if (typeof objectWithAllItemKeys[rootKeys[i]] === 'string' || typeof objectWithAllItemKeys[rootKeys[i]] === 'number' || Array.isArray(objectWithAllItemKeys[rootKeys[i]])) {
            if (Array.isArray(objectWithAllItemKeys[rootKeys[i]]) && objectWithAllItemKeys[rootKeys[i]][0] && _typeof(objectWithAllItemKeys[rootKeys[i]][0]) === 'object' && typeof objectWithAllItemKeys[rootKeys[i]][0].display_title !== 'string') {
              columnKeys.push({
                'key': rootKeys[i],
                'childKeys': _.keys(_.reduce(items, function (m1, v1) {
                  return _.extend(m1, _.reduce(v1[rootKeys[i]], function (m2, v2) {
                    return _.extend(m2, v2);
                  }, {}));
                }, {}))
              });
            } else {
              columnKeys.push({
                'key': rootKeys[i]
              });
            }
          } else if (objectWithAllItemKeys[rootKeys[i]] && _typeof(objectWithAllItemKeys[rootKeys[i]]) === 'object') {
            var itemAtID = typeof objectWithAllItemKeys[rootKeys[i]].display_title === 'string' && itemUtil.atId(objectWithAllItemKeys[rootKeys[i]]);
            if (itemAtID) {
              columnKeys.push({
                'key': rootKeys[i]
              }); // Keep single key if is an Item, we'll make it into a link.
            } else {
              // Flatten up, otherwise.
              columnKeys = columnKeys.concat(_.keys(objectWithAllItemKeys[rootKeys[i]]).map(function (embeddedKey) {
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
        // Push columns with child/embedded object lists to the end.
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
        if (_.keys(val).length > 1) {
          console.error("ERROR: Value for table cell is not a string, number, or JSX element.\nKey: " + key + '; Value: ' + newVal);
        }
        newVal = /*#__PURE__*/React.createElement("code", null, newVal.length <= 25 ? newVal : newVal.slice(0, 25) + '...');
      } catch (e) {
        console.error(e, val);
        newVal = /*#__PURE__*/React.createElement("em", null, '{obj}');
      }
      return newVal;
    }
  }, {
    key: "getAttachmentTitle",
    value: function getAttachmentTitle(val, fallbackTitle) {
      if (typeof val === 'string') {
        var split_item = val.split('/');
        var attach_title = decodeURIComponent(split_item[split_item.length - 1]);
        return attach_title || fallbackTitle;
      }
      return fallbackTitle;
    }
  }]);
  return SubItemTable;
}(React.Component);
var DetailRow = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(DetailRow, _React$PureComponent);
  var _super2 = _createSuper(DetailRow);
  function DetailRow(props) {
    var _this2;
    _classCallCheck(this, DetailRow);
    _this2 = _super2.call(this, props);
    _this2.handleToggle = _this2.handleToggle.bind(_assertThisInitialized(_this2));
    _this2.state = {
      'isOpen': false
    };
    return _this2;
  }

  /**
   * Handler for rendered title element. Toggles visiblity of Subview.
   *
   * @param {React.SyntheticEvent} e - Mouse click event. Its preventDefault() method is called.
   * @returns {void}
   */
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
        termTransformFxn = _this$props2.termTransformFxn,
        key = _this$props2["data-key"];
      var isOpen = this.state.isOpen;
      var value = Detail.formValue(item, popLink, key, itemType, columnDefinitions, 0, schemas, termTransformFxn);
      var labelToShow = label;
      if (labelNumber) {
        labelToShow = /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
          className: "label-number right d-inline-block" + (isOpen ? ' active' : '')
        }, /*#__PURE__*/React.createElement("span", {
          className: "number-icon text-200"
        }, "#"), " ", labelNumber), label);
      }
      if (value.type === SubItemTitle) {
        // What we have here is an embedded object of some sort. Lets override its 'isOpen' & 'onToggle' functions.
        value = /*#__PURE__*/React.cloneElement(value, {
          'onToggle': this.handleToggle,
          'isOpen': isOpen
        });
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PartialList.Row, {
          field: key,
          label: labelToShow,
          className: (className || '') + (isOpen ? ' open' : '')
        }, value), /*#__PURE__*/React.createElement(SubItemListView, {
          popLink: popLink,
          schemas: schemas,
          isOpen: isOpen,
          termTransformFxn: termTransformFxn,
          content: item,
          columnDefinitions: value.props.columnDefinitions || columnDefinitions // Recursively pass these down
        }));
      }

      if (value.type === "ol" && value.props.children[0] && value.props.children[0].type === "li" && value.props.children[0].props.children && value.props.children[0].props.children.type === SubItemTitle) {
        // What we have here is a list of embedded objects. Render them out recursively and adjust some styles.
        return /*#__PURE__*/React.createElement("div", {
          className: "array-group",
          "data-length": item.length
        }, React.Children.map(value.props.children, function (c, i) {
          return /*#__PURE__*/React.createElement(DetailRow, _extends({}, _this3.props, {
            label: i === 0 ? labelToShow : /*#__PURE__*/React.createElement("span", {
              className: "dim-duplicate"
            }, labelToShow),
            labelNumber: i + 1,
            item: item[i],
            className: "array-group-row item-index-" + i + (i === item.length - 1 ? ' last-item' : '') + (i === 0 ? ' first-item' : '')
          }));
        }));
      }
      // Default / Pass-Thru
      return /*#__PURE__*/React.createElement(PartialList.Row, {
        label: labelToShow,
        field: key,
        className: (className || '') + (isOpen ? ' open' : '')
      }, value);
    }
  }]);
  return DetailRow;
}(React.PureComponent);
/**
 * The list of properties contained within ItemDetailList.
 * Isolated to allow use without existing in ItemDetailList parent.
 *
 * @class Detail
 * @type {Component}
 */
export var Detail = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(Detail, _React$PureComponent2);
  var _super3 = _createSuper(Detail);
  function Detail(props) {
    var _this4;
    _classCallCheck(this, Detail);
    _this4 = _super3.call(this, props);
    _this4.renderDetailRow = _this4.renderDetailRow.bind(_assertThisInitialized(_this4));
    _this4.memoized = {
      columnDefinitions: memoize(Detail.columnDefinitions),
      generatedKeysLists: memoize(Detail.generatedKeysLists)
    };
    return _this4;
  }
  _createClass(Detail, [{
    key: "renderDetailRow",
    value: function renderDetailRow(key) {
      var _this$props3 = this.props,
        context = _this$props3.context,
        popLink = _this$props3.popLink,
        schemas = _this$props3.schemas,
        columnDefinitions = _this$props3.columnDefinitions,
        termTransformFxn = _this$props3.termTransformFxn;
      var colDefs = this.memoized.columnDefinitions(context, schemas, columnDefinitions);
      return /*#__PURE__*/React.createElement(DetailRow, {
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
      var _this$memoized$genera = this.memoized.generatedKeysLists(context, excludedKeys, stickyKeys, alwaysCollapsibleKeys),
        persistentKeys = _this$memoized$genera.persistentKeys,
        collapsibleKeys = _this$memoized$genera.collapsibleKeys;
      return /*#__PURE__*/React.createElement("div", {
        className: "overflow-hidden"
      }, /*#__PURE__*/React.createElement(PartialList, {
        persistent: _.map(persistentKeys, this.renderDetailRow),
        collapsible: _.map(collapsibleKeys, this.renderDetailRow),
        open: open
      }));
    }
  }], [{
    key: "formKey",
    value:
    /**
     * Formats the correct display for each metadata field.
     *
     * @param {Object} tips - Mapping of field property names (1 level deep) to schema properties.
     * @param {string} key - Key to use to get 'description' for tooltip from the 'tips' param.
     * @param {boolean} [includeTooltip=false] - If false, skips adding tooltip to output JSX.
     * @returns {JSX.Element} <div> element with a tooltip and info-circle icon.
     */
    function formKey(tips, key) {
      var includeTooltip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var tooltip = null,
        title = null;
      if (tips[key]) {
        var info = tips[key];
        if (info.title) title = info.title;
        if (!includeTooltip) return title;
        if (info.description) tooltip = info.description;
      }
      return /*#__PURE__*/React.createElement(TooltipInfoIconContainer, {
        title: title || key,
        tooltip: tooltip
      });
    }

    /**
    * Recursively render keys/values included in a provided item.
    * Wraps URLs/paths in link elements. Sub-panels for objects.
    *
    * @todo cleanup, probably not have as a static func.
    *
    * @param {Item} item - JSON of an Item.
    * @param {boolean} [popLink=false] - Whether to open child links in new window.
    * @param {string} keyPrefix - Not sure. Key to use to get value with?
    * @param {string} atType - Current type of Item.
    * @param {ColumnDefinition[]} columnDefinitions - List of column definitions to use for SubItemTable.
    * @param {number} depth - Current recursive depth.
    * @returns {JSX.Element}
    */
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
        return /*#__PURE__*/React.createElement("span", null, "No Value");
      } else if (Array.isArray(item)) {
        if (SubItemTable.shouldUseTable(item, schemas)) {
          return /*#__PURE__*/React.createElement(SubItemTable, {
            popLink: popLink,
            columnDefinitions: columnDefinitions,
            schemas: schemas,
            atType: atType,
            termTransformFxn: termTransformFxn,
            items: item,
            parentKey: keyPrefix
          });
        } else if (SubItemTable.isMultiDimArray(item, isPrimitive)) {
          item = _.zip.apply(_, _toConsumableArray(item));
          return /*#__PURE__*/React.createElement("ol", null, item.map(function (it, i) {
            return /*#__PURE__*/React.createElement("li", {
              key: i
            }, JSON.stringify(it, null, 1));
          }));
        }
        return /*#__PURE__*/React.createElement("ol", null, item.length === 0 ? /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("em", null, "None")) : item.map(function (it, i) {
          return /*#__PURE__*/React.createElement("li", {
            key: i
          }, Detail.formValue(it, popLink, keyPrefix, atType, columnDefinitions, depth + 1, schemas));
        }));
      } else if (_typeof(item) === 'object' && item !== null) {
        var linkElement = itemUtil.generateLink(item, true, 'display_title', {
          'target': popLink ? '_blank' : null
        }, true);

        // if the following is true, we have an embedded Item. Link to it.
        if (linkElement) {
          return linkElement;
        } else {
          // it must be an embedded sub-object (not Item)
          var releventProperties = _.object(_.map(_.filter(_.pairs(columnDefinitions), function (c) {
            return c[0].indexOf(keyPrefix + '.') === 0;
          }), function (c) {
            c[0] = c[0].replace(keyPrefix + '.', '');
            return c;
          }));
          return /*#__PURE__*/React.createElement(SubItemTitle, {
            schemas: schemas,
            content: item,
            key: keyPrefix,
            countProperties: _.keys(item).length,
            popLink: popLink,
            columnDefinitions: releventProperties
          });
        }
      } else if (typeof item === 'string') {
        if (keyPrefix === '@id') {
          return /*#__PURE__*/React.createElement("a", {
            key: item,
            href: item,
            target: popLink ? "_blank" : null,
            rel: "noreferrer noopener"
          }, item);
        }
        if (item.charAt(0) === '/' && item.indexOf('@@download') > -1) {
          // This is a download link. Format appropriately
          var attach_title = SubItemTable.getAttachmentTitle(item);
          return /*#__PURE__*/React.createElement("a", {
            key: item,
            href: item,
            target: "_blank",
            download: true,
            rel: "noreferrer noopener"
          }, attach_title || item);
        } else if (item.charAt(0) === '/') {
          if (popLink) return /*#__PURE__*/React.createElement("a", {
            key: item,
            href: item,
            target: "_blank",
            rel: "noreferrer noopener"
          }, item);else return /*#__PURE__*/React.createElement("a", {
            key: item,
            href: item
          }, item);
        } else {
          // TODO: more comprehensive regexp url validator needed, look at: https://stackoverflow.com/a/5717133
          // Is a URL. Check if we should render it as a link/uri.
          var schemaProperty = getSchemaProperty(keyPrefix, schemas || {}, atType);
          var schemaPropertyFormat = schemaProperty && typeof schemaProperty.format === 'string' && schemaProperty.format.toLowerCase() || null;
          if (schemaPropertyFormat && ['uri', 'url'].indexOf(schemaPropertyFormat) > -1 && item.slice(0, 4) === 'http') {
            return /*#__PURE__*/React.createElement("a", {
              key: item,
              href: item,
              target: "_blank",
              rel: "noreferrer noopener"
            }, item);
          } else {
            return /*#__PURE__*/React.createElement("span", null, termTransformFxn(keyPrefix, item));
          }
        }
      } else if (typeof item === 'number') {
        return /*#__PURE__*/React.createElement("span", null, termTransformFxn(keyPrefix, item));
      } else if (typeof item === 'boolean') {
        return /*#__PURE__*/React.createElement("span", {
          style: {
            'textTransform': 'capitalize'
          }
        }, item + '');
      }
      return /*#__PURE__*/React.createElement("span", null, item); // Fallback
    }
  }, {
    key: "columnDefinitions",
    value: function columnDefinitions(context, schemas, columnDefinitionMap) {
      var colDefsFromSchema = flattenSchemaPropertyToColumnDefinition(schemas ? tipsFromSchema(schemas, context) : {}, 0, schemas);
      return _.extend(colDefsFromSchema, columnDefinitionMap || {}); // { <property> : { 'title' : ..., 'description' : ... } }
    }
  }, {
    key: "generatedKeysLists",
    value: function generatedKeysLists(context, excludedKeys, stickyKeys, alwaysCollapsibleKeys) {
      var sortKeys = _.difference(_.keys(context).sort(), excludedKeys.sort());

      // Sort applicable persistent keys by original persistent keys sort order.
      var stickyKeysObj = _.object(_.intersection(sortKeys, stickyKeys.slice(0).sort()).map(function (key) {
        return [key, true];
      }));
      var orderedStickyKeys = [];
      stickyKeys.forEach(function (key) {
        if (stickyKeysObj[key] === true) orderedStickyKeys.push(key);
      });
      var extraKeys = _.difference(sortKeys, stickyKeys.slice(0).sort());
      var collapsibleKeys = _.intersection(extraKeys.sort(), alwaysCollapsibleKeys.slice(0).sort());
      extraKeys = _.difference(extraKeys, collapsibleKeys);
      return {
        'persistentKeys': orderedStickyKeys.concat(extraKeys),
        'collapsibleKeys': collapsibleKeys
      };
    }
  }]);
  return Detail;
}(React.PureComponent);
_defineProperty(Detail, "SubItemTitle", SubItemTitle);
_defineProperty(Detail, "propTypes", {
  'context': PropTypes.object.isRequired,
  'columnDefinitions': PropTypes.object
});
/** For the most part, these are 4DN-specific and overriden as needed in CGAP portal. */
_defineProperty(Detail, "defaultProps", {
  'excludedKeys': ['@context', 'actions', 'principals_allowed',
  // Visible elsewhere on page
  'lab', 'award', 'description', '@id', 'display_title', 'aggregated-items'],
  'stickyKeys': ['display_title', 'title',
  // Experiment Set
  'experimentset_type', 'date_released',
  // Experiment
  'experiment_type', 'experiment_summary', 'experiment_sets', 'files', 'filesets', 'protocol', 'biosample', 'digestion_enzyme', 'digestion_temperature', 'digestion_time', 'ligation_temperature', 'ligation_time', 'ligation_volume', 'tagging_method',
  // Experiment Type
  'experiment_category', 'assay_classification', 'assay_subclassification', 'assay_subclass_short', 'sop', 'reference_pubs', 'raw_file_types', 'controlled_term', 'other_protocols', 'other_tags',
  // Biosample
  'biosource', 'biosource_summary', 'biosample_protocols', 'modifications_summary', 'treatments_summary',
  // File
  'filename', 'file_type', 'file_format', 'href', 'notes', 'flowcell_details',
  // Lab
  'awards', 'address1', 'address2', 'city', 'country', 'institute_name', 'state',
  // Award
  'end_date', 'project', 'uri', 'ID',
  // Document
  'attachment',
  // Things to go at bottom consistently
  'aliases'],
  'alwaysCollapsibleKeys': ['@type', 'accession', 'schema_version', 'uuid', 'replicate_exps', 'status', 'external_references', 'date_created', 'last_modified', 'submitted_by', 'project_release', 'short_attribution', 'validation-errors'],
  'open': null,
  'columnDefinitionMap': {
    '@id': {
      'title': 'Link',
      'description': 'Link to Item'
    },
    'subscriptions.url': {
      'render': function render(value) {
        return /*#__PURE__*/React.createElement("a", {
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
          return /*#__PURE__*/React.createElement("a", {
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
var ToggleJSONButton = /*#__PURE__*/React.memo(function (_ref3) {
  var onClick = _ref3.onClick,
    showingJSON = _ref3.showingJSON,
    className = _ref3.className;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-block btn-outline-secondary",
    onClick: onClick
  }, showingJSON ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "icon fas icon-fw icon-list"
  }), " View as List") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "icon fas icon-fw icon-code"
  }), " View as JSON"));
});
var SeeMoreRowsButton = /*#__PURE__*/React.memo(function (_ref4) {
  var onClick = _ref4.onClick,
    collapsed = _ref4.collapsed,
    className = _ref4.className;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-block btn-outline-secondary",
    onClick: onClick
  }, collapsed ? "See advanced information" : "Hide");
});

/**
 * A list of properties which belong to Item shown by ItemView.
 * Shows 'persistentKeys' fields & values stickied near top of list,
 * 'excludedKeys' never, and 'hiddenKeys' only when "See More Info" button is clicked.
 *
 * @class
 * @type {Component}
 */
export var ItemDetailList = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(ItemDetailList, _React$PureComponent3);
  var _super4 = _createSuper(ItemDetailList);
  function ItemDetailList(props) {
    var _this5;
    _classCallCheck(this, ItemDetailList);
    _this5 = _super4.call(this, props);
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
      ReactTooltip.rebuild();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      if (this.state.showingJSON === false && pastState.showingJSON === true) {
        ReactTooltip.rebuild();
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
        body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
          className: "json-tree-wrapper"
        }, /*#__PURE__*/React.createElement(JSONTree, {
          data: context
        })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
          className: "row"
        }, /*#__PURE__*/React.createElement("div", {
          className: "col-12 col-sm-6"
        }, /*#__PURE__*/React.createElement(ToggleJSONButton, {
          onClick: this.handleToggleJSON,
          showingJSON: showingJSON
        }))));
      } else {
        var colDefs = _.extend({}, columnDefinitionMap || {}, keyTitleDescriptionMap || {});
        var isCollapsed;
        if (typeof propCollapsed === 'boolean') isCollapsed = propCollapsed;else isCollapsed = collapsed;
        var buttonsRow;
        if (hideButtons) {
          buttonsRow = null;
        } else if (!showJSONButton) {
          buttonsRow = /*#__PURE__*/React.createElement("div", {
            className: "row"
          }, /*#__PURE__*/React.createElement("div", {
            className: "col-12"
          }, /*#__PURE__*/React.createElement(SeeMoreRowsButton, {
            onClick: this.handleToggleCollapsed,
            collapsed: collapsed
          })));
        } else {
          buttonsRow = /*#__PURE__*/React.createElement("div", {
            className: "row"
          }, /*#__PURE__*/React.createElement("div", {
            className: "col-6"
          }, /*#__PURE__*/React.createElement(SeeMoreRowsButton, {
            onClick: this.handleToggleCollapsed,
            collapsed: collapsed
          })), /*#__PURE__*/React.createElement("div", {
            className: "col-6"
          }, /*#__PURE__*/React.createElement(ToggleJSONButton, {
            onClick: this.handleToggleJSON,
            showingJSON: showingJSON
          })));
        }
        body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Detail, _extends({}, this.props, {
          open: !isCollapsed,
          columnDefinitions: colDefs
        })), buttonsRow);
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "item-page-detail",
        style: typeof minHeight === 'number' ? {
          minHeight: minHeight
        } : null
      }, body);
    }
  }], [{
    key: "getTabObject",
    value: function getTabObject(props) {
      return {
        tab: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
          className: "icon fas icon-list icon-fw"
        }), " Details"),
        key: 'details',
        content: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
          className: "tab-section-title"
        }, /*#__PURE__*/React.createElement("span", null, "Details")), /*#__PURE__*/React.createElement("hr", {
          className: "tab-section-title-horiz-divider mb-05"
        }), /*#__PURE__*/React.createElement(ItemDetailList, props))
      };
    }
  }]);
  return ItemDetailList;
}(React.PureComponent);
_defineProperty(ItemDetailList, "Detail", Detail);
_defineProperty(ItemDetailList, "defaultProps", {
  'showJSONButton': true,
  'hideButtons': false,
  'columnDefinitionMap': Detail.defaultProps.columnDefinitionMap
});