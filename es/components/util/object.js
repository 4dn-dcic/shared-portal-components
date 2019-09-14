'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.atIdFromObject = atIdFromObject;
exports.linkFromItem = linkFromItem;
exports.mapToObject = mapToObject;
exports.tipsFromSchema = tipsFromSchema;
exports.tipsFromSchemaByType = tipsFromSchemaByType;
exports.listFromTips = listFromTips;
exports.getNestedProperty = getNestedProperty;
exports.isValidJSON = isValidJSON;
exports.generateSparseNestedProperty = generateSparseNestedProperty;
exports.deepExtend = deepExtend;
exports.extendChildren = extendChildren;
exports.deepClone = deepClone;
exports.htmlToJSX = htmlToJSX;
exports.isValidAtIDFormat = isValidAtIDFormat;
exports.isAnItem = isAnItem;
exports.randomId = randomId;
exports.assertUUID = assertUUID;
exports.isUUID = isUUID;
exports.isAccessionRegex = isAccessionRegex;
exports.singleTreatment = singleTreatment;
exports.TooltipInfoIconContainer = TooltipInfoIconContainer;
exports.TooltipInfoIconContainerAuto = TooltipInfoIconContainerAuto;
exports.itemUtil = exports.saferMD5 = exports.CopyWrapper = void 0;

var _underscore = _interopRequireDefault(require("underscore"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _htmlToDomServer = _interopRequireDefault(require("html-dom-parser/lib/html-to-dom-server"));

var _domToReact = _interopRequireDefault(require("html-react-parser/lib/dom-to-react"));

var _jsMd = _interopRequireDefault(require("js-md5"));

var _patchedConsole = require("./patched-console");

var _schemaTransforms = require("./schema-transforms");

var analytics = _interopRequireWildcard(require("./analytics"));

var _url = _interopRequireDefault(require("url"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function atIdFromObject(o) {
  if (!o) return null;
  if (_typeof(o) !== 'object') return null;
  if (typeof o['@id'] === 'string') return o['@id'];

  if (typeof o.link_id === 'string') {
    var atId = o.link_id.replace(/~/g, "/");

    _patchedConsole.patchedConsoleInstance.warn("Found a link_id but not an @id for " + atId);

    return atId;
  }

  return null;
}

function linkFromItem(item) {
  var addDescriptionTip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var propertyForTitle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'display_title';
  var elementProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var suppressErrors = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var href = atIdFromObject(item),
      title = item && _typeof(item) === 'object' && (propertyForTitle && item[propertyForTitle] || item.display_title || item.title || item.name || href);

  if (!href || !title) {
    if (item && _typeof(item) === 'object' && typeof item.error === 'string') {
      return _react.default.createElement("em", null, item.error);
    }

    if (!suppressErrors) _patchedConsole.patchedConsoleInstance.error("Could not get atId for Item", item);
    return null;
  }

  var propsToInclude = elementProps && _underscore.default.clone(elementProps);

  if (typeof propsToInclude.key === 'undefined') {
    propsToInclude.key = href;
  }

  if (addDescriptionTip && typeof propsToInclude['data-tip'] === 'undefined' && item.description) {
    propsToInclude['data-tip'] = item.description;
    propsToInclude.className = (propsToInclude.className || '') + ' inline-block';
  }

  return _react.default.createElement("a", _extends({
    href: href
  }, propsToInclude), title);
}

function mapToObject(esMap) {
  var retObj = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = esMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          val = _step$value[1];

      retObj[key] = val;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return retObj;
}

function tipsFromSchema(schemas, content) {
  if (content['@type'] && Array.isArray(content['@type']) && content['@type'].length > 0) {
    content['@type'][0];
    return tipsFromSchemaByType(schemas, content['@type'][0]);
  }

  return {};
}

function tipsFromSchemaByType(schemas) {
  var itemType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ExperimentSet';
  var tips = {};

  if (itemType && _typeof(schemas) === 'object' && schemas !== null) {
    if (schemas[itemType]) {
      tips = schemas[itemType].properties;
    }
  }

  return tips;
}

function listFromTips(tips) {
  return _underscore.default.map(_underscore.default.pairs(tips), function (p) {
    return _underscore.default.extend(_underscore.default.omit(p[1], 'key'), {
      'key': p[0]
    });
  });
}

function getNestedProperty(object, propertyName) {
  var suppressNotFoundError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var errorMsg;
  if (typeof propertyName === 'string') propertyName = propertyName.split('.');

  if (!Array.isArray(propertyName)) {
    errorMsg = 'Using improper propertyName "' + propertyName + '" in object.getNestedProperty.';

    _patchedConsole.patchedConsoleInstance.error(errorMsg);

    return null;
  }

  if (!object || _typeof(object) !== 'object') {
    errorMsg = 'Not valid object.';

    _patchedConsole.patchedConsoleInstance.error(errorMsg);

    return null;
  }

  try {
    return function findNestedValue(currentNode, fieldHierarchyLevels) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      if (level === fieldHierarchyLevels.length) return currentNode;

      if (Array.isArray(currentNode)) {
        var arrayVals = [];

        for (var i = 0; i < currentNode.length; i++) {
          arrayVals.push(findNestedValue(currentNode[i], fieldHierarchyLevels, level));
        }

        return arrayVals;
      } else {
        if (typeof object === 'undefined' || !object) {
          if (!suppressNotFoundError) throw new Error('Field ' + _underscore.default.clone(fieldHierarchyLevels).splice(0, level + 1).join('.') + ' not found on object.');
          return;
        }

        return findNestedValue(currentNode[fieldHierarchyLevels[level]], fieldHierarchyLevels, level + 1);
      }
    }(object, propertyName);
  } catch (e) {
    errorMsg = 'Could not get ' + propertyName.join('.') + ' from nested object.';
    if (!suppressNotFoundError) _patchedConsole.patchedConsoleInstance.warn(errorMsg);
    return null;
  }
}

function isValidJSON(content) {
  var isJson = true;

  try {
    JSON.parse(JSON.stringify(content));
  } catch (err) {
    isJson = false;
  }

  return isJson;
}

function generateSparseNestedProperty(field, value) {
  if (typeof field === 'string') field = field.split('.');
  if (!Array.isArray(field)) throw new Error("Could not create nested field in object. Check field name.");
  var currObj = {};
  currObj[field.pop()] = value;
  if (field.length === 0) return currObj;
  return generateSparseNestedProperty(field, currObj);
}

function deepExtend(hostObj, nestedObj) {
  var maxDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var currentDepth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var nKey = Object.keys(nestedObj)[0];

  if (currentDepth > maxDepth) {
    return false;
  }

  if (typeof hostObj[nKey] !== 'undefined') {
    if (_typeof(nestedObj[nKey]) === 'object' && !Array.isArray(hostObj[nKey])) {
      return deepExtend(hostObj[nKey], nestedObj[nKey], maxDepth, currentDepth + 1);
    } else {
      if (typeof nestedObj[nKey] === 'undefined') {
        delete hostObj[nKey];
        return true;
      }

      hostObj[nKey] = nestedObj[nKey];
      return true;
    }
  } else if (typeof nestedObj[nKey] !== 'undefined') {
    hostObj[nKey] = nestedObj[nKey];
    return true;
  } else {
    return false;
  }
}

function extendChildren() {
  var args = Array.from(arguments),
      argsLen = args.length;
  if (args.length < 2) return args[0];
  var hostObj = args[0] || {},
      allKeys = Array.from(_underscore.default.reduce(args.slice(1), function (m, obj) {
    _underscore.default.forEach(_underscore.default.keys(obj), function (k) {
      m.add(k);
    });

    return m;
  }, new Set()));

  _underscore.default.forEach(allKeys, function (childProperty) {
    for (var objIndex = 0; objIndex < argsLen; objIndex++) {
      var currObjToCopyFrom = args[objIndex];

      if (typeof currObjToCopyFrom[childProperty] !== 'undefined') {
        if (typeof hostObj[childProperty] === 'undefined') {
          hostObj[childProperty] = {};
        }

        _underscore.default.extend(hostObj[childProperty], currObjToCopyFrom[childProperty]);
      }
    }
  });

  return hostObj;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function htmlToJSX(htmlString) {
  var nodes,
      result,
      someTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

  try {
    nodes = (0, _htmlToDomServer.default)(htmlString, {
      decodeEntities: true,
      lowerCaseAttributeNames: false
    });
  } catch (e) {
    _patchedConsole.patchedConsoleInstance.error('HTML parsing error', e);

    return _react.default.createElement("div", {
      className: "error"
    }, "Parsing Error. Check your markup.");
  }

  function filterNodes(nodeList) {
    return _underscore.default.filter(_underscore.default.map(nodeList, function (n) {
      if (n.type === 'tag') {
        if (someTags.has(n.name)) return n;
        if (n.name === 'script') return null;
        var match = n.name.match(/[\W\s\d]/);

        if (match && (match.length > 1 || match[0] !== '/')) {
          return null;
        }

        if (Array.isArray(n.children)) {
          n = _underscore.default.extend({}, n, {
            'children': filterNodes(n.children)
          });
        }
      }

      return n;
    }));
  }

  try {
    result = (0, _domToReact.default)(filterNodes(nodes));
  } catch (e) {
    _patchedConsole.patchedConsoleInstance.error('HTML parsing error', e);

    return _react.default.createElement("div", {
      className: "error"
    }, "Parsing Error. Check your markup.");
  }

  return result;
}

function isValidAtIDFormat(value) {
  return value && typeof value === 'string' && value.length > 3 && value.charAt(0) === '/' && value[value.length - 1] === '/' && (value.match(/\//g) || []).length === 3;
}

function isAnItem(content) {
  return content && _typeof(content) === 'object' && (typeof content.display_title === 'string' || typeof content.uuid === 'string') && typeof atIdFromObject(content) === 'string';
}

var randomIdIncrement = 0;

function randomId() {
  return 'random-id-' + ++randomIdIncrement;
}

function assertUUID(uuid) {
  if (typeof uuid !== 'string') throw new Error('UUID is not a string!');
  var parts = uuid.split('-');

  if (parts.length !== 5) {
    throw new Error("UUID string passed is in invalid format (should be 5 segments of characters delimited by dashes).");
  }

  if (parts[0].length !== 8 || parts[1].length !== 4 || parts[2].length !== 4 || parts[3].length !== 4 || parts[4].length !== 12) throw new Error('Incorrect UUID format.');
  return uuid;
}

function isUUID(uuid) {
  try {
    uuid = assertUUID(uuid);
    return true;
  } catch (e) {
    return false;
  }
}

function isAccessionRegex(accessionStr) {
  if (accessionStr.match(/^4DN(EX|ES|FI|FS|SR|BS|IN|WF)[1-9A-Z]{7}$/)) {
    return true;
  }

  return false;
}

function singleTreatment(treatment) {
  var treatmentText = '';

  if (treatment.concentration) {
    treatmentText += treatment.concentration + (treatment.concentration_units ? ' ' + treatment.concentration_units : '') + ' ';
  }

  treatmentText += treatment.treatment_term_name + (treatment.treatment_term_id ? ' (' + treatment.treatment_term_id + ')' : '') + ' ';

  if (treatment.duration) {
    treatmentText += 'for ' + treatment.duration + ' ' + (treatment.duration_units ? treatment.duration_units : '');
  }

  return treatmentText;
}

function TooltipInfoIconContainer(props) {
  var elementType = props.elementType,
      title = props.title,
      tooltip = props.tooltip,
      className = props.className,
      children = props.children;
  return _react.default.createElement(elementType || 'div', {
    'className': "tooltip-info-container" + (typeof className === 'string' ? ' ' + className : '')
  }, _react.default.createElement("span", null, title || children, "\xA0", typeof tooltip === 'string' ? _react.default.createElement("i", {
    "data-tip": tooltip,
    className: "icon fas icon-info-circle"
  }) : null));
}

function TooltipInfoIconContainerAuto(props) {
  var elementType = props.elementType,
      title = props.title,
      property = props.property,
      result = props.result,
      schemas = props.schemas,
      tips = props.tips,
      fallbackTitle = props.fallbackTitle,
      itemType = props.itemType;
  var showTitle = title;
  var schemaProperty = null;
  var tooltip = null;

  if (tips) {
    if (typeof tips === 'string') {
      tooltip = tips;
    } else {
      tooltip = tips && tips[property] && tips[property].description || null;
    }

    if (!showTitle) showTitle = tips && tips[property] && tips[property].title || null;
  }

  if (!showTitle || !tooltip) {
    try {
      schemaProperty = (0, _schemaTransforms.getSchemaProperty)(property, schemas, {}, itemType || result['@type'][0]);
    } catch (e) {
      _patchedConsole.patchedConsoleInstance.warn('Failed to get schemaProperty', itemType, property);
    }

    tooltip = schemaProperty && schemaProperty.description || null;
    if (!showTitle) showTitle = schemaProperty && schemaProperty.title || null;
  }

  return _react.default.createElement(TooltipInfoIconContainer, _extends({}, props, {
    tooltip: tooltip,
    title: showTitle || fallbackTitle || property,
    elementType: elementType
  }));
}

TooltipInfoIconContainerAuto.propTypes = {
  'property': _propTypes.default.string.isRequired,
  'title': _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.element]),
  'result': _propTypes.default.shape({
    '@type': _propTypes.default.array.isRequired
  }).isRequired,
  'itemType': _propTypes.default.string,
  'schemas': _propTypes.default.object,
  'elementType': _propTypes.default.string
};

var CopyWrapper = function (_React$PureComponent) {
  _inherits(CopyWrapper, _React$PureComponent);

  _createClass(CopyWrapper, null, [{
    key: "copyToClipboard",
    value: function copyToClipboard(value) {
      var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var failCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var textArea = document.createElement('textarea');
      textArea.style.top = '-100px';
      textArea.style.left = '-100px';
      textArea.style.position = 'absolute';
      textArea.style.width = '5px';
      textArea.style.height = '5px';
      textArea.style.padding = 0;
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';

        _patchedConsole.patchedConsoleInstance.log('Copying text command was ' + msg);

        if (typeof successCallback === 'function') {
          return successCallback(value);
        }

        return true;
      } catch (err) {
        _patchedConsole.patchedConsoleInstance.error('Oops, unable to copy', err);

        if (typeof failCallback === 'function') {
          return failCallback(value);
        }

        return false;
      }
    }
  }]);

  function CopyWrapper(props) {
    var _this;

    _classCallCheck(this, CopyWrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CopyWrapper).call(this, props));
    _this.flashEffect = _this.flashEffect.bind(_assertThisInitialized(_this));

    if (typeof props.mounted !== 'boolean') {
      _this.state = {
        'mounted': false
      };
    }

    _this.wrapperRef = _react.default.createRef();
    return _this;
  }

  _createClass(CopyWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var mounted = this.props.mounted;
      if (typeof mounted !== 'boolean') this.setState({
        'mounted': true
      });

      _reactTooltip.default.rebuild();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      _reactTooltip.default.rebuild();
    }
  }, {
    key: "flashEffect",
    value: function flashEffect() {
      var _this$props = this.props,
          flash = _this$props.flash,
          wrapperElement = _this$props.wrapperElement,
          flashActiveTransform = _this$props.flashActiveTransform,
          flashInactiveTransform = _this$props.flashInactiveTransform;
      var wrapper = this.wrapperRef.current;
      if (!flash || !wrapper) return null;

      if (typeof wrapperElement === 'function') {
        wrapper = _reactDom.default.findDOMNode(wrapper);
      }

      if (!wrapper) return null;
      wrapper.style.transform = flashActiveTransform;
      setTimeout(function () {
        wrapper.style.transform = flashInactiveTransform;
      }, 100);
    }
  }, {
    key: "onCopy",
    value: function () {
      var onCopy = this.props.onCopy;
      this.flashEffect();
      if (typeof onCopy === 'function') onCopy();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          value = _this$props2.value,
          children = _this$props2.children,
          mounted = _this$props2.mounted,
          wrapperElement = _this$props2.wrapperElement,
          iconProps = _this$props2.iconProps,
          includeIcon = _this$props2.includeIcon,
          className = _this$props2.className;
      if (!value) return null;
      var isMounted = mounted || this.state && this.state.mounted || false;
      var elemsToWrap = [];
      if (children) elemsToWrap.push(children);
      if (children && isMounted) elemsToWrap.push(' ');
      if (isMounted && includeIcon) elemsToWrap.push(_react.default.createElement("i", _extends({}, iconProps, {
        key: "copy-icon",
        className: "icon icon-fw icon-copy far",
        title: "Copy to clipboard"
      })));

      var wrapperProps = _underscore.default.extend({
        'ref': this.wrapperRef,
        'style': {
          'transition': 'transform .4s',
          'transformOrigin': '50% 50%'
        },
        'className': 'clickable copy-wrapper ' + className || '',
        'onClick': function copy() {
          return CopyWrapper.copyToClipboard(value, function (v) {
            _this2.onCopy();

            analytics.event('CopyWrapper', 'Copy', {
              'eventLabel': 'Value',
              'name': v
            });
          }, function (v) {
            analytics.event('CopyWrapper', 'ERROR', {
              'eventLabel': 'Unable to copy value',
              'name': v
            });
          });
        }
      }, _underscore.default.omit.apply(_underscore.default, [this.props, 'children', 'style', 'value', 'onCopy', 'mounted'].concat(_toConsumableArray(_underscore.default.keys(CopyWrapper.defaultProps)))));

      return _react.default.createElement(wrapperElement, wrapperProps, elemsToWrap);
    }
  }]);

  return CopyWrapper;
}(_react.default.PureComponent);

exports.CopyWrapper = CopyWrapper;
CopyWrapper.defaultProps = {
  'wrapperElement': 'div',
  'className': null,
  'flash': true,
  'iconProps': {},
  'includeIcon': true,
  'flashActiveTransform': 'scale3d(1.2, 1.2, 1.2) translate3d(0, 0, 0)',
  'flashInactiveTransform': 'translate3d(0, 0, 0)'
};
var saferMD5 = (0, _memoizeOne.default)(function (val) {
  try {
    return (0, _jsMd.default)(val);
  } catch (e) {
    _patchedConsole.patchedConsoleInstance.error(e);

    return 'Error';
  }
});
exports.saferMD5 = saferMD5;
var itemUtil = {
  isAnItem: isAnItem,
  generateLink: linkFromItem,
  atId: atIdFromObject,
  titleFromProps: function titleFromProps(props) {
    var title = itemUtil.getTitleStringFromContext(props.context || {});

    if (!title && props.href) {
      title = _url.default.parse(props.href).path;
    }

    return title || null;
  },
  getTitleStringFromContext: function getTitleStringFromContext(context) {
    return context.display_title || context.title || context.name || context.download || context.accession || context.uuid || (typeof context['@id'] === 'string' ? context['@id'] : null);
  },
  isDisplayTitleAccession: function isDisplayTitleAccession(context) {
    var displayTitle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var checkContains = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (!displayTitle) displayTitle = itemUtil.getTitleStringFromContext(context);
    if (context.accession && context.accession === displayTitle) return true;
    if (checkContains && displayTitle.indexOf(context.accession) > -1) return true;
    return false;
  },
  compareResultsByID: function compareResultsByID(listA, listB) {
    var listALen = listA.length;
    if (listALen !== listB.length) return false;

    for (var i = 0; i < listALen; i++) {
      if (atIdFromObject(listA[i]) !== atIdFromObject(listB[i])) return false;
    }

    return true;
  },
  uniq: function uniq(items) {
    return _underscore.default.uniq(items, false, function (o) {
      return atIdFromObject(o);
    });
  },
  User: {
    buildGravatarURL: function buildGravatarURL(email) {
      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var defaultImg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'retro';
      var url = 'https://www.gravatar.com/avatar/' + saferMD5(email);
      url += "?d=" + defaultImg;
      if (size) url += '&s=' + size;
      return url;
    },
    gravatar: function gravatar(email) {
      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var defaultImg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'retro';
      return _react.default.createElement("img", _extends({
        title: "Obtained via Gravatar"
      }, props, {
        src: itemUtil.User.buildGravatarURL(email, size, defaultImg),
        className: 'gravatar' + (props.className ? ' ' + props.className : '')
      }));
    },
    localRegexValidation: {
      email: '^[a-Z0-9][a-Z0-9._%+-]{0,63}@(?:(?=[a-Z0-9-]{1,63}\.)[a-Z0-9]+(?:-[a-Z0-9]+)*\.){1,8}[a-Z]{2,63}$',
      phone: '[+]?[\\d]{10,36}((\\sx|\\sext|\\sextension)(\\s)?[\\d]{1,7})?$'
    }
  }
};
exports.itemUtil = itemUtil;