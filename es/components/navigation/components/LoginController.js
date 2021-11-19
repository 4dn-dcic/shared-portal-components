'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'underscore';
import jwt from 'jsonwebtoken';
import { Alerts } from './../../ui/Alerts';
import * as JWT from './../../util/json-web-token';
import { navigate } from './../../util/navigate';
import { load, fetch, promise as ajaxPromise } from './../../util/ajax';
import { event as trackEvent, setUserID } from './../../util/analytics';
import * as logger from '../../util/logger';
/** Imported in componentDidMount. */

var Auth0Lock = null;
/** Controls Login process, also shows Registration Modal */

export var LoginController = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(LoginController, _React$PureComponent);

  var _super = _createSuper(LoginController);

  function LoginController(props) {
    var _this;

    _classCallCheck(this, LoginController);

    _this = _super.call(this, props);
    _this.showLock = _.throttle(_this.showLock.bind(_assertThisInitialized(_this)), 1000, {
      trailing: false
    });
    _this.validateCookieAndObtainAdditionalUserInfo = _this.validateCookieAndObtainAdditionalUserInfo.bind(_assertThisInitialized(_this));
    _this.auth0LoginCallback = _this.auth0LoginCallback.bind(_assertThisInitialized(_this));
    _this.onRegistrationComplete = _this.onRegistrationComplete.bind(_assertThisInitialized(_this));
    _this.onRegistrationCancel = _this.onRegistrationCancel.bind(_assertThisInitialized(_this));
    _this.state = {
      // Contains email of Auth0-authenticated user but not in-system user
      "unverifiedUserEmail": null,
      // Whether the code-split JS library for Auth0 has loaded yet.
      // If false, is used to make Login/Register Button disabled temporarily.
      "isAuth0LibraryLoaded": false,
      // Whether are currently performing login/registration request.
      "isLoading": false,
      // Held in here temporarily for user registration purposes.
      // Should be deleted by time user can authenticate
      "jwtToken": null
    };
    return _this;
  }

  _createClass(LoginController, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          auth0ClientID = _this$props.auth0ClientID,
          auth0Domain = _this$props.auth0Domain,
          auth0Options = _this$props.auth0Options; // prefetch & preload enabled here since is likely that user might want to click Login very quickly after loading webpage.

      import(
      /* webpackChunkName: "auth0-lock-bundle" */

      /* webpackMode: "lazy" */

      /* webpackPrefetch: true */

      /* webpackPreload: true */
      "auth0-lock").then(function (_ref) {
        var Auth0LockImport = _ref["default"];
        Auth0Lock = Auth0LockImport; // As of 9.11.0, auth0-js (dependency of Auth0Lock) cannot work outside of browser context.
        // We import it here in separate bundle instead to avoid issues during server-side render.

        _this2.lock = new Auth0Lock(auth0ClientID, auth0Domain, auth0Options);

        _this2.lock.on("authenticated", _this2.auth0LoginCallback);

        setTimeout(function () {
          _this2.setState({
            "isAuth0LibraryLoaded": true
          });
        }, 200);
      });
    }
  }, {
    key: "showLock",
    value: function showLock() {
      if (!this.lock || !this.lock.show) return; // Not yet mounted

      this.lock.show();
    }
  }, {
    key: "validateCookieAndObtainAdditionalUserInfo",
    value: function validateCookieAndObtainAdditionalUserInfo(token) {
      var _this3 = this;

      var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var errorCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var _this$props2 = this.props,
          updateAppSessionState = _this$props2.updateAppSessionState,
          _this$props2$onLogin = _this$props2.onLogin,
          onLogin = _this$props2$onLogin === void 0 ? null : _this$props2$onLogin;
      this.setState({
        "isLoading": true
      }, function () {
        _this3.lock.hide(); // Second stage: get this valid OAuth account (Google or w/e) auth'd from our end.
        // We probably can get rid of this Promise.race wrapper, since request/server will likely time out in 30s, idk..


        Promise.race([// Server will save as httpOnly cookie.
        fetch('/login', {
          method: "POST",
          body: JSON.stringify({
            "id_token": token
          })
        }), new Promise(function (resolve, reject) {
          setTimeout(function () {
            reject({
              'description': 'timed out',
              'type': 'timed-out'
            });
          }, 90000);
          /* 90 seconds */
        })]).then(function (_ref2) {
          var _ref2$saved_cookie = _ref2.saved_cookie,
              saved_cookie = _ref2$saved_cookie === void 0 ? false : _ref2$saved_cookie;

          if (!saved_cookie) {
            throw new Error("Couldn't set session in /login");
          } // This should return a 401 error if user not found, to caught and handled as 'unregistered user'


          return fetch("/session-properties");
        }).then(function (response) {
          // Add'l Error Check (will throw to be caught by errorCallback)
          // (HTTPExceptions from Pyramid generally have a code and status in response body)
          if (response.code || response.status) throw response;
          return response;
        }).then(function (userInfoResponse) {
          console.info('Received info from server about user via /session-properties endpoint', userInfoResponse);
          var _userInfoResponse$det = userInfoResponse.details;
          _userInfoResponse$det = _userInfoResponse$det === void 0 ? {} : _userInfoResponse$det;
          var _userInfoResponse$det2 = _userInfoResponse$det.email,
              userEmail = _userInfoResponse$det2 === void 0 ? null : _userInfoResponse$det2,
              _userInfoResponse$use = userInfoResponse.user_actions,
              user_actions = _userInfoResponse$use === void 0 ? [] : _userInfoResponse$use;

          if (!userEmail) {
            throw new Error("Did not receive user details from /session-properties, login failed.");
          } // Fetch user profile and (outdated/to-revisit-later) use their primary lab as the eventLabel.


          var profileURL = (_.findWhere(user_actions, {
            'id': 'profile'
          }) || {}).href;

          if (profileURL) {
            _this3.setState({
              "isLoading": false
            });

            JWT.saveUserInfoLocalStorage(userInfoResponse);
            updateAppSessionState(); // <- this function (in App.js) is now expected to call `Alerts.deQueue(Alerts.LoggedOut);`

            console.info('Login completed'); // Register an analytics event for UI login.
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
              }); // Refresh the content/context of our page now that we have a JWT stored as a cookie!
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

          _this3.setState({
            "isLoading": false
          }); // Alerts.deQueue(Alerts.LoggedOut);


          setUserID(null);

          if (typeof errorCallback === "function") {
            errorCallback(error);
          }
        });
      });
    }
  }, {
    key: "auth0LoginCallback",
    value: function auth0LoginCallback(authResult) {
      var _this4 = this;

      // First stage: we just have gotten JWT from the Auth0 widget but have not auth'd it against it our own system
      // to see if this is a valid user account or some random person who just logged into their Google account.
      var idToken = authResult.idToken; // Server will ensure that we have a validly signed JWT token/cookie and that the user account exists in system.

      this.validateCookieAndObtainAdditionalUserInfo(idToken, null, function (error) {
        console.error(error);

        if (!error.code && error.type === 'timed-out') {
          // Server or network error of some sort most likely.
          Alerts.queue(Alerts.LoginFailed);
        } else if (error.code === 401) {
          // User account not in system -- present a registration form
          var decodedToken = jwt.decode(idToken);

          var _ref3 = decodedToken || {},
              unverifiedUserEmail = _ref3.email;

          if (unverifiedUserEmail) {
            // Somewhat weird/hacky approach to mask the idToken in private func enclosure
            // and not leave potentially-more-exposed in state
            _this4.onRegistrationCompleteBoundWithToken = _this4.onRegistrationComplete.bind(_this4, idToken);

            _this4.setState({
              unverifiedUserEmail: unverifiedUserEmail
            });
          } else {
            throw new Error("Expected to receive unverified user email.");
          }
        } else {
          Alerts.queue(Alerts.LoginFailed);
        }
      });
    }
    /** This function must be bound to an idToken before it can be used. */

  }, {
    key: "onRegistrationComplete",
    value: function onRegistrationComplete(idToken) {
      var _this5 = this;

      var unverifiedUserEmail = this.state.unverifiedUserEmail;

      if (!idToken) {
        throw Error("Expected an idToken");
      } // Delete bound version of self


      delete this.onRegistrationCompleteBoundWithToken;
      this.validateCookieAndObtainAdditionalUserInfo(idToken, // Success callback -- shows "Success" Alert msg.
      function () {
        var userDetails = JWT.getUserDetails(); // We should have this after /login

        var userUUID = userDetails.uuid,
            first_name = userDetails.first_name,
            last_name = userDetails.last_name;
        var userFullName = first_name && last_name ? first_name + " " + last_name : first_name || last_name || null;
        var msg = /*#__PURE__*/React.createElement("ul", {
          className: "mb-0"
        }, /*#__PURE__*/React.createElement("li", null, "You are now logged in as ", /*#__PURE__*/React.createElement("span", {
          className: "text-500"
        }, userFullName, userFullName ? ' (' + unverifiedUserEmail + ')' : unverifiedUserEmail), "."), /*#__PURE__*/React.createElement("li", null, "Please visit ", /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement("a", {
          href: "/users/".concat(userUUID, "/")
        }, "your profile")), " to edit your account settings or information.")); // Moved out of setState callback because no guarantee that setState callback is fired
        // if component becomes unmounted (which occurs after login).

        Alerts.queue({
          "title": "Registered & Logged In",
          "message": msg,
          "style": 'success',
          'navigateDisappearThreshold': 2
        });

        _this5.setState({
          "unverifiedUserEmail": null
        });
      }, function () {
        _this5.setState({
          "unverifiedUserEmail": null
        }); // Cleanup any remaining JWT (deprecated re: httpOnly cookie)


        JWT.remove();
        setUserID(null);
        Alerts.queue(Alerts.LoginFailed);
      });
    }
  }, {
    key: "onRegistrationCancel",
    value: function onRegistrationCancel() {
      delete this.onRegistrationCompleteBoundWithToken; // Cleanup any remaining JWT (deprecated re: httpOnly cookie)

      JWT.remove();
      this.setState({
        "unverifiedUserEmail": null
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          children = _this$props3.children,
          passProps = _objectWithoutProperties(_this$props3, ["children"]);

      var _this$state = this.state,
          isLoading = _this$state.isLoading,
          isAuth0LibraryLoaded = _this$state.isAuth0LibraryLoaded,
          unverifiedUserEmail = _this$state.unverifiedUserEmail;

      var childProps = _objectSpread(_objectSpread({}, passProps), {}, {
        isLoading: isLoading,
        unverifiedUserEmail: unverifiedUserEmail,
        isAuth0LibraryLoaded: isAuth0LibraryLoaded,
        "showLock": this.showLock
      });

      if (unverifiedUserEmail) {
        // aka in registration mode.
        childProps.onRegistrationComplete = this.onRegistrationCompleteBoundWithToken;
        childProps.onRegistrationCancel = this.onRegistrationCancel;
      }

      return React.Children.map(children, function (child) {
        if (! /*#__PURE__*/React.isValidElement(child) || typeof child.type === "string") {
          return child;
        }

        return /*#__PURE__*/React.cloneElement(child, childProps);
      });
    }
  }]);

  return LoginController;
}(React.PureComponent);
/**
 * Deletes cookies from our app server and Auth0
 * @todo Grab hms-dbmi.auth0.com from somewhere in ini files or similar.
 *
 * @returns a Promise that can keep attaching callbacks to.
 */

_defineProperty(LoginController, "propTypes", {
  'updateAppSessionState': PropTypes.func.isRequired,
  'id': PropTypes.string,
  'auth0ClientID': PropTypes.string.isRequired,
  'auth0Domain': PropTypes.string.isRequired,
  'auth0Options': PropTypes.object,
  'children': PropTypes.node.isRequired
});

_defineProperty(LoginController, "defaultProps", {
  // Login / logout actions must be deferred until Auth0 is ready.
  // TODO: these (maybe) should be read in from base and production.ini
  'auth0ClientID': 'DPxEwsZRnKDpk0VfVAxrStRKukN14ILB',
  'auth0Domain': 'hms-dbmi.auth0.com',
  'auth0Options': {
    auth: {
      sso: false,
      redirect: false,
      responseType: 'token',
      params: {
        scope: 'openid email',
        prompt: 'select_account'
      }
    },
    socialButtonStyle: 'big',
    theme: {
      logo: '/static/img/4dn_logo.svg',
      icon: '/static/img/4dn_logo.svg',
      primaryColor: '#009aad'
    },
    allowedConnections: ['github', 'google-oauth2', 'partners'],
    languageDictionary: {
      title: 'Log In',
      emailInputPlaceholder: 'email@partners.org',
      databaseEnterpriseAlternativeLoginInstructions: 'or login via Partners'
    }
  },
  'onLogin': function onLogin(profile) {
    console.log("Logged in", profile);
  }
});

export function performLogout() {
  arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "hms-dbmi.auth0.com";
  arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DPxEwsZRnKDpk0VfVAxrStRKukN14ILB";

  // Grab here, gets deleted at end of response.
  var _ref4 = JWT.getUserDetails() || {},
      uuid = _ref4.uuid;

  return fetch("/logout").then(function (response) {
    var _response$deleted_coo = response.deleted_cookie,
        deleted_cookie = _response$deleted_coo === void 0 ? false : _response$deleted_coo;

    if (!deleted_cookie) {
      throw new Error("Couldn't delete cookie, check network");
    } // Removes userInfo (localStorage)


    JWT.remove(); // Maybe todo, if can this window to autoclose in some amount of time..
    // AJAX doesn't work for that Auth0 endpoint.
    // See https://auth0.com/docs/api/authentication#logout
    // window.open(`https://${auth0Domain}/v2/logout?client_id=${auth0ClientID}`);

    return response;
  }).then(function (auth0LogoutResponse) {
    console.log("Logged out", auth0LogoutResponse);
    trackEvent('Authentication', 'UILogout', {
      eventLabel: "Logged Out ClientSide",
      userId: uuid
    });
  });
}
export var LogoutController = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(LogoutController, _React$PureComponent2);

  var _super2 = _createSuper(LogoutController);

  function LogoutController(props) {
    var _this6;

    _classCallCheck(this, LogoutController);

    _this6 = _super2.call(this, props);
    _this6.performLogoutUI = _this6.performLogoutUI.bind(_assertThisInitialized(_this6));
    _this6.state = {
      "isLoading": false
    };
    return _this6;
  }
  /**
   * Removes JWT from cookies, as well as userInfo from localStorage
   * and then refreshes current view/href via navigate fxn.
   *
   * @param {Event} [evt] - Not needed. Will prevent default / stopPropagation if present.
   */


  _createClass(LogoutController, [{
    key: "performLogoutUI",
    value: function performLogoutUI() {
      var _this7 = this;

      var evt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (evt && evt.preventDefault) {
        evt.preventDefault();
        evt.stopPropagation();
      }

      this.setState({
        "isLoading": true
      }, function () {
        performLogout().then(function () {
          _this7.setState({
            "isLoading": false
          }); // Remove from analytics session


          setUserID(null); // Attempt to preserve hash, if any, but don't scroll to it.

          var windowHash = window && window.location && window.location.hash || '';
          console.info("Logged out; re-loading context");
          navigate(windowHash, {
            "inPlace": true,
            "dontScrollToTop": !!windowHash
          });

          if (typeof document !== 'undefined') {
            // Dummy click event to close dropdown menu, bypasses document.body.onClick handler (app.js -> App.prototype.handeClick)
            document.dispatchEvent(new MouseEvent('click'));
          }
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          children = _this$props4.children,
          passProps = _objectWithoutProperties(_this$props4, ["children"]);

      var isLoading = this.state.isLoading;
      return /*#__PURE__*/React.cloneElement(children, _objectSpread(_objectSpread({}, passProps), {}, {
        isLoading: isLoading,
        performLogout: this.performLogoutUI
      }));
    }
  }]);

  return LogoutController;
}(React.PureComponent);