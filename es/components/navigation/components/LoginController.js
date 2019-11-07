'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogoutController = exports.LoginController = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _Alerts = require("./../../ui/Alerts");

var JWT = _interopRequireWildcard(require("./../../util/json-web-token"));

var _navigate = require("./../../util/navigate");

var _ajax = require("./../../util/ajax");

var _object = require("./../../util/object");

var _analytics = require("./../../util/analytics");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** Imported in componentDidMount. */
var Auth0Lock = null; // Manual polyfill for NPM tests, @see https://github.com/facebook/create-react-app/issues/1064

if (!require.ensure) {
  console.error("No require.ensure present - \nFine if within an NPM test, error if in browser/webpack context.");

  require.ensure = function (deps, cb) {
    return cb(require);
  };
}
/** Controls Login process, also shows Registration Modal */


var LoginController =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(LoginController, _React$PureComponent);

  function LoginController(props) {
    var _this;

    _classCallCheck(this, LoginController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoginController).call(this, props));
    _this.showLock = _underscore["default"].throttle(_this.showLock.bind(_assertThisInitialized(_this)), 1000, {
      trailing: false
    });
    _this.loginCallback = _this.loginCallback.bind(_assertThisInitialized(_this));
    _this.loginErrorCallback = _this.loginErrorCallback.bind(_assertThisInitialized(_this));
    _this.onRegistrationComplete = _this.onRegistrationComplete.bind(_assertThisInitialized(_this));
    _this.onRegistrationCancel = _this.onRegistrationCancel.bind(_assertThisInitialized(_this));
    _this.state = {
      "isRegistrationModalVisible": false,
      "isLoading": false // Whether are currently performing login/registration request.

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
          auth0Options = _this$props.auth0Options;

      require.ensure(["auth0-lock"], function (require) {
        // As of 9.11.0, auth0-js (dependency of Auth0Lock) cannot work outside of browser context.
        // We import it here in separate bundle instead to avoid issues during server-side render.
        Auth0Lock = require("auth0-lock")["default"];
        _this2.lock = new Auth0Lock(auth0ClientID, auth0Domain, auth0Options);

        _this2.lock.on("authenticated", _this2.loginCallback);
      }, "auth0-lock-bundle");
    }
  }, {
    key: "showLock",
    value: function showLock() {
      if (!this.lock || !this.lock.show) return; // Not yet mounted

      this.lock.show();
    }
  }, {
    key: "loginCallback",
    value: function loginCallback(authResult, successCallback, errorCallback) {
      var _this3 = this;

      var updateUserInfo = this.props.updateUserInfo; // First stage: we just have gotten JWT from the Auth0 widget but have not auth'd it against it our own system
      // to see if this is a valid user account or some random person who just logged into their Google account.

      var idToken = authResult.idToken; //JWT

      if (!idToken) return;
      JWT.save(idToken); // We just got token from Auth0 so probably isn't outdated.

      this.setState({
        "isLoading": true
      }, function () {
        _this3.lock.hide(); // Second stage: get this valid OAuth account (Google or w/e) auth'd from our end.


        Promise.race([(0, _ajax.fetch)('/login', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + idToken
          },
          body: JSON.stringify({
            id_token: idToken
          })
        }), new Promise(function (resolve, reject) {
          setTimeout(function () {
            reject({
              'description': 'timed out',
              'type': 'timed-out'
            });
          }, 90000);
          /* 90 seconds */
        })]).then(function (response) {
          // Add'l Error Check (will throw to be caught)
          if (response.code || response.status) throw response;
          return response;
        }).then(function (r) {
          console.info('Received info from server about user via /login endpoint', r);
          JWT.saveUserInfoLocalStorage(r);
          updateUserInfo();

          _Alerts.Alerts.deQueue(_Alerts.Alerts.LoggedOut);

          console.info('Login completed'); // Fetch user profile and use their primary lab as the eventLabel.

          var profileURL = (_underscore["default"].findWhere(r.user_actions || [], {
            'id': 'profile'
          }) || {}).href;

          if (profileURL) {
            _this3.setState({
              "isLoading": false
            }); // Register an analytics event for UI login.
            // This is used to segment public vs internal audience in Analytics dashboards.


            (0, _ajax.load)(profileURL, function (profile) {
              if (typeof successCallback === 'function') {
                successCallback(profile);
              } // Refresh the content/context of our page now that we have a JWT stored as a cookie!
              // It will return same page but with any auth'd page actions.


              (0, _navigate.navigate)('', {
                "inPlace": true
              });
            }, 'GET', function () {
              throw new Error('Request to profile URL failed.');
            });
          } else {
            throw new Error('No profile URL found in user_actions.');
          }
        })["catch"](function (error) {
          // Handle Errors
          console.error("Error during login: ", error.description);
          console.log(error);

          _this3.setState({
            "isLoading": false
          });

          _Alerts.Alerts.deQueue(_Alerts.Alerts.LoggedOut); // If is programatically called with error CB, let error CB handle everything.


          var errorCallbackFxn = typeof errorCallback === 'function' ? errorCallback : _this3.loginErrorCallback;
          errorCallbackFxn(error);
        });
      });
    }
  }, {
    key: "loginErrorCallback",
    value: function loginErrorCallback(error) {
      if (!error.code && error.type === 'timed-out') {
        // Server or network error of some sort most likely.
        _Alerts.Alerts.queue(_Alerts.Alerts.LoginFailed);
      } else if (error.code === 401) {
        // Present a registration form
        //navigate('/error/login-failed');
        this.setState({
          'isRegistrationModalVisible': true
        });
      } else {
        _Alerts.Alerts.queue(_Alerts.Alerts.LoginFailed);
      }
    }
  }, {
    key: "onRegistrationComplete",
    value: function onRegistrationComplete() {
      var _this4 = this;

      var token = JWT.get();
      var decodedToken = JWT.decode(token);
      this.loginCallback({
        'idToken': token
      }, // Success callback -- shows "Success" Alert msg.
      function (userProfile) {
        var userDetails = JWT.getUserDetails(); // We should have this after /login

        var userProfileURL = userProfile && _object.itemUtil.atId(userProfile);

        var userFullName = userDetails.first_name && userDetails.last_name && userDetails.first_name + ' ' + userDetails.last_name || null;

        var msg = _react["default"].createElement("ul", {
          className: "mb-0"
        }, _react["default"].createElement("li", null, "You are now logged in as ", _react["default"].createElement("span", {
          className: "text-500"
        }, userFullName, userFullName ? ' (' + decodedToken.email + ')' : decodedToken.email), "."), _react["default"].createElement("li", null, "Please visit ", _react["default"].createElement("b", null, _react["default"].createElement("a", {
          href: userProfileURL
        }, "your profile")), " to edit your account settings or information."));

        _this4.setState({
          'isRegistrationModalVisible': false
        }); // Moved out of setState callback because no guarantee that setState callback is fired
        // if component becomes unmounted (which occurs after login).


        _Alerts.Alerts.queue({
          "title": "Registered & Logged In",
          "message": msg,
          "style": 'success',
          'navigateDisappearThreshold': 2
        });
      }, function () {
        _this4.setState({
          'isRegistrationModalVisible': false
        });

        JWT.remove(); // Cleanup any remaining JWT, just in case.

        _Alerts.Alerts.queue(_Alerts.Alerts.LoginFailed);
      });
    }
  }, {
    key: "onRegistrationCancel",
    value: function onRegistrationCancel() {
      // TODO:
      this.setState({
        'isRegistrationModalVisible': false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          passProps = _objectWithoutProperties(_this$props2, ["children"]);

      var _this$state = this.state,
          isLoading = _this$state.isLoading,
          isRegistrationModalVisible = _this$state.isRegistrationModalVisible;
      var showLock = this.showLock,
          onRegistrationCancel = this.onRegistrationCancel,
          onRegistrationComplete = this.onRegistrationComplete;
      return _react["default"].cloneElement(children, _objectSpread({
        isLoading: isLoading,
        isRegistrationModalVisible: isRegistrationModalVisible,
        showLock: showLock,
        onRegistrationCancel: onRegistrationCancel,
        onRegistrationComplete: onRegistrationComplete
      }, passProps));
    }
  }]);

  return LoginController;
}(_react["default"].PureComponent);

exports.LoginController = LoginController;

_defineProperty(LoginController, "propTypes", {
  'updateUserInfo': _propTypes["default"].func.isRequired,
  'id': _propTypes["default"].string,
  'auth0ClientID': _propTypes["default"].string.isRequired,
  'auth0Domain': _propTypes["default"].string.isRequired,
  'auth0Options': _propTypes["default"].object,
  'children': _propTypes["default"].node.isRequired
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
    var isAdmin = Array.isArray(profile.groups) && profile.groups.indexOf('admin') > -1;

    if (!isAdmin) {
      // Exclude admins from analytics tracking
      (0, _analytics.event)('Authentication', 'UILogin', {
        'eventLabel': profile.lab && _object.itemUtil.atId(profile.lab) || 'No Lab'
      });
    }
  }
});

var LogoutController =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(LogoutController, _React$PureComponent2);

  function LogoutController(props) {
    var _this5;

    _classCallCheck(this, LogoutController);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(LogoutController).call(this, props));
    _this5.performLogout = _this5.performLogout.bind(_assertThisInitialized(_this5));
    return _this5;
  }
  /**
   * Removes JWT from cookies, as well as userInfo from localStorage
   * and then refreshes current view/href via navigate fxn.
   *
   * @param {Event} [evt] - Not needed. Will prevent default / stopPropagation if present.
   */


  _createClass(LogoutController, [{
    key: "performLogout",
    value: function performLogout() {
      var evt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var updateUserInfo = this.props.updateUserInfo;

      if (evt && evt.preventDefault) {
        evt.preventDefault();
        evt.stopPropagation();
      } // Removes both idToken (cookie) and userInfo (localStorage)


      JWT.remove(); // Refetch page context without our old JWT to hide any forbidden content.

      updateUserInfo();
      (0, _navigate.navigate)('', {
        'inPlace': true
      });

      if (typeof document !== 'undefined') {
        // Dummy click event to close dropdown menu, bypasses document.body.onClick handler (app.js -> App.prototype.handeClick)
        document.dispatchEvent(new MouseEvent('click'));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          children = _this$props3.children,
          passProps = _objectWithoutProperties(_this$props3, ["children"]);

      return _react["default"].cloneElement(children, _objectSpread({
        performLogout: this.performLogout
      }, passProps));
    }
  }]);

  return LogoutController;
}(_react["default"].PureComponent);

exports.LogoutController = LogoutController;