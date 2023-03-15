import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'underscore';
import jwt from 'jsonwebtoken';
import { Alerts } from '../../ui/Alerts';
import * as JWT from '../../util/json-web-token';
import { navigate } from '../../util/navigate';
import { load, fetch, promise as ajaxPromise } from '../../util/ajax';
import { event as trackEvent, setUserID } from '../../util/analytics';
import * as logger from '../../util/logger';
import { LoginController } from './LoginController';
var Auth0Lock = null;

/** New Login model, extended LoginController with slightly different interaction */
export var RedisLoginController = /*#__PURE__*/function (_LoginController) {
  _inherits(RedisLoginController, _LoginController);
  var _super = _createSuper(RedisLoginController);
  function RedisLoginController(props) {
    _classCallCheck(this, RedisLoginController);
    return _super.call(this, props);
  }

  // override componentDidMount to pass differring options to Auth0Lock
  _createClass(RedisLoginController, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;
      var auth0OptionsFallback = this.props.auth0Options;
      var isAuth0LibraryLoaded = this.state.isAuth0LibraryLoaded;
      ajaxPromise("/auth0_config").then(function (_ref) {
        var auth0Client = _ref.auth0Client,
          auth0Domain = _ref.auth0Domain,
          auth0Options = _ref.auth0Options;
        console.log("calling componentDidMount");
        if (!auth0Client || !auth0Domain) {
          // This will never happen unless network is down or issue with the orchestration... might be worth throwing an error (?)
          return; // Skip setting "isAuth0LibraryLoaded": true, idk.
        }

        var options = _objectSpread(_objectSpread({}, auth0OptionsFallback), auth0Options);
        var createLock = function () {
          _this.lock = new Auth0Lock(auth0Client, auth0Domain, options);
          _this.lock.on("authenticated", _this.validateCookieAndObtainAdditionalUserInfo);
          setTimeout(function () {
            _this.setState({
              "isAuth0LibraryLoaded": true
            });
          }, 200);
        };
        if (!isAuth0LibraryLoaded) {
          // prefetch & preload enabled here since is likely that user might want to click Login very quickly after loading webpage.
          import( /* webpackChunkName: "auth0-lock-bundle" */
          /* webpackMode: "lazy" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          "auth0-lock").then(function (_ref2) {
            var Auth0LockImport = _ref2["default"];
            Auth0Lock = Auth0LockImport;
            // As of 9.11.0, auth0-js (dependency of Auth0Lock) cannot work outside of browser context.
            // We import it here in separate bundle instead to avoid issues during server-side render.
            createLock();
            setTimeout(function () {
              _this.setState({
                "isAuth0LibraryLoaded": true
              });
            }, 200);
          });
        } else {
          createLock();
        }
      });
    }

    // Slightly modified - send code returned from Auth0 to /callback to get a session token
  }, {
    key: "validateCookieAndObtainAdditionalUserInfo",
    value: function validateCookieAndObtainAdditionalUserInfo(token) {
      var _this2 = this;
      var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var errorCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var _this$props = this.props,
        updateAppSessionState = _this$props.updateAppSessionState,
        _this$props$onLogin = _this$props.onLogin,
        onLogin = _this$props$onLogin === void 0 ? null : _this$props$onLogin;
      console.log('calling validateCookieAndObtainAdditionalUserInfo');
      this.setState({
        "isLoading": true
      }, function () {
        _this2.lock.hide();

        // Second stage: get this valid OAuth account (Google or w/e) auth'd from our end.
        // We probably can get rid of this Promise.race wrapper, since request/server will likely time out in 30s, idk..
        Promise.race([
        // Server will save as httpOnly cookie.
        fetch('/callback', {
          method: "GET",
          body: JSON.stringify({
            "code": token
          })
        }), new Promise(function (resolve, reject) {
          setTimeout(function () {
            reject({
              'description': 'timed out',
              'type': 'timed-out'
            });
          }, 90000); /* 90 seconds */
        })]).then(function (_ref3) {
          var _ref3$saved_cookie = _ref3.saved_cookie,
            saved_cookie = _ref3$saved_cookie === void 0 ? false : _ref3$saved_cookie;
          if (!saved_cookie) {
            throw new Error("Couldn't set session in /callback");
          }
          // This should return a 401 error if user not found, to caught and handled as 'unregistered user'
          return fetch("/session-properties");
        }).then(function (response) {
          // Add'l Error Check (will throw to be caught by errorCallback)
          // (HTTPExceptions from Pyramid generally have a code and status in response body)
          if (response.code || response.status) throw response;
          return response;
        }).then(function (userInfoResponse) {
          console.info('Received info from server about user via /session-properties endpoint', userInfoResponse);
          var _userInfoResponse$det = userInfoResponse.details,
            _userInfoResponse$det2 = _userInfoResponse$det === void 0 ? {} : _userInfoResponse$det,
            _userInfoResponse$det3 = _userInfoResponse$det2.email,
            userEmail = _userInfoResponse$det3 === void 0 ? null : _userInfoResponse$det3,
            _userInfoResponse$use = userInfoResponse.user_actions,
            user_actions = _userInfoResponse$use === void 0 ? [] : _userInfoResponse$use;
          if (!userEmail) {
            throw new Error("Did not receive user details from /session-properties, login failed.");
          }

          // Fetch user profile and (outdated/to-revisit-later) use their primary lab as the eventLabel.
          var profileURL = (_.findWhere(user_actions, {
            'id': 'profile'
          }) || {}).href;
          if (profileURL) {
            _this2.setState({
              "isLoading": false
            });
            JWT.saveUserInfoLocalStorage(userInfoResponse);
            updateAppSessionState(); // <- this function (in App.js) is now expected to call `Alerts.deQueue(Alerts.LoggedOut);`
            console.info('Login completed');

            // Register an analytics event for UI login.
            // This is used to segment public vs internal audience in Analytics dashboards.
            load(profileURL, function (profile) {
              if (typeof successCallback === 'function') {
                successCallback(profile);
              }
              if (typeof onLogin === 'function') {
                onLogin(profile);
              }
              var userId = profile.uuid,
                _profile$groups = profile.groups,
                groups = _profile$groups === void 0 ? null : _profile$groups;
              setUserID(userId);
              trackEvent('Authentication', 'UILogin', {
                eventLabel: "Authenticated ClientSide",
                name: userId,
                userId: userId,
                userGroups: groups && JSON.stringify(groups.sort())
              });

              // Refresh the content/context of our page now that we have a JWT stored as a cookie!
              // It will return same page but with any auth'd page actions.

              // Attempt to preserve hash, if any, but don't scroll to it.
              var windowHash = window && window.location && window.location.hash || '';
              navigate(windowHash, {
                "inPlace": true,
                "dontScrollToTop": !!windowHash
              });
            }, 'GET', function () {
              throw new Error('Request to profile URL failed.');
            });
          } else {
            throw new Error('No profile URL found in user_actions.');
          }
        })["catch"](function (error) {
          // Handle Errors
          logger.error("Error during login: ", error.description);
          console.log(error);
          _this2.setState({
            "isLoading": false
          });
          // Alerts.deQueue(Alerts.LoggedOut);
          setUserID(null);
          if (typeof errorCallback === "function") {
            errorCallback(error);
          }
        });
      });
    }
  }]);
  return RedisLoginController;
}(LoginController);