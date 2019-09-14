'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboveSearchTablePanel = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _underscore = _interopRequireDefault(require("underscore"));

var _patchedConsole = require("./../../util/patched-console");

var _ajax = require("./../../util/ajax");

var _schemaTransforms = require("./../../util/schema-transforms");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AboveSearchTablePanelStaticContentPane = function (_React$Component) {
  _inherits(AboveSearchTablePanelStaticContentPane, _React$Component);

  _createClass(AboveSearchTablePanelStaticContentPane, null, [{
    key: "isTargetHrefValid",
    value: function isTargetHrefValid(targetHref) {
      if (typeof targetHref === 'string') return true;
      return false;
    }
  }]);

  function AboveSearchTablePanelStaticContentPane(props) {
    var _this;

    _classCallCheck(this, AboveSearchTablePanelStaticContentPane);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AboveSearchTablePanelStaticContentPane).call(this, props));
    _this.state = {
      'content': null,
      'title': null
    };

    _this.loadStaticContent();

    return _this;
  }

  _createClass(AboveSearchTablePanelStaticContentPane, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      if (AboveSearchTablePanelStaticContentPane.isTargetHrefValid(this.props.targetHref) && this.props.targetHref !== pastProps.targetHref) {
        this.loadStaticContent();
      }
    }
  }, {
    key: "loadStaticContent",
    value: function loadStaticContent() {
      var _this2 = this;

      var targetHref = this.props.targetHref;

      if (!AboveSearchTablePanelStaticContentPane.isTargetHrefValid(targetHref)) {
        return null;
      }

      var callback = function (resp) {
        if (!resp || resp.code && (resp.code === 403 || resp.code === 404)) {
          _this2.setState(function (_ref) {
            var content = _ref.content;

            if (content !== null) {
              return {
                content: null,
                title: null
              };
            }

            return null;
          });

          return null;
        }

        var content = null;
        var title = null;

        if (resp && resp.content) {
          if (resp.content && typeof resp.content !== 'string' && resp['@type'].indexOf('StaticPage') > -1) {
            var contentSectionKeys = _underscore.default.keys(resp.content);

            if (contentSectionKeys.length > 0) {
              var contentSectionToUse = _underscore.default.find(resp.content, function (c) {
                return c.order === 0;
              }) || resp.content[contentSectionKeys[0]];
              content = contentSectionToUse.content;
              title = contentSectionToUse.title || resp.title || resp.display_title;
            }
          } else if (typeof resp.content === 'string') {
            content = resp.content;
            title = resp.display_title || resp.title;
          }
        }

        if (content) {
          _this2.setState({
            content: content,
            title: title
          });
        }
      };

      (0, _ajax.load)(targetHref, callback, 'GET', callback);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.content || !AboveSearchTablePanelStaticContentPane.isTargetHrefValid(this.props.targetHref)) return null;
      var title = null;

      if (this.state.title) {
        title = _react.default.createElement("h4", {
          className: "text-300"
        }, this.state.title);
      }

      return _react.default.createElement("div", {
        className: "row mt-1"
      }, _react.default.createElement("div", {
        className: "col-sm-12 col-lg-9 pull-right"
      }, title, _react.default.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: this.state.content
        }
      })));
    }
  }]);

  return AboveSearchTablePanelStaticContentPane;
}(_react.default.Component);

var cachedMapping = null;

var AboveSearchTablePanel = function (_React$PureComponent) {
  _inherits(AboveSearchTablePanel, _React$PureComponent);

  _createClass(AboveSearchTablePanel, null, [{
    key: "currentItemTypesFromHrefParts",
    value: function currentItemTypesFromHrefParts(urlParts, schemas) {
      var searchItemType = 'Item',
          abstractType;

      if (typeof urlParts.query.type === 'string') {
        if (urlParts.query.type !== 'Item') {
          searchItemType = urlParts.query.type;
        }
      }

      abstractType = (0, _schemaTransforms.getAbstractTypeForType)(searchItemType, schemas);
      return {
        searchItemType: searchItemType,
        abstractType: abstractType
      };
    }
  }]);

  function AboveSearchTablePanel(props) {
    var _this3;

    _classCallCheck(this, AboveSearchTablePanel);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(AboveSearchTablePanel).call(this, props));
    _this3.state = {
      'mapping': cachedMapping || null
    };
    return _this3;
  }

  _createClass(AboveSearchTablePanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      if (!this.state.mapping && typeof this.props.mappingLocation === 'string') {
        (0, _ajax.load)(this.props.mappingLocation, function (resp) {
          if (resp && resp.mapping && _underscore.default.keys(resp.mapping).length > 0) {
            _this4.setState({
              'mapping': resp.mapping
            });

            if (_this4.props.cacheMappingGlobally) {
              cachedMapping = resp.mapping;
            }
          }
        });
      }
    }
  }, {
    key: "routeStaticContentHref",
    value: function routeStaticContentHref() {
      var _this$props = this.props,
          contextHref = _this$props.href,
          context = _this$props.context,
          schemas = _this$props.schemas;
      var lookupMap = this.state.mapping;
      var targetHref = null;

      var urlParts = _url.default.parse(contextHref, true);

      var _AboveSearchTablePane = AboveSearchTablePanel.currentItemTypesFromHrefParts(urlParts, schemas),
          searchItemType = _AboveSearchTablePane.searchItemType,
          abstractType = _AboveSearchTablePane.abstractType;

      targetHref = lookupMap && (lookupMap[abstractType] || lookupMap[searchItemType]) || null;

      if (typeof targetHref === 'string') {
        return targetHref;
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "above-table-panel"
      }, _react.default.createElement(AboveSearchTablePanelStaticContentPane, {
        targetHref: this.routeStaticContentHref()
      }));
    }
  }]);

  return AboveSearchTablePanel;
}(_react.default.PureComponent);

exports.AboveSearchTablePanel = AboveSearchTablePanel;
AboveSearchTablePanel.propTypes = {
  'href': _propTypes.default.string.isRequired,
  'context': _propTypes.default.object.isRequired,
  'mappingLocation': _propTypes.default.any,
  'cacheMappingGlobally': _propTypes.default.bool
};
AboveSearchTablePanel.defaultProps = {
  "mappingLocation": "/sysinfos/search-header-mappings/",
  "cacheMappingGlobally": true
};