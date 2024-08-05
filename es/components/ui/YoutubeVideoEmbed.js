import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
function _callSuper(_this, derived, args) {
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
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
  function YoutubeVideoEmbed(props) {
    var _this2;
    _classCallCheck(this, YoutubeVideoEmbed);
    _this2 = _callSuper(this, YoutubeVideoEmbed, [props]);
    _this2.state = {
      showVideo: false,
      preconnected: false
    };
    _.bindAll(_this2, ['showIframe', 'preconnectToYoutube', 'getIframeJSX']);
    return _this2;
  }
  _inherits(YoutubeVideoEmbed, _React$Component);
  return _createClass(YoutubeVideoEmbed, [{
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