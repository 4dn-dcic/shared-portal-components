function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import _ from 'underscore';

/**
 * A registry of views to text and possibly sub-text strings.
 * Used to register an Item view to be the renderer for a given Item type[/action], for example.
 *
 * Copied over from ENCODE.
 */
var Registry = /*#__PURE__*/function () {
  function Registry(options) {
    _classCallCheck(this, Registry);
    // May provide custom providedBy and fallback functions
    this.views = {};
    _.extend(this, options);
  }
  _createClass(Registry, [{
    key: "providedBy",
    value: function providedBy(obj) {
      return obj['@type'] || [];
    }
  }, {
    key: "register",
    value: function register(view, for_, name) {
      name = name || '';
      var views = this.views[name];
      if (!views) {
        this.views[name] = views = {};
      }
      views[for_] = view;
    }
  }, {
    key: "unregister",
    value: function unregister(for_, name) {
      var views = this.views[name || ''];
      if (!views) {
        return;
      }
      delete views[for_];
    }
  }, {
    key: "lookup",
    value: function lookup(obj, name) {
      var views = this.views[name || ''];
      if (!views) {
        return this.fallback(obj, name);
      }
      var provided = this.providedBy(obj);
      for (var i = 0, len = provided.length; i < len; i++) {
        var view = views[provided[i]];
        if (view) {
          return view;
        }
      }
      return this.fallback(obj, name);
    }
  }, {
    key: "getAll",
    value: function getAll(name) {
      var views = this.views[name || ''];
      return views || {};
    }
  }, {
    key: "fallback",
    value: function fallback() {}
  }]);
  return Registry;
}();
export { Registry as default };