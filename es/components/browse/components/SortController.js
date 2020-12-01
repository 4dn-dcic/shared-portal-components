'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'querystring';
import memoize from 'memoize-one';
import _ from 'underscore';
import { navigate as _navigate } from './../../util/navigate';
export var SortController = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SortController, _React$PureComponent);

  var _super = _createSuper(SortController);

  _createClass(SortController, null, [{
    key: "getSortColumnAndReverseFromContext",
    value: function getSortColumnAndReverseFromContext(context) {
      var defaults = {
        'sortColumn': null,
        'sortReverse': false
      };
      if (!context || !context.sort) return defaults;
      var sortKey = Object.keys(context.sort);

      if (sortKey.length > 0) {
        // Use first if multiple.
        // eslint-disable-next-line prefer-destructuring
        sortKey = sortKey[0];
      } else {
        return defaults;
      }

      var reverse = context.sort[sortKey].order === 'desc';
      return {
        'sortColumn': sortKey,
        'sortReverse': reverse
      };
    }
  }]);

  function SortController(props) {
    var _this;

    _classCallCheck(this, SortController);

    _this = _super.call(this, props);
    _this.sortBy = _this.sortBy.bind(_assertThisInitialized(_this));
    _this.state = {
      'changingPage': false
    }; // 'changingPage' = historical name, analogous of 'loading'

    _this.memoized = {
      getSortColumnAndReverseFromContext: memoize(SortController.getSortColumnAndReverseFromContext)
    };
    return _this;
  }

  _createClass(SortController, [{
    key: "sortBy",
    value: function sortBy(key, reverse) {
      var _this2 = this;

      var _this$props = this.props,
          propNavigate = _this$props.navigate,
          _this$props$href = _this$props.href,
          currSearchHref = _this$props$href === void 0 ? null : _this$props$href,
          _this$props$requested = _this$props.requestedCompoundFilterSet,
          requestedCompoundFilterSet = _this$props$requested === void 0 ? null : _this$props$requested;
      var href = null;

      if (currSearchHref) {
        href = currSearchHref;
      } else if (requestedCompoundFilterSet) {
        href = "?" + requestedCompoundFilterSet.global_flags || "";
      } else {
        throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
      }

      if (typeof propNavigate !== 'function') throw new Error("No navigate function.");
      if (typeof href !== 'string') throw new Error("Browse doesn't have props.href.");
      this.setState({
        'changingPage': true
      }, function () {
        var _url$parse = url.parse(href, true),
            query = _url$parse.query,
            urlParts = _objectWithoutProperties(_url$parse, ["query"]);

        if (key) {
          query.sort = (reverse ? '-' : '') + key;
        } else {
          delete query.sort;
        }

        var stringifiedNextQuery = queryString.stringify(query);
        var navTarget = null;

        if (currSearchHref) {
          urlParts.search = '?' + queryString.stringify(query);
          navTarget = url.format(urlParts);
        } else if (requestedCompoundFilterSet) {
          navTarget = _objectSpread(_objectSpread({}, requestedCompoundFilterSet), {}, {
            "global_flags": stringifiedNextQuery
          });
        } else {
          throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
        }

        propNavigate(navTarget, {
          'replace': true
        }, function () {
          _this2.setState({
            'changingPage': false
          });
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          context = _this$props2.context,
          passProps = _objectWithoutProperties(_this$props2, ["children", "context"]);

      var _this$memoized$getSor = this.memoized.getSortColumnAndReverseFromContext(context),
          sortColumn = _this$memoized$getSor.sortColumn,
          sortReverse = _this$memoized$getSor.sortReverse;

      var childProps = _objectSpread(_objectSpread({}, passProps), {}, {
        context: context,
        sortColumn: sortColumn,
        sortReverse: sortReverse,
        sortBy: this.sortBy
      });

      return React.Children.map(children, function (c) {
        if (! /*#__PURE__*/React.isValidElement(c) || typeof c.type === "string") return c;
        return /*#__PURE__*/React.cloneElement(c, childProps);
      });
    }
  }]);

  return SortController;
}(React.PureComponent);

_defineProperty(SortController, "propTypes", {
  'href': PropTypes.string.isRequired,
  'context': PropTypes.object.isRequired,
  'navigate': PropTypes.func,
  'children': PropTypes.node.isRequired
});

_defineProperty(SortController, "defaultProps", {
  'navigate': function navigate(href, options, callback) {
    console.info('Called SortController.props.navigate with:', href, options, callback);
    if (typeof _navigate === 'function') return _navigate.apply(_navigate, arguments);
  }
});