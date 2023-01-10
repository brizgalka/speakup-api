"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiError = _interopRequireDefault(require("@/App/error/ApiError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function isSetCookie(obj) {
  return 'set' in obj;
}
var modelResponse = /*#__PURE__*/function () {
  function modelResponse(status, response, cookie) {
    _classCallCheck(this, modelResponse);
    this.status = status;
    this.response = response;
    this.cookie = cookie;
  }
  _createClass(modelResponse, null, [{
    key: "responseRequest",
    value: function responseRequest(res, response) {
      if (response instanceof modelResponse) {
        if (response.cookie != undefined) {
          if (isSetCookie(response.cookie)) {
            res.cookie(response.cookie.set.name, response.cookie.set.value, response.cookie.set.options);
          } else {
            for (var i = 0; i < response.cookie.clear.length; i++) {
              res.clearCookie(response.cookie.clear[i]);
            }
          }
        }
        if (response.response != undefined) {
          console.log("отвечаем");
          res.status(response.status).send(response.response);
        } else {
          res.sendStatus(response.status);
        }
      } else {
        if (response.response) {
          new _ApiError["default"](res, response.status, response.response);
        } else {
          new _ApiError["default"](res, response.status);
        }
      }
    }
  }]);
  return modelResponse;
}();
var _default = modelResponse;
exports["default"] = _default;