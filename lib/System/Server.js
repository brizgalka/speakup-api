"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = void 0;
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _expressFileupload = _interopRequireDefault(require("express-fileupload"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var CorsOrigin = process.env.CORS_ORIGIN;
var Server = /*#__PURE__*/_createClass(function Server(options) {
  var _this = this;
  _classCallCheck(this, Server);
  this.port = options.port;
  this.app = options.app;
  this.router = options.router;
  this.prisma = options.prisma;
  this.cookieSecret = options.cookieSecret;
  this.app.use((0, _expressFileupload["default"])({
    limits: {
      fileSize: 50 * 1024 * 1024
    }
  }));
  this.app.use((0, _cors["default"])({
    origin: CorsOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204
  }));
  this.app.use(_bodyParser["default"].urlencoded());
  this.app.use(_bodyParser["default"].json());
  this.app.use((0, _cookieParser["default"])(this.cookieSecret));
  this.app.use("/api", this.router);
  this.app.listen(this.port, function () {
    console.log("server started on port ".concat(_this.port));
  });
});
exports.Server = Server;