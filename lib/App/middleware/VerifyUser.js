"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = verifyUser;
var _Context = require("@/System/Context");
var _ApiError = _interopRequireDefault(require("@/App/error/ApiError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function verifyUser(req, res, next) {
  var uuid = req.body.uuid;
  console.log(uuid);
  if (uuid == undefined) {
    return new _ApiError["default"](res, 400, "Invalid UUID. Try again");
  }
  if (_Context.ApplicationContext.wss.verifyUUID(uuid)) {
    next();
  } else {
    return new _ApiError["default"](res, 400, "Invalid UUID. Try again");
  }
}