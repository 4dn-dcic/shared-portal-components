function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
/**
 * Much of this code was inspired by https://www.npmjs.com/package/react-lite-youtube-embed
 *
 * @TODO: Review the security policy update that to allows requests to Youtube, etc. and get this working.
 * @TODO: Add playlist support (currently probably? broken)
 */

import { patchedConsoleInstance as console } from '../util/patched-console';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
var YOUTUBE_BASE_URL = 'https://www.youtube.com';
var YT_IMG_URL = 'https://i.ytimg.com';
export var YoutubeVideoEmbed = /*#__PURE__*/function (_React$Component) {
  _inherits(YoutubeVideoEmbed, _React$Component);
  var _super = _createSuper(YoutubeVideoEmbed);
  function YoutubeVideoEmbed(props) {
    var _this;
    _classCallCheck(this, YoutubeVideoEmbed);
    _this = _super.call(this, props);
    _this.state = {
      showVideo: false,
      preconnected: false
    };
    _.bindAll(_assertThisInitialized(_this), ['showIframe', 'preconnectToYoutube', 'getIframeJSX']);
    return _this;
  }
  _createClass(YoutubeVideoEmbed, [{
    key: "showIframe",
    value: function showIframe() {
      var showVideo = this.state.showVideo;
      if (!showVideo) {
        this.setState({
          showVideo: true
        });
      }
    }
  }, {
    key: "preconnectToYoutube",
    value: function preconnectToYoutube() {
      var preconnected = this.state.preconnected;
      if (!preconnected) {
        this.setState({
          preconnected: true
        });
      }
    }
  }, {
    key: "getIframeJSX",
    value: function getIframeJSX() {
      var _this$props = this.props,
        videoID = _this$props.videoID,
        videoTitle = _this$props.videoTitle,
        isPlaylist = _this$props.isPlaylist,
        shouldAutoplay = _this$props.shouldAutoplay,
        params = _this$props.params;
      var showVideo = this.state.showVideo;

      // Be extra careful with these, since they're going raw into the iframe SRC
      var embedID = encodeURIComponent(videoID);
      var paramsEn = params ? '&' + encodeURI(params) : '';

      // Lazy loading video as playlist or individual
      var autoplay = shouldAutoplay || !shouldAutoplay && showVideo ? '1' : '0';
      var videoEmbedURL = isPlaylist ? "".concat(YOUTUBE_BASE_URL, "/embed/videoseries?autoplay=").concat(autoplay, "&list=").concat(embedID) : "".concat(YOUTUBE_BASE_URL, "/embed/").concat(embedID, "?autoplay=").concat(autoplay, "&state=1").concat(paramsEn);
      return /*#__PURE__*/React.createElement("iframe", {
        src: videoEmbedURL,
        title: videoTitle,
        width: "560" // not really in use
        ,
        height: "315" // not really in use
        ,
        frameBorder: "0",
        allow: "accelerometer;".concat(shouldAutoplay ? ' autoplay;' : '', " encrypted-media; gyroscope; picture-in-picture"),
        allowFullScreen: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        videoID = _this$props2.videoID,
        videoTitle = _this$props2.videoTitle,
        isPlaylist = _this$props2.isPlaylist,
        shouldAutoplay = _this$props2.shouldAutoplay,
        posterSize = _this$props2.posterSize,
        aspectHeight = _this$props2.aspectHeight,
        aspectWidth = _this$props2.aspectWidth;
      var _this$state = this.state,
        showVideo = _this$state.showVideo,
        preconnected = _this$state.preconnected;
      if (!videoID) {
        console.error('YoutubeVideoEmbed component must have an embedID.');
        return null;
      } else if (isPlaylist) {
        console.error('YoutubeVideoEmbed component does not yet support playlists. Please use a single video.');
        return null;
      }

      // Calculate aspect ratio
      var aspectRatio = "".concat(aspectHeight / aspectWidth * 100, "%");
      var embedWrapperStyle = {
        '--aspect-ratio': aspectRatio,
        paddingBottom: aspectRatio
      };
      if (shouldAutoplay) {
        // Just render the video in the iFrame immediately
        return /*#__PURE__*/React.createElement("div", {
          className: "youtube-embed-lazyload-poster",
          style: embedWrapperStyle
        }, this.getIframeJSX());
      }

      // Ensure this fits in a URL
      var embedID = encodeURIComponent(videoID);

      // Loading webp image, for speed and progressiveness of loading
      var posterURL = !isPlaylist ? "".concat(YT_IMG_URL, "/vi_webp/").concat(embedID, "/").concat(posterSize, ".webp") : "".concat(YT_IMG_URL, "/vi_webp/").concat(playlistCoverID, "/").concat(posterSize, ".webp");
      embedWrapperStyle.backgroundImage = "url(".concat(posterURL, ")");
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("link", {
        rel: "preload",
        href: posterURL,
        as: "image"
      }), preconnected && /*#__PURE__*/React.createElement("link", {
        rel: "preconnect",
        href: YOUTUBE_BASE_URL
      }), /*#__PURE__*/React.createElement("div", {
        className: "youtube-embed-lazyload-poster",
        onPointerOver: this.preconnectToYoutube,
        onClick: this.showIframe,
        "data-title": videoTitle,
        style: embedWrapperStyle
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "youtube-embed-fake-play-btn"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-play fas"
      })), showVideo ? this.getIframeJSX() : null));
    }
  }]);
  return YoutubeVideoEmbed;
}(React.Component);
YoutubeVideoEmbed.defaultProps = {
  videoID: null,
  // The embed's id
  videoTitle: 'CGAP Video Content',
  // What is the video's title? (For accessibility purposes)
  posterSize: 'hqdefault',
  // What size image should lazy load before the video? See below for options
  aspectHeight: 9,
  // Self-explanatory
  aspectWidth: 16,
  // Self-explanatory
  shouldAutoplay: false,
  // Should the video autoplay by default?
  isPlaylist: false,
  // Is the youtube video's ID an embedded playlist?
  params: '' // Used for time start strings, etc. Should be formatted 'key=value&key2=value2'
};

YoutubeVideoEmbed.propTypes = {
  videoID: PropTypes.string.isRequired,
  videoTitle: PropTypes.string.isRequired,
  posterSize: PropTypes.oneOf(['default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault']).isRequired,
  aspectHeight: PropTypes.number,
  aspectWidth: PropTypes.number,
  shouldAutoplay: PropTypes.bool,
  isPlaylist: PropTypes.bool,
  params: PropTypes.string // @TODO: update this to be more specific to how params should be formatted
};